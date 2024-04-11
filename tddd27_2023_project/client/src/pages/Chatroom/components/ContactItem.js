import React from 'react';
import { useQuery } from '@apollo/client';
import { LOAD_RESPONDER} from '../../../GraphQL/Queries';
import styles from './styles.module.css';
import { IconContext } from "react-icons";

export default function ContactItem(props) {

    const user = JSON.parse(localStorage.getItem("user"));
    
    const { data, loading, error } = useQuery(LOAD_RESPONDER, {
        variables: {
            user_id: user.id,
            conversation_id: props.conversation_id
        }
    });

    var responder_username = null;
    var responder_firstname = null;
    var responder_lastname = null;
    var responder_profile_img = null;
    var responder = null;

    if (error) return `error while loading: ${error}`;

    if (loading) return <p>loading</p>;

    responder = data.getResponderInConversation;
    if (data) {
        responder_username = responder.user_name;
        responder_firstname = responder.first_name;
        responder_lastname = responder.last_name;
        responder_profile_img = responder.profile_img;
    }

    return (
        <div className={styles.contact_item_container}>
            <IconContext.Provider>
                <div className={styles.profile_img_container}>
                    {responder_profile_img == null ? (
                        // <RiImageAddFill/>
                        <div></div>
                    ) : null}
                    {responder_profile_img ? (
                        <img className={styles.profile_img} src={responder_profile_img}/>
                    ) : null}
                </div>
            </IconContext.Provider>
            <div className={styles.contact_item_info}>
                <p className={styles.responder_first_last_name_p}>
                    {responder_firstname + " "}
                    {responder_lastname}
                </p>
                <p className={styles.responder_user_name_p}>
                    {responder_username}
                </p>
            </div>

        </div>

    );



}