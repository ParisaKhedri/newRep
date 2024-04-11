import graphql from "graphql";
const {
    GraphQLObjectType,      // used to create types
    GraphQLInt, 
    GraphQLString,
    Kind,
    GraphQLScalarType
} = graphql;

//   defines a user
const UserType = new GraphQLObjectType({
    name: "User",
    fields: () => ({
        id: {type: GraphQLInt},
        email: {type: GraphQLString},
        user_name: {type: GraphQLString},
        first_name: {type: GraphQLString},
        last_name: {type: GraphQLString},
        phone_number: {type: GraphQLString},
        profile_description: {type: GraphQLString},
        profile_img: {type: GraphQLString},
        password: {type: GraphQLString},
        createdAt: {type: GraphQLString},
        token: {type: GraphQLString},
    }),
});

export default UserType;