//import express from 'express';
import {createTables} from './table_models.js';
import {graphqlHTTP} from "express-graphql";     // used to create graphql server
import graphqlUploadExpress from "graphql-upload/graphqlUploadExpress.mjs";
import cors from "cors";

import cookieParser from "cookie-parser";
import { applyMiddleware } from "graphql-middleware"; 
import permissions from "./authorization/index.js";
import dotenv from "dotenv";
const express = require('express');


const app = express();

import WebSocket, {WebSocketServer} from "ws";

var wss  = new WebSocketServer({
  port: 3009
});


wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    // Handle WebSocket disconnection
    ws.on('close', () => {
        console.log('WebSocket disconnected');
    });
});

const port = 3002;

dotenv.config();

import schema from "./graphql_schemas/index.js";

const middlewares = [permissions];
const schemaWithPermissions = applyMiddleware(schema, ...middlewares);

var whitelist = 'http://localhost:3000'

const corsOptions = {
    origin: whitelist,
    credentials: true
}

createTables();

app.set("trust proxy", true); // only during production
app.use(cors(corsOptions));
app.use(cookieParser());
app.use('/graphql',
    graphqlUploadExpress({ maxFileSize: 90000000000, maxFiles: 10 }),
    graphqlHTTP((req, res) => {
        return {
            schema: schemaWithPermissions,
            graphiql: true,
            context: {
                res,
                req,
                token: req.cookies['token'],
            },
            uploads: false,
        }
    }
    )
);

app.listen(port, () => {
    console.log(`app listening on port ${port} \n`);
});
