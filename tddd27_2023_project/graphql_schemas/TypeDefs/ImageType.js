import graphql from "graphql";
const {
    GraphQLObjectType,      // used to create types
    GraphQLString,
} = graphql;

const ImageType = new GraphQLObjectType({
    name: "Image",
    fields: () => ({
        filename: {type: GraphQLString},
        mimetype: {type: GraphQLString},
        encoding: {type: GraphQLString},
    }),
});

export default ImageType;