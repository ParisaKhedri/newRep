import graphql from "graphql";
const {
    GraphQLObjectType,      // used to create types
    GraphQLInt, 
    GraphQLString,
    GraphQLBoolean 
} = graphql;

//   defines a UserConversation
const DicType = new GraphQLObjectType({
    name: "Dic",
    fields: () => ({
        conversation_id: {type: GraphQLInt},
        user_name: {type: GraphQLString},
    }),
});

export default DicType;