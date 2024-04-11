import React from 'react';
import styles from './styles.module.css';
import { useNavigate } from 'react-router-dom';
import { LOAD_USER_BY_USERNAME } from '../../GraphQL/Queries';
import { useQuery } from '@apollo/client';

export default function SearchGridItem(props) {
    const navigate = useNavigate()
    const { data, loading, error } = useQuery(LOAD_USER_BY_USERNAME, {
        variables: {
            user_name: props.user_name
        }
    });

    if (loading) return <p> loading user info... </p>;
    if (error) return `error while loading user info: ${error}`;

    const user = data.getUserByUserName;
    const first_name = user.first_name;
    const last_name = user.last_name;


    function handleClick() {
        navigate('/community_profile', {
            state: {
                user_name: props.user_name
            }
        });
    }

    return (
        <div className={styles.search_item_container} onClick={() => { handleClick() }}>

            <div className={styles.profile_image_container}>

                <img className={styles.user_profile_image} src={props.user_profile_image} />

            </div>

            <div className={styles.user_info_container}>
                <p className={styles.user_personal_names}>
                    {first_name + " "}
                    {last_name}
                </p>
                <p className={styles.user_p}>
                    {"@"+props.user_name}
                </p>
            </div>
        </div>
    );
}

