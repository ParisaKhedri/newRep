import React, { useEffect, useState } from 'react';
import NavigationBar from '../../components/NavigationBar';
import Profile from '../../components/Profile';
import Chatpage from './Chatpage';
import { useQuery } from '@apollo/client';
import { LOAD_CONVERSATIONID_WITH_RESPONDER } from '../../GraphQL/Queries';
import ContactItem from './components/ContactItem';
import styles from './styles.module.css';
import { useLocation } from 'react-router-dom';





export default function Chatroom() {

    const location = useLocation();

    const [chatPageId, setChatPageId] = useState(null);
    const [conversationIdsList, setConversationIdsList] = useState(null);

    const user = JSON.parse(localStorage.getItem("user"));
    const [searchingValue, setSearchingValue] = useState(false);

    const [conversationIdswithUsernames, setConversationIdswithUsernames] = useState(null);


    const [usernames, setUsernames] = useState(null)

    const { data, loading, error } = useQuery(LOAD_CONVERSATIONID_WITH_RESPONDER, {
        variables: {
            user_id: user.id
        }

    },);

    useEffect(() => {

        if (data) {

            const conversationIdswithUsernamesArray = data.getAllUserAndConversationsByUserID;
            setConversationIdswithUsernames(conversationIdswithUsernamesArray);

            var conversationArray = []

            var usernamesArray = []

            conversationIdswithUsernamesArray.forEach((userAndConversationid) => {
                conversationArray.push(userAndConversationid.conversation_id)
                usernamesArray.push(userAndConversationid.user_name)
            });        

            if (location.state) {
                setChatPageId(location.state.chatPageId);
                
            }else{
                setChatPageId(conversationArray[0])
            }
            
            setConversationIdsList(conversationArray);
            setUsernames(usernamesArray);
        }

    }, [data]);

    if (loading || error) {
        return <p> Loading or error</p>
    }

    function returnContactItem(conversationIdsList) {
        if (conversationIdsList) {
            return conversationIdsList.map((conversationID) => {
                return <ContactItem key={conversationID} conversation_id={conversationID} onClick={() => {
                        setChatPageId(conversationID)}} />
            },);
        }
    }

    function updateChatPage() {
        if (chatPageId) {
            return <Chatpage
                key={chatPageId}
                conversation_id={chatPageId}
                user={user} />
        }

    }

    function searchAlgorithm(all_usernames, search_value) {
        if (search_value == '') {
            return [];
        }

        return all_usernames.filter(user => user.startsWith(search_value));
    }

    function search() {
        const filtered_users = searchAlgorithm(usernames, searchingValue);

        if (filtered_users) {
            const filtred_conversationIds = []
            for (var user of filtered_users) {
                conversationIdswithUsernames.forEach((userAndConversationid) => {
                    if (userAndConversationid.user_name == user) {
                        filtred_conversationIds.push(userAndConversationid.conversation_id)
                    }
                });
            }
            return returnContactItem(filtred_conversationIds);

        }

    }


    return (
        <div id={styles.main_container}>

            <div id={styles.side_divide_left}>
                <Profile />
                <div id={styles.navigation_bar_container}>
                    <NavigationBar />
                </div>
            </div>


            <div className={styles.side_divide_right}>
                <div className={styles.inside_side_divide_right}>
                    <div id={styles.contacts_container}>
                        <div id={styles.contacts_inside_container}>
                            <div id={styles.search_main_container}>

                                <input
                                    id={styles.search_input}
                                    placeholder="Search for people"
                                    type="text"
                                    name="lastname"
                                    onChange={(event) => {
                                        setSearchingValue(event.target.value)

                                    }}
                                />

                            </div>
                            {!searchingValue ? (
                                returnContactItem(conversationIdsList)
                            ) : null}

                            {searchingValue ? (
                                search()
                            ) : null}

                        </div>

                    </div>
                    <div id={styles.chatpage_container}>
                        {updateChatPage()}
                    </div>
                </div>



            </div>


        </div>

    );

}