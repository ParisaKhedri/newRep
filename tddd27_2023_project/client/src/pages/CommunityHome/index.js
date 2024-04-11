import React from 'react';
import styles from './styles.module.css';
import CommunityNavigationBar from './CommunityNavigationBar';
import CommunityJournalGrid from './CommunityJournalsGrid';
import CommunityProfile from './CommunityProfile';
import { useLocation } from 'react-router-dom';

export default function CommunityHome() {
    const location = useLocation();
    const user_name = location.state.user_name;
    return (
         <div id={styles.background}>
                <div id={styles.side_divide}>
                    <CommunityProfile user_name={user_name} />
                    <div id={styles.navigation_bar_container}>
                        <CommunityNavigationBar user_name={user_name}/>
                    </div>
                </div>
                <div id={styles.side_panel}>
                    <CommunityJournalGrid user_name={user_name}/>
                </div>
        </div>
    );
}