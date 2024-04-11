import graphql from "graphql";
const {
    GraphQLObjectType,      // used to create types
    GraphQLInt, 
    GraphQLString,
    GraphQLBoolean 
} = graphql;

//   defines a UserConversation
const ConversationType = new GraphQLObjectType({
    name: "Conversation",
    fields: () => ({
        id: {type: GraphQLInt},
    }),
});

export default ConversationType;