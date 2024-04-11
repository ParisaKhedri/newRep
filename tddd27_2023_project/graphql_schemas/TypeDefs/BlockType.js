import graphql from "graphql";
const {
    GraphQLObjectType,      // used to create types
    GraphQLInt, 
    GraphQLString,
    GraphQLBoolean 
} = graphql;

//   defines a Block
const BlockType = new GraphQLObjectType({
    name: "Block",
    fields: () => ({
        blocker_id: {type: GraphQLInt},
        blocked_id:{type: GraphQLInt}
       
    }),
});

export default BlockType;