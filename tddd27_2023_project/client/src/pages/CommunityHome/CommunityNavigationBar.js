import React from 'react';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { FOLLOW_USER, UNFOLLOW_USER, CREATE_NEW_CHATROOM} from '../../GraphQL/Mutations';
import { GET_ALL_FOLLOWED_USERS, LOAD_USER_BY_USERNAME, LOAD_CONVERSATIONID_WITH_RESPONDER} from '../../GraphQL/Queries';

export default function CommunityNavigationBar(props) {
    const user = JSON.parse(localStorage.getItem("user"));
    const navigation = useNavigate();
    var isFollowed = false;
    const [createUserFollow] = useMutation(FOLLOW_USER);
    const [deleteUserFollow] = useMutation(UNFOLLOW_USER);
    const [createUserConversation] = useMutation(CREATE_NEW_CHATROOM)
    const {data, loading, error, refetch} = useQuery(GET_ALL_FOLLOWED_USERS, {variables: {
        follower_id: user.id
    }});

    const { data: data_responder, loading: loading_responder, error: error_responder } = useQuery(LOAD_USER_BY_USERNAME, {
        variables: {
            user_name: props.user_name
        }
    });

    if (loading || loading_responder) return <p>Loading...</p>
    if (error|| error_responder) return `error while loading: ${error}`
    const followed_users = data.getAllUserFollowByFollower;
    
    if (followed_users.includes(props.user_name)) {
        isFollowed = true;
    }

    async function handleFollow() {
        if (!isFollowed) {
            const result = await createUserFollow({variables: {
                follower_id: user.id,
                followed_user_name: props.user_name
            }})
            if (result) {
                refetch({follower_id: user.id});
            }
        } else {
            const result = await deleteUserFollow({variables: {
                follower_id: user.id,
                followed_user_name: props.user_name
            }})
            if (result) {
                refetch({follower_id: user.id});
            }
        }
    }

    async function HandleCreateNewChatroom(){
        const result = await createUserConversation({
            variables: {
                user_id: user.id,
                responder_id: data_responder.getUserByUserName.id
            },

            refetchQueries: [{query: LOAD_CONVERSATIONID_WITH_RESPONDER, variables: {
                user_id: user.id
            }},]
        
        });

        return result.data.createUserConversation.conversation_id
    }

    return (
        <>
            <style type="text/css">
                {`
                .btn-primary {
                    background-color: rgb(191, 93, 109);
                    border: 0;
                    width: 100%;
                    border-radius: 12px;
                    padding: 13px 0 13px 0;
                    font-size: 1.2em;
                    margin-bottom: 10px;
                    box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
                }
                .btn-primary:hover {
                    background-color: rgb(191, 112, 125);
                    border: 0;
                }
                .btn-primary:active {
                    --bs-btn-active-bg: rgb(191, 93, 109);
                    --bs-btn-active-border: 0;
                }
                `}
            </style>
            <Button variant="primary" onClick={() => {
                navigation('/home');
            }}>
                home
            </Button>
            <Button variant="primary" onClick={() => {handleFollow()}}>
                { !isFollowed ? (
                    <p style={{margin: 0, padding: 0}}>follow</p>
                ): null}
                { isFollowed ? (
                    <p style={{margin: 0, padding: 0}}>unfollow</p>
                ): null}
            </Button>

            <Button variant="primary" onClick={() => {
                // block user
            }}>
                block
            </Button>

            <Button variant="primary" onClick={ async () => {
                // create conversation then navigate to chatroom!!
                const chatpageID = await HandleCreateNewChatroom();
                
                navigation('/chatroom',{ state: {
                    chatPageId : chatpageID
                }});

            }}>
                message
            </Button>
        </>
    );

}