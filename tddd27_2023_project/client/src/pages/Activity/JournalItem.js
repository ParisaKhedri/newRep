import React from 'react';
import styles from './styles.module.css';
import { useNavigate } from 'react-router-dom';
import { LOAD_USER_BY_USER_ID } from '../../GraphQL/Queries';
import { useQuery } from '@apollo/client';


export default function JournalItem(props) {
    const navigate = useNavigate();
    const { data, loading, error } = useQuery(LOAD_USER_BY_USER_ID, { variables: {
        id: props.author_id,
    }});

    if (loading) return <p>Loading...</p>
    if (error) return `error while loading information: ${error}`;
  
    const user = data.getUserByID;
    const user_image = user.profile_img;
    const user_name = user.user_name;
    const chapter_nr = 5;

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
        <div id={styles.item_container}>
            <div id={styles.community_journal_container} onClick={() => {handleClick()}}>
                <div id={styles.user_name_container}>
                    <p id={styles.user_name}>{"@"+ user_name}</p>
                </div>
                
                <div id={styles.user_image_container}>
                    <img id={styles.user_image} src={user_image}></img>
                </div>
                <div id={styles.journal_image_container}>
                    <img id={styles.journal_image} src={props.journal_image_path} />
                </div>
                <div id={styles.journal_info_container}>
                    <p className={styles.journal_info_text} id={styles.journal_title}>{props.name}</p>
                    <p className={styles.journal_info_text}>{props.journal_description}</p>
                </div>
            </div>
        </div>
    );
}

