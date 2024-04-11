import { gql } from '@apollo/client';

export const LOAD_USERS = gql`
    query {
        getAllUsers {
        email
        user_name
        first_name
        last_name
        phone_number
        profile_img
        }
    }
`

export const LOAD_ALL_USER_CONVERSATION_ID = gql`
    query getAllUserConversationsByUserID($user_id: Int!){
        getAllUserConversationsByUserID(user_id: $user_id) {
            conversation_id
        }
    }
`

export const LOAD_ALL_USERS_IN_CONVERSATION = gql`
    query getUserConversationByUserConversationID($conversation_id: Int!) {
        getUserConversationByUserConversationID(conversation_id: $conversation_id){
            user_id
        }
    }
`

export const LOAD_RESPONDER = gql`
    query getResponderInConversation($user_id: Int!, $conversation_id: Int!) {
        getResponderInConversation(user_id: $user_id, conversation_id: $conversation_id){
            id
            email
            user_name
            first_name
            last_name
            phone_number
            profile_description
            profile_img
            password
            token
        }
    }
`

export const LOAD_CONVERSATIONID_WITH_RESPONDER = gql`
    query getAllUserAndConversationsByUserID($user_id: Int!) {
        getAllUserAndConversationsByUserID(user_id: $user_id){
            conversation_id
            user_name
        }
            
        
    }
`

export const LOAD_USER_JOURNALS = gql`
    query getAllJournalsFromUser($author_id: Int!) {
        getAllJournalsFromUser(author_id: $author_id) {
            id
            name
            description
            image_path
            public
        }
    }
`

export const GET_USER_BY_ID = gql`
    query getUserByID($id: Int!){
        getUserByID(id: $id){
            id
            email
            user_name
            first_name
            last_name
            phone_number
            profile_description
            profile_img
            password
            token

        }  
    }
`

export const GET_ALL_MESSAGES_BY_CONVERSATION_ID = gql`
    query getAllMessagesInConversationByConversationID($conversation_id: Int!){
        getAllMessagesInConversationByConversationID(conversation_id: $conversation_id){
            id
            user_id
            conversation_id
            content

        }
    }
`

export const LOAD_ALL_JOURNAL_ENTRIES = gql`
    query getAllJournalEntriesInJournal($journal_id: Int!) {
        getAllJournalEntriesInJournal(journal_id: $journal_id) {
            id
            body
        }
    }
`

export const LOAD_ALL_COMMUNITY_USER_JOURNALS = gql`
    query getAllJournalsByUserName($user_name: String!) {
        getAllJournalsByUserName(user_name: $user_name) {
            id
            name
            description
            image_path
            public
        }
    }
`

export const LOAD_USER_BY_USER_ID = gql`
    query getUserByID($id: Int!) {
        getUserByID(id: $id) {
            id
            email
            user_name
            first_name
            last_name
            phone_number
            profile_description
            profile_img
            createdAt
        }
    }
`

export const LOAD_USER_BY_USERNAME = gql`
    query getUserByUserName($user_name: String!) {
        getUserByUserName(user_name: $user_name) {
            id
            email
            user_name
            first_name
            last_name
            phone_number
            profile_description
            profile_img
            createdAt
        }
    }
`

export const GET_ALL_FOLLOWED_USERS = gql`
        query getAllUserFollowByFollower($follower_id: Int!) {
            getAllUserFollowByFollower(follower_id: $follower_id)
    }
`

export const LOAD_ALL_FOLLOWED_JOURNALS = gql`
    query getAllFollowedJournals($followed_users: [String]!) {
        getAllFollowedJournals(followed_users: $followed_users) {
            id
            name
            description
            image_path
            public
            author_id
        }
    }
`