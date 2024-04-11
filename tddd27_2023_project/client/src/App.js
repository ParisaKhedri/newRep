import './App.css';
import { Routes, Route } from 'react-router-dom';
import { 
  ApolloClient, 
  InMemoryCache, 
  ApolloProvider, 
} from '@apollo/client';
import {onError} from '@apollo/client/link/error';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Chatroom from './pages/Chatroom';
import SearchCommunity from './pages/SearchCommunity';
import EditorView from './pages/EditorView';
import ReadView from './pages/ReadView';
import { useState } from 'react';
import { createUploadLink } from "apollo-upload-client";
import CommunityHome from './pages/CommunityHome';
import Activity from './pages/Activity';
import Settings from './pages/Settings';

const errorLink = onError(({ graphqlErrors, networkErrors })=>{
  if(graphqlErrors) {
    graphqlErrors.map(({ message, location, path })=>{
      alert('Grapgql error ${message}');
    });
  }
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: createUploadLink({uri: "http://localhost:3002/graphql",
                          credentials: 'include',
                        }),
});

function App() {

  return (
    <ApolloProvider client={client}>
        <div className="App">
          <div id='container'>
            <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/home" element={<Home />} />
            <Route path="/chatroom" element={<Chatroom />} />
            <Route path="/searchCommunity" element={<SearchCommunity />} />
            <Route path="/editor" element={<EditorView />} />
            <Route path="/read_view" element={<ReadView />} />
            <Route path="/community_profile" element={<CommunityHome />} />
            <Route path="/activity" element={<Activity />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
          </div> 
        </div> 
    </ApolloProvider>
  );
}

export default App;
