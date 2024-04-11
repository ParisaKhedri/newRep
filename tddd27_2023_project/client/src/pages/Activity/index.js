import React from 'react';
import styles from './styles.module.css';
import Profile from '../../components/Profile';
import NavigationBar from '../../components/NavigationBar';
import { GET_ALL_FOLLOWED_USERS } from '../../GraphQL/Queries';
import { useQuery } from '@apollo/client';
import JournalGrid from './JournalGrid';

export default function Activity() {
    const user = JSON.parse(localStorage.getItem("user"));
    const {data, loading, error} = useQuery(GET_ALL_FOLLOWED_USERS, {variables: {
        follower_id: user.id
    }})

    if (loading) return <p>Loading...</p>;
    if (error) return `error loading follower data: ${error}`;

    const all_follows = data.getAllUserFollowByFollower;

    return (
         <div id={styles.background}>
                <div id={styles.side_divide}>
                    <Profile />
                    <div id={styles.navigation_bar_container}>
                        <NavigationBar />
                    </div>
                </div>
                <div id={styles.side_panel}>
                    <div id={styles.title_container}>
                        <p id={styles.title_text}>Latest Updated Journals</p>
                    </div>
                    
                    <JournalGrid follows={all_follows} />
                </div>
        </div>
    );
}