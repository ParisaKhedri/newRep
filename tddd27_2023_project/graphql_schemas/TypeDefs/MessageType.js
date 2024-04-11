import graphql from "graphql"; 
const {
    GraphQLObjectType,      // used to create types
    GraphQLInt, 
    GraphQLString,
    GraphQLBoolean 
} = graphql;

//   defines a UserConversation
const MessageType = new GraphQLObjectType({
    name: "Message",
    fields: () => ({
        id: {type: GraphQLInt},
        user_id:{type: GraphQLInt},
        conversation_id:{type: GraphQLInt},
        content: {type: GraphQLString},
    }),
});

export default MessageType;