import graphql from "graphql";
const {
    GraphQLObjectType,      // used to create types
    GraphQLInt, 
    GraphQLString,
    GraphQLBoolean 
} = graphql;

const UserConversationType = new GraphQLObjectType({
    name: "UserConversation",
    fields: () => ({
        user_id: {type: GraphQLInt},
        conversation_id:{type: GraphQLInt}
       
    }),
});

export default UserConversationType;