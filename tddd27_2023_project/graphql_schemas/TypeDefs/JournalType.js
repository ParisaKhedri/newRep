import graphql from "graphql";
const {
    GraphQLObjectType,      // used to create types
    GraphQLInt, 
    GraphQLString,
    GraphQLBoolean 
} = graphql;

const JournalType = new GraphQLObjectType({
    name: "Journal",
    fields: () => ({
        id: {type: GraphQLInt},
        name: {type: GraphQLString},
        description: {type: GraphQLString},
        image_path: {type: GraphQLString},
        public: {type: GraphQLBoolean},
        author_id: {type: GraphQLInt},
    }),
});

export default JournalType;