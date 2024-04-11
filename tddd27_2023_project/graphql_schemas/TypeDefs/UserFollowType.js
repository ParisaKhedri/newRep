import graphql from "graphql";
const {
    GraphQLObjectType,      // used to create types
    GraphQLInt, 
    GraphQLString,
    GraphQLBoolean 
} = graphql;

//   defines a UserConversation
const UserFollowType = new GraphQLObjectType({
    name: "UserFollow",
    fields: () => ({
        follower_id: {type: GraphQLInt},
        followed_id:{type: GraphQLInt}
       
    }),
});

export default UserFollowType