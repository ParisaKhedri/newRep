import React from 'react';
import styles from './styles.module.css';
import { useNavigate } from 'react-router-dom';

export default function CommunityJournalGridItem(props) {
    const navigate = useNavigate(); 

    function handleClick() {
        navigate("/read_view", {
                    state:{
                        journal_id: props.journal_id,
                        name: props.name,
                        community: true,
                        user_name: props.user_name
                    }
                });
    }

    return (
            <div id={styles.community_journal_container} onClick={() => {handleClick()}}>
                <div id={styles.journal_image_container}>
                    <img id={styles.journal_image} src={props.journal_image_path} />
                </div>
                <div id={styles.journal_info_container}>
                    <p className={styles.journal_info_text} id={styles.journal_title}>{props.name}</p>
                    <p className={styles.journal_info_text}>{props.journal_description}</p>
                </div>
            </div>
    );
}

