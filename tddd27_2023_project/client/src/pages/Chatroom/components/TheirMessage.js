import React from 'react';
import styles from './styles.module.css';
import { useQuery } from '@apollo/client';
import { LOAD_RESPONDER } from '../../../GraphQL/Queries';
import { IconContext } from "react-icons";


export default function TheirMessage(props) {
    const hiddenFileInput = React.useRef(null);
    const { data, loading, error } = useQuery(LOAD_RESPONDER, {
        variables: {
            user_id: props.user.id,
            conversation_id: props.conversation_id
        }
    },);

    if (loading) {
        return <p>Loading</p>
    }

    var responder_img = null;

    if (data) {
        responder_img = data.getResponderInConversation.profile_img;
    }


    return (
        <div className={styles.their_message_container}>
            <IconContext.Provider>
                <div className={styles.responder_img_container}>
                    {responder_img == null ? (
                        <div></div>
                    ) : null}
                    {responder_img ? (
                        <img className={styles.profile_img} src={responder_img} />
                    ) : null}
                </div>
            </IconContext.Provider>
            <div className={styles.their_message_text_content}>
                {props.content}

            </div>

        </div>
    );

}