import graphql from "graphql";
const {
    GraphQLObjectType,      // used to create types
    GraphQLInt, 
    GraphQLString,
} = graphql;

//   defines a Journal Entry
const JournalEntryType = new GraphQLObjectType({
    name: "JournalEntry",
    fields: () => ({
        id: {type: GraphQLInt},
        body: {type: GraphQLString},
        journal_id: {type: GraphQLInt},
    }),
});

export default JournalEntryType;