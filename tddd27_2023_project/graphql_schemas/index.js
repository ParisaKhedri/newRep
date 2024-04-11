import graphql from "graphql";
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLInt,
    GraphQLString,
    GraphQLList,
    GraphQLBoolean
} = graphql;

import GraphQLUpload from "graphql-upload/GraphQLUpload.mjs";
import { v4 } from 'uuid';
import {
    getUserModel,
    getJournalModel,
    getMessageModel,
    getJournalEntryModel,
    getConversationModel,
    getUserConversationModel,
    getUserFollowModel,
    getBlockModel,
    getJournalFollowModel
} from "../table_models.js";
import signToken from "../utils/signToken.js";
import hashPassword from "../utils/hashPassword.js";
import verifyPassword from "../utils/verifyPassword.js";
import UserType from './TypeDefs/UserType.js';
import JournalType from './TypeDefs/JournalType.js';
import JournalEntryType from './TypeDefs/JournalEntryType.js';
import UserConversationType from './TypeDefs/UserConversationType.js';
import ConversationType from './TypeDefs/ConversationType.js';
import UserFollowType from './TypeDefs/UserFollowType.js';
import BlockType from './TypeDefs/BlockType.js';
import DicType from './TypeDefs/DicType.js';
import JournalFollowType from './TypeDefs/JournalFollowType.js';
import ImageType from "./TypeDefs/ImageType.js";
import MessageType from "./TypeDefs/MessageType.js";
import * as fs from 'node:fs';
import { mkdirp } from 'mkdirp';
import { useInflection } from "sequelize";
//const { query } = require("express");

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        // --------------------------------------- Query Users ----------------------------------------------------
        getAllUsers: {
            type: new GraphQLList(UserType),
            resolve(parent, args) {
                return getUserModel.findAll();
            },
        },

        getResponderInConversation: {
            type: UserType,

            args: {
                user_id: { type: GraphQLInt },
                conversation_id: { type: GraphQLInt }
            },

            async resolve(parent, args) {

                const userConversations = await getUserConversationModel.findAll({
                    where: {
                        conversation_id: args.conversation_id,
                    }
                });

                for (var i in userConversations) {
                    if (userConversations[i].user_id != args.user_id) {
                        return getUserModel.findOne({
                            where: {
                                id: userConversations[i].user_id
                            }

                        });

                    }
                }
            },
        },
        getUserByUserName: {
            type: UserType,
            args: {
                user_name: { type: GraphQLString }
            },
            resolve(parent, args) {
                return getUserModel.findOne({
                    where: {
                        user_name: args.user_name
                    }

                });
            },
        },

        getUserByID: {
            type: UserType,
            args: {
                id: { type: GraphQLInt }
            },
            resolve(parent, args) {
                return getUserModel.findOne({
                    where: {
                        id: args.id
                    }

                });
            },
        },

        // --------------------------------------- Query Journals ----------------------------------------------------

        getAllJournalsFromUser: {
            type: new GraphQLList(JournalType),
            args: {
                author_id: { type: GraphQLInt }
            },
            resolve(parent, args) {
                return getJournalModel.findAll({
                    where: {
                        author_id: args.author_id
                    }
                });
            }
        },

        getAllJournalsByUserName: {
            type: new GraphQLList(JournalType),
            args: {
                user_name: { type: GraphQLString }
            },
            async resolve(parent, args) {
                const user = await getUserModel.findOne({
                    where: {
                        user_name: args.user_name
                    }
                });

                return getJournalModel.findAll({
                    where: {
                        author_id: user.id
                    }
                });
            }
        },

        getJournalById: {
            type: JournalType,
            args: {
                id: { type: GraphQLInt }
            },
            resolve(parent, args) {
                return getJournalModel.findOne({
                    where: {
                        id: args.id
                    }
                });
            }
        },

        getAllFollowedJournals: {
            type: new GraphQLList(JournalType),
            args: {
                followed_users: {type: new GraphQLList(GraphQLString)}
            },
            async resolve(parent, args) {
                var all_journals = [];
                const last_updated = {};

                for (var user_name of args.followed_users) {
                    const user = await getUserModel.findOne({
                        where: {
                            user_name: user_name
                        }
                    });
    
                    const journals = await getJournalModel.findAll({
                        where: {
                            author_id: user.id
                        }
                    });
                    all_journals = all_journals.concat(journals);
                }

                for (var journal of all_journals) {
                    const entry = await getJournalEntryModel.findOne({
                        where: {journal_id: journal.dataValues.id},
                        order: [ [ 'updatedAt', 'DESC' ]],
                    })
                    
                    last_updated[journal.dataValues.id] = entry.dataValues.updatedAt;
                }
                
                const updated = Object.entries(last_updated).sort(function(a,b){
                    if(a[1] > b[1]) return -1;
                    if(a[1] < b[1]) return 1;
                    return 0;
                });
                
                var sorted_journals = []

                for (var el of updated) {
                    const journal_id = Number(el[0]);
                    for (var journal of all_journals) {
                        if (journal.dataValues.id == journal_id) {
                            sorted_journals.push(journal);
                        }
                    }
                }

                return sorted_journals; 
            },
        },
        // --------------------------------------- Query Message ----------------------------------------------------

        getAllMessagesInConversationByConversationID: {
            type: new GraphQLList(MessageType),
            args: {
                conversation_id: { type: GraphQLInt }
            },
            resolve(parent, args) {
                return getMessageModel.findAll({
                    where: {
                        conversation_id: args.conversation_id
                    }
                });
            }
        },

        // --------------------------------------- Query Journal Entry ----------------------------------------------------
        getAllJournalEntriesInJournal: {
            type: new GraphQLList(JournalEntryType),
            args: {
                journal_id: { type: GraphQLInt }
            },
            resolve(parent, args) {
                return getJournalEntryModel.findAll({
                    where: {
                        journal_id: args.journal_id
                    }
                });
            }
        },

        getJournalEntryByID: {
            type: JournalEntryType,
            args: {
                id: { type: GraphQLInt }
            },
            resolve(parent, args) {
                return getJournalEntryModel.findOne({
                    where: {
                        id: args.id
                    }
                });
            }
        },

        // --------------------------------------- Query Conversation ----------------------------------------------------

        getAllConversationsByID: {
            type: new GraphQLList(ConversationType),
            args: {
                id: { type: GraphQLInt },
            },
            resolve(parent, args) {
                return getConversationModel.findAll({
                    where: {
                        id: args.id,
                    }
                });
            }
        },

        // --------------------------------------- Query User Conversation ----------------------------------------------------

        getAllUserConversationsByUserID: { 
            type: new GraphQLList(UserConversationType),
            args: {
                user_id: { type: GraphQLInt },
            },
            resolve(parent, args) {
                return getUserConversationModel.findAll({
                    where: {
                        user_id: args.user_id,
                    }
                });
            }
        },

        getAllUserAndConversationsByUserID: {
            type: new GraphQLList(DicType),
            args: {
                user_id: { type: GraphQLInt },
            },

            async resolve(parent, args) {
                var userAndConversationidList = []

                const myConversations = await getUserConversationModel.findAll({
                    where: {
                        user_id: args.user_id,
                    }
                });

                for (var i in myConversations) {
                    const userConversations = await getUserConversationModel.findAll({
                        where: {
                            conversation_id: myConversations[i].conversation_id,
                        }
                    });

                    for (var j in userConversations) {
                      
                        if (userConversations[j].user_id != args.user_id) {
                            const responder = await getUserModel.findOne({
                                where: {
                                    id: userConversations[j].user_id
                                }

                            });
                            var dic = {}
                            dic['conversation_id'] = userConversations[j].conversation_id;
                            dic['user_name'] = responder.user_name;
                            userAndConversationidList.push(dic)
                        }
                    }
                }
                return userAndConversationidList
            }
        },

        getSpecificUserConversation: {
            type: UserConversationType,
            args: {
                user_id: { type: GraphQLInt },
                conversation_id: { type: GraphQLInt },
            },
            resolve(parent, args) {
                return getUserConversationModel.findOne({
                    where: {
                        user_id: args.user_id,
                        conversation_id: args.conversation_id,
                    }
                });
            }
        },

        getUserConversationByUserConversationID: { // get 
            type: new GraphQLList(UserConversationType),
            args: {
                conversation_id: { type: GraphQLInt },
            },
            resolve(parent, args) {
                return getUserConversationModel.findAll({
                    where: {
                        conversation_id: args.conversation_id,
                    }
                });
            }
        },

        // --------------------------------------- Query User Follow ----------------------------------------------------

        getAllUserFollowByFollower: {
            type: new GraphQLList(GraphQLString),
            args: {
                follower_id: { type: GraphQLInt },
            },
            async resolve(parent, args) {
                const user_follows = await getUserFollowModel.findAll({
                    where: {
                        follower_id: args.follower_id,
                    }
                });
                var all_ids = [];

                for (const user_follow of user_follows) {
                    all_ids.push(user_follow.dataValues.followed_id);
                }

                var all_user_names = [];

                for (const id of all_ids) {
                    const user = await getUserModel.findOne({where: {
                        id: id
                    }})
                    const user_name = user.dataValues.user_name;
                    all_user_names.push(user_name);
                }
                
                return all_user_names;
            }
        },
        getAllUserFollowByFollowed: {
            type: new GraphQLList(UserFollowType),
            args: {
                followed_id: { type: GraphQLInt },
            },
            resolve(parent, args) {
                return getUserFollowModel.findAll({
                    where: {
                        followed_id: args.followed_id,
                    }
                });
            }
        },
        getSpecificUserFollow: {
            type: UserFollowType,
            args: {
                follower_id: { type: GraphQLInt },
                followed_id: { type: GraphQLInt },
            },
            resolve(parent, args) {
                return getUserFollowModel.findOne({
                    where: {
                        follower_id: args.follower_id,
                        followed_id: args.followed_id
                    }
                });
            }
        },

        // --------------------------------------- Query Block ----------------------------------------------------

        getAllBlockedByBlockerID: {
            type: new GraphQLList(BlockType),
            args: {
                blocker_id: { type: GraphQLInt },
            },
            resolve(parent, args) {
                return getBlockModel.findAll({
                    where: {
                        blocker_id: args.blocker_id,
                    }
                });
            }
        },

        getSpecificBlock: {
            type: BlockType,
            args: {
                blocker_id: { type: GraphQLInt },
                blocked_id: { type: GraphQLInt },
            },
            resolve(parent, args) {
                return getBlockModel.findOne({
                    where: {
                        blocker_id: args.blocker_id,
                        blocked_id: args.blocked_id
                    }
                });
            }
        },

        // --------------------------------------- Query Journal Follow ----------------------------------------------------

        getAllJournalFollowsByUserID: {
            type: new GraphQLList(JournalFollowType),
            args: {
                user_id: { type: GraphQLInt },
            },
            resolve(parent, args) {
                return getJournalFollowModel.findAll({
                    where: {
                        user_id: args.user_id,
                    }
                });
            }
        },

        getAllJournalFollowsByJournalID: {
            type: new GraphQLList(JournalFollowType),
            args: {
                journal_id: { type: GraphQLInt },
            },
            resolve(parent, args) {
                return getJournalFollowModel.findAll({
                    where: {
                        journal_id: args.journal_id,
                    }
                });
            }
        },

        getSpecificJournalFollow: {
            type: JournalFollowType,
            args: {
                user_id: { type: GraphQLInt },
                journal_id: { type: GraphQLInt },
            },
            resolve(parent, args) {
                return getJournalFollowModel.findOne({
                    where: {
                        user_id: args.user_id,
                        journal_id: args.journal_id
                    }
                });
            }
        },

    },
});

const RootMutation = new GraphQLObjectType({ // manipulation of tables
    name: "RootMutationType",
    fields: {

        // --------------------------------------- Mutation User ----------------------------------------------------


        createUser: {
            type: UserType,
            args: {
                email: { type: GraphQLString },
                user_name: { type: GraphQLString },
                first_name: { type: GraphQLString },
                last_name: { type: GraphQLString },
                phone_number: { type: GraphQLString },
                password: { type: GraphQLString },

            },
            async resolve(parent, args) {
                const hashedPassword = await hashPassword(args.password);

                await getUserModel.create({
                    email: args.email,
                    user_name: args.user_name,
                    first_name: args.first_name,
                    last_name: args.last_name,
                    phone_number: args.phone_number,
                    password: hashedPassword,
                });

            },
        },

        signInUser: {
            type: UserType,
            args: {
                user_name: { type: GraphQLString },
                password: { type: GraphQLString }
            },
            async resolve(parent, args, context) {
                const result = await getUserModel.findOne({
                    where: {
                        user_name: args.user_name,
                    }
                });

                const isValidPassword = await verifyPassword(result.password, args.password);

                if (!isValidPassword) {
                    throw new Error("Invalid password");
                }

                const token = signToken({ userId: result.id });

                // adds cookie to browser
                context.res.cookie("token", token, {
                    httpOnly: true,                     //prevents client-side scripts from accessing token
                    sameSite: 'strict',
                    //secure: true, //on https
                    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
                });

                return result;
            }
        },

        signOutUser: {
            type: GraphQLString,
            args: {
                void: {type: GraphQLString}
            },
            async resolve(parent, args, context) {
                context.res.clearCookie("token");
                return "cookie cleared";
            }
        },

        deleteUser: {
            type: GraphQLString,
            args: {
                id: { type: GraphQLInt },
            },
            async resolve(parent, args) {
                await getUserModel.destroy({
                    where: {
                        id: args.id,
                    },
                });
                return ("User by id " + args.id + " has been deleted!");
            },
        },

        changeUserPhoneNumber: {
            type: GraphQLString,
            args: {
                id: { type: GraphQLInt },
                new_phone_number: { type: GraphQLString },
            },
            async resolve(parent, args) {
                await getUserModel.update({ phone_number: args.new_phone_number }, {
                    where: {
                        id: args.id,
                    },
                });
                return ("User by id " + args.id + " has changed phone nummber to " + args.new_phone_number);
            },

        },

        changeUserEmail: {
            type: GraphQLString,
            args: {
                id: { type: GraphQLInt },
                new_email: { type: GraphQLString },
            },
            async resolve(parent, args) {
                await getUserModel.update({ email: args.new_email }, {
                    where: {
                        id: args.id,
                    },
                });
                return ("User by id " + args.id + " has changed email to " + args.new_email);
            },
        },

        changeUserFirstName: {
            type: GraphQLString,
            args: {
                id: { type: GraphQLInt },
                new_first_name: { type: GraphQLString },
            },
            async resolve(parent, args) {
                await getUserModel.update({ first_name: args.new_first_name }, {
                    where: {
                        id: args.id,
                    },
                });
                return ("User by id " + args.id + " has changed first name to " + args.new_first_name);
            },
        },

        changeUserLastName: {
            type: GraphQLString,
            args: {
                id: { type: GraphQLInt },
                new_last_name: { type: GraphQLString },
            },
            async resolve(parent, args) {
                await getUserModel.update({ last_name: args.new_last_name }, {
                    where: {
                        id: args.id,
                    },
                });
                return ("User by id " + args.id + " has changed last name to " + args.new_last_name);
            },
        },

        changeUserName: {
            type: GraphQLString,
            args: {
                id: { type: GraphQLInt },
                new_user_name: { type: GraphQLString },
            },
            async resolve(parent, args) {
                await getUserModel.update({ user_name: args.new_user_name }, {
                    where: {
                        id: args.id,
                    },
                });
                return ("User by id " + args.id + " has changed username to " + args.new_user_name);
            },
        },

        changePassword: {
            type: GraphQLString,
            args: {
                id: { type: GraphQLInt },
                new_password: { type: GraphQLString },
            },
            async resolve(parent, args) {
                await getUserModel.update({ password: args.new_password }, {
                    where: {
                        id: args.id,
                    },
                });
                return ("User by id " + args.id + " has changed their password to " + args.new_password);
            },
        },

        changeProfileImage: {
            type: GraphQLBoolean,
            args: {
                id: {type: GraphQLInt},
                new_image: {type: GraphQLUpload}
            },
            async resolve(parent, args) {
                const image = args.new_image;

                const { filename, mimetype, createReadStream} = await image;
                const stream = createReadStream();
                await mkdirp('client/public/uploads/images');
                const uuid = v4();
                const path = `client/public/uploads/images/${uuid}${filename}`;
                const promise = await new Promise((resolve, reject) => {
                    stream
                      .pipe(fs.createWriteStream(path))
                      .on('finish', () => {
                        resolve({
                          success: true,
                          message: 'Successfully Uploaded',
                          mimetype,
                          filename,
                          location: path
                        });
                      })
                      .on('error', (err) => {
                        return false;
                      });
                  });
                await getUserModel.update({profile_img: `./uploads/images/${uuid}${filename}`}, {
                    where: {
                        id: args.id
                    }
                })
                return true;
            },
        },

        changeProfileInfo: {
            type: UserType,
            args: {
                id: { type: GraphQLInt },
                new_username: { type: GraphQLString },
                new_description: { type: GraphQLString }
            },
            async resolve(parent, args) {
                await getUserModel.update({ user_name: args.new_username, profile_description: args.new_description }, {
                    where: {
                        id: args.id
                    }
                });
                return {
                    "id": args.id,
                    "user_name": args.new_username,
                    "profile_description": args.new_description
                }
            },
        },
        // --------------------------------------- Mutation Message ----------------------------------------------------
        createMessage: {
            type: MessageType,
            args: {
                user_id: { type: GraphQLInt },
                conversation_id: { type: GraphQLInt },
                content: { type: GraphQLString }
            },
            async resolve(parent, args) {
                await getMessageModel.create({
                    user_id: args.user_id,
                    conversation_id: args.conversation_id,
                    content: args.content
                });
                return args;
            },
        },
        // --------------------------------------- Mutation Journals ----------------------------------------------------

        createJournal: {
            type: JournalType,
            args: {
                name: { type: GraphQLString },
                author_id: { type: GraphQLInt },
                image_path: { type: GraphQLString },
                description: { type: GraphQLString },
                public: { type: GraphQLBoolean }

            },
            async resolve(parent, args) {
                await getJournalModel.create({
                    name: args.name,
                    author_id: args.author_id,
                    description: args.description,
                    image_path: args.image_path,
                    public: args.public,
                });

                const journal = await getJournalModel.findOne({
                    order: [['id', 'DESC']],
                });

                return journal;
            },

        },
        changeJournalName: {
            type: GraphQLString,
            args: {
                id: { type: GraphQLInt },
                new_name: { type: GraphQLString },
            },
            async resolve(parent, args) {
                await getJournalModel.update({ name: args.new_name }, {
                    where: {
                        id: args.id,
                    },
                });
                return ("Journal by id " + args.id + " has changed its name to " + args.new_name);
            },
        },
        changeJournalDescription: {
            type: GraphQLString,
            args: {
                id: { type: GraphQLInt },
                new_description: { type: GraphQLString },
            },
            async resolve(parent, args) {
                await getJournalModel.update({ description: args.new_description }, {
                    where: {
                        id: args.id,
                    },
                });
                return ("Journal by id " + args.id + " has changed its description to " + args.new_description);
            },
        },
        changePublicity: {
            type: GraphQLString,
            args: {
                id: { type: GraphQLInt },
                is_public: { type: GraphQLBoolean },
            },
            async resolve(parent, args) {
                await getJournalModel.update({ public: args.is_public }, {
                    where: {
                        id: args.id,
                    },
                });
                return ("Journal by id " + args.id + " has changed its publicity");
            },
        },

        // --------------------------------------- Mutation Journal Entry ----------------------------------------------------

        createJournalEntry: {
            type: JournalEntryType,
            args: {
                body: { type: GraphQLString },
                journal_id: { type: GraphQLInt }
            },
            async resolve(parent, args) {
                await getJournalEntryModel.create({
                    body: args.body,
                    journal_id: args.journal_id,
                });
                return args;
            },
        },
        changeEntryBody: {
            type: GraphQLString,
            args: {
                id: { type: GraphQLInt },
                new_body: { type: GraphQLString },
            },
            async resolve(parent, args) {
                await getJournalEntryModel.update({ body: args.new_body }, {
                    where: {
                        id: args.id,
                    },
                });
                return ("Journal Entry by id " + args.id + " has changed its body");
            },
        },
        // --------------------------------------- Mutation Conversation ----------------------------------------------------

        createConversation: {
            type: ConversationType,
            async resolve(parent, args) {
                return await getConversationModel.create();
            },
        },


        // --------------------------------------- Mutation User Conversation ----------------------------------------------------

        createUserConversation: {
            type: UserConversationType,
            args: {
                user_id: { type: GraphQLInt },
                responder_id: {type: GraphQLInt}
            },
            async resolve(parent, args) {
                const myConversations = await getUserConversationModel.findAll({
                    where: {
                        user_id: args.user_id,
                    }
                });
                var myConversationIDsArray = []
                
                for(var userConversation of myConversations){
                    const conversation_id = userConversation.dataValues.conversation_id;
                    myConversationIDsArray.push(conversation_id)

                }

                for( var conv_id of myConversationIDsArray){
                    var userConversations = await getUserConversationModel.findAll({
                        where: {
                            conversation_id: conv_id,
                        }
                    });

                    for( var userConversation of userConversations){
                        if(userConversation.dataValues.user_id == args.responder_id){
                            return userConversation
                        }

                    }
                    
                }

                var new_conv =  await getConversationModel.create();

                var new_conversation_id = new_conv.dataValues.id


                await getUserConversationModel.create({
                    user_id: args.user_id,
                    conversation_id: new_conversation_id,
                });

                return await getUserConversationModel.create({
                    user_id: args.responder_id,
                    conversation_id: new_conversation_id,
                });
            },
        },

        // --------------------------------------- Mutation User Follow ----------------------------------------------------

        createUserFollow: {
            type: GraphQLString,
            args: {
                follower_id: { type: GraphQLInt },
                followed_user_name: { type: GraphQLString }
            },
            async resolve(parent, args) {
                const followed = await getUserModel.findOne({
                    where: {
                        user_name: args.followed_user_name
                    }
                });
                const followed_id = followed.dataValues.id;

                await getUserFollowModel.create({
                    follower_id: args.follower_id,
                    followed_id: followed_id,
                });

                return "You followed " + args.followed_user_name;
            },
        },

        deleteUserFollow: {
            type: GraphQLString,
            args: {
                follower_id: { type: GraphQLInt },
                followed_user_name: {type: GraphQLString}
            },
            async resolve(parent, args) {
                 const followed = await getUserModel.findOne({
                    where: {
                        user_name: args.followed_user_name
                    }
                });
                const followed_id = followed.dataValues.id;

                await getUserFollowModel.destroy({ where: {
                    follower_id: args.follower_id,
                    followed_id: followed_id,
                    }
                });

                return "You unfollowed " + args.followed_user_name;
            },
        },

        // --------------------------------------- Mutation Block ----------------------------------------------------

        createBlock: {
            type: BlockType,
            args: {
                blocker_id: { type: GraphQLInt },
                blocked_id: { type: GraphQLInt }
            },
            async resolve(parent, args) {
                return await getBlockModel.create({
                    blocker_id: args.blocker_id,
                    blocked_id: args.blocked_id,
                });
            },
        },

        // --------------------------------------- Mutation Journal Follow ----------------------------------------------------

        createJournalFollow: {
            type: JournalFollowType,
            args: {
                user_id: { type: GraphQLInt },
                journal_id: { type: GraphQLInt }
            },
            async resolve(parent, args) {
                return await getJournalFollowModel.create({
                    user_id: args.user_id,
                    journal_id: args.journal_id,
                });
            },
        },
        // --------------------------------------- Mutation Upload ----------------------------------------------------

        uploadImage: {
            type: GraphQLBoolean,
            args: {
                image: { type: GraphQLUpload },
                journal_id: { type: GraphQLInt }
            },
            async resolve(parent, args) {
                const image = args.image;
                const journal_id = args.journal_id;

                const { filename, mimetype, createReadStream } = await image;
                const stream = createReadStream();
                await mkdirp('client/public/uploads/images');
                const uuid = v4();
                const path = `client/public/uploads/images/${uuid}${filename}`;
                const promise = await new Promise((resolve, reject) => {
                    stream
                        .pipe(fs.createWriteStream(path))
                        .on('finish', () => {
                            resolve({
                                success: true,
                                message: 'Successfully Uploaded',
                                mimetype,
                                filename,
                                location: path
                            });
                        })
                        .on('error', (err) => {
                            return false;
                        });
                });
                await getJournalModel.update({ image_path: `./uploads/images/${uuid}${filename}` }, {
                    where: {
                        id: journal_id
                    }
                })
                return true;
            }
        }

    },

});

export default new GraphQLSchema({ query: RootQuery, mutation: RootMutation });


