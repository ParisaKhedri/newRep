import React, { useEffect, useState } from 'react';
import styles from './styles.module.css';
import Message from './components/Message'
import TheirMessage from './components/TheirMessage'
import { useQuery } from '@apollo/client';
import { GET_ALL_MESSAGES_BY_CONVERSATION_ID } from '../../GraphQL/Queries';
import { Icon } from 'react-icons-kit'
import { ic_send } from 'react-icons-kit/md/ic_send'
import { useMutation } from '@apollo/client';
import { SEND_NEW_MESSAGE } from '../../GraphQL/Mutations';
import ContactItem from './components/ContactItem';




export default function Chatpage(props) {
    const [newMessageContent, setNewMessageContent] = useState(null);
    const [ws, SetWs] = useState(new WebSocket('ws://localhost:3009'));
    var allMessages = null;
    var messagesEnd = null;


    const [sendNewMessage, { data: data_sent, loading: loading_send, error: error_send }] = useMutation(SEND_NEW_MESSAGE);

    const { data, loading, error, refetch: refetchMessages } = useQuery(GET_ALL_MESSAGES_BY_CONVERSATION_ID, {
        variables: {
            conversation_id: props.conversation_id
        }
    },);

    if (data) {
        allMessages = data.getAllMessagesInConversationByConversationID;
    }

    useEffect(() => {
        scrollToBottom();
        ws.onopen = () => {
            console.log('Connection opened!');
        }
        ws.onmessage = () => {
            refetchMessages({ conversation_id: props.conversation_id });
        }
        ws.onclose = function () {
            SetWs(null);
        }
    })

    if (loading) {
        return <p>Loading</p>
    }

    function handleChange(e) {
        const target = e.target;
        const value = target.value;
        setNewMessageContent(value);

    }

    function sendNewMessageHandler() {
        const msgContent = newMessageContent;
        if (msgContent) {
            let msgBox = document.getElementById(styles.new_message_input);
            msgBox.value = "";
            setNewMessageContent("");

            sendNewMessage({
                variables: {
                    user_id: props.user.id,
                    conversation_id: props.conversation_id,
                    content: msgContent,
                },

                refetchQueries: [{
                    query: GET_ALL_MESSAGES_BY_CONVERSATION_ID, variables: {
                        conversation_id: props.conversation_id
                    }
                }]
            })
            ws.send(msgContent);
        }

    }

    function returnAllMessages() {
        if (allMessages) {
            return allMessages.map((message) => {
                if (message.user_id == props.user.id) {
                    var component = <Message
                        key={message.id}
                        content={message.content} />
                } else {
                    var component = <TheirMessage
                        key={message.id}
                        user={props.user}
                        content={message.content} conversation_id={props.conversation_id}
                    />
                }

                return component
            },);

        }

    }

    function scrollToBottom() {
        if (messagesEnd) {
            messagesEnd.scrollIntoView({ behavior: "smooth" });

        }

    }


    return (
        <div id={styles.chatpage_view}>
            <div id={styles.chatpage_responder_bar}>
                < ContactItem key={props.conversation_id} conversation_id={props.conversation_id} />
            </div>

            <div id={styles.chatpage_scroll_view}>
                {returnAllMessages()}
                <div style={{ float: "left", clear: "both" }}
                    ref={(el) => { messagesEnd = el; }}>
                </div>
            </div>

            <div id={styles.new_chat_bar_main_container}>
                <div id={styles.new_chat_bar_wrapper}>
                    <textarea
                        id={styles.new_message_input}
                        placeholder="Enter new message"
                        name="newMessageContent"
                        onChange={(e) => handleChange(e)}

                    />
                    <div>
                        <span
                            onClick={() => sendNewMessageHandler()}>
                            <Icon id={styles.send_new_message_icon} icon={ic_send} size={20} />
                        </span>

                    </div>
                </div>
            </div>
        </div>


    );

}