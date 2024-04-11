import React from 'react';
import styles from './styles.module.css';
import figure_style from './figure_style.css';
import { RiImageAddFill } from "react-icons/ri";
import { LOAD_USER_BY_USERNAME } from '../../GraphQL/Queries';
import { useQuery } from '@apollo/client';
import { IconContext } from "react-icons";

export default function CommunityProfile(props){
    const { data, loading, error} = useQuery(LOAD_USER_BY_USERNAME, { variables: {
        user_name: props.user_name
    }});

    if (loading) return <p> loading user info... </p>;
    if (error) return `error while loading user info: ${error}`;

    const user = data.getUserByUserName;
    const user_name = user.user_name;
    const description = user.profile_description;
    var created_at = new Date(Number(user.createdAt));
    const year = created_at.getFullYear();
    var month = created_at.getMonth() + 1;
    if (month < 10) {
        month = "0" + month;
    }
    const day = created_at.getDate();
    const profile_image = user.profile_img;
    
    return (
            <div id={styles.profile_container}>
                <p id={styles.active_text}>active since: {"" + year + "-" + month + "-" + day}</p>

                <IconContext.Provider value={{ className: "img-icon", style: figure_style }}>
                    <div id={styles.profile_img_container}>
                         {profile_image == null ? (
                            <RiImageAddFill />
                        ): null}
                        {profile_image ? (
                            <img id={styles.profile_img} src={profile_image}></img>
                        ): null}
                    </div>
                </IconContext.Provider>

                <div id={styles.user_name_text_p}>
                    <p id={styles.username_text}>{user_name}</p>
                </div>

                <div id={styles.description_gradient_container}>
                    <div id={styles.description_container} >
                        <p id={styles.description_text}>{description}</p>
                    </div>
                    <div id={styles.overlap_gradient}></div>
                </div>
            </div>
    );
    
}