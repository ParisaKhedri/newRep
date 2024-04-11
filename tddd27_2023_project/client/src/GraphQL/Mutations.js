import { gql } from '@apollo/client';

export const REGISTER_USER = gql`
    mutation createUser(
                $email: String!,
                $user_name: String!,
                $first_name: String!,
                $last_name: String!,
                $phone_number: String!,
                $password: String!) {
                    createUser(
                        email: $email,
                        user_name: $user_name,
                        first_name: $first_name,
                        last_name: $last_name,
                        phone_number: $phone_number, 
                        password: $password) {
                            email
                        }
                }
`

export const LOGIN_USER = gql`
    mutation signInUser(
                $user_name: String!,
                $password: String!) {
                    signInUser(
                        user_name: $user_name,
                        password: $password) {
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

export const ADD_JOURNAL_CREATION_INFO = gql`
    mutation createJournal(
                $name: String!,
                $author_id: Int!,
                $description: String!,
                $image_path: String,
                $public: Boolean!) {
                    createJournal(
                        name: $name,
                        author_id: $author_id,
                        description: $description,
                        image_path: $image_path,
                        public: $public) {
                            id
                            name
                            public
                        }
    }
`

export const SEND_NEW_MESSAGE = gql`
    mutation createMessage(
                $user_id: Int!,
                $conversation_id: Int!,
                $content: String!) {
                    createMessage(
                        user_id: $user_id,
                        conversation_id: $conversation_id,
                        content: $content
                        ) {
                            user_id
                            conversation_id
                            content
                        }
                }
`     

export const CREATE_NEW_CHATROOM = gql`
    mutation createUserConversation($user_id: Int!, $responder_id: Int!,) {
        createUserConversation( user_id: $user_id, responder_id: $responder_id,) {
            user_id
            conversation_id
        }
    }
`     


export const CREATE_ENTRY = gql`
    mutation createJournalEntry(
        $body: String!,
        $journal_id: Int!) {
            createJournalEntry(
                body: $body,
                journal_id: $journal_id) {
                    body
                    journal_id
                }
            
        }
`

export const UPLOAD_IMAGE = gql`
    mutation uploadImage(
        $image: Upload!,
        $journal_id: Int!) {
            uploadImage(
                image: $image,
                journal_id: $journal_id)
}`

export const UPLOAD_PROFILE_IMAGE = gql`
    mutation changeProfileImage(
        $new_image: Upload!,
        $id: Int!) {
            changeProfileImage(
                new_image: $new_image,
                id: $id)
}`

export const UPDATE_PROFILE = gql`
    mutation changeProfileInfo(
        $id: Int!,
        $new_username: String!
        $new_description: String!) {
            changeProfileInfo(
                id: $id,
                new_username: $new_username,
                new_description: $new_description
            ) {
                id
                user_name
                profile_description
            }
    }
`

export const FOLLOW_USER = gql`
    mutation createUserFollow(
        $follower_id: Int!,
        $followed_user_name: String!) {
            createUserFollow(
                follower_id: $follower_id,
                followed_user_name: $followed_user_name)
    }
`

export const UNFOLLOW_USER = gql`
    mutation deleteUserFollow(
        $follower_id: Int!,
        $followed_user_name: String!) {
            deleteUserFollow(
                follower_id: $follower_id,
                followed_user_name: $followed_user_name)
    }
`

export const SIGN_OUT = gql`
    mutation signOutUser($void: String) {
        signOutUser(void: $void)
    }
`