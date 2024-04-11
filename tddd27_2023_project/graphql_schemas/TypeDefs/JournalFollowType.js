import graphql from "graphql";
const {
    GraphQLObjectType,      // used to create types
    GraphQLInt, 
    GraphQLString,
    GraphQLBoolean 
} = graphql;

//   defines a JournalFollow
const JournalFollowType = new GraphQLObjectType({
    name: "JournalFollow",
    fields: () => ({
        user_id: {type: GraphQLInt},
        journal_id:{type: GraphQLInt}
       
    }),
});

export default JournalFollowType;