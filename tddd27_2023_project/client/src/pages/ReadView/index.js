import React from 'react';
import styles from './styles.module.css';
import Profile from '../../components/Profile';
import NavigationBar from '../../components/NavigationBar';
import EntryPage from './EntryPage';
import { useQuery } from '@apollo/client';
import { LOAD_ALL_JOURNAL_ENTRIES } from '../../GraphQL/Queries';
import { useLocation } from 'react-router-dom';
import CommunityProfile from '../CommunityHome/CommunityProfile';
import CommunityNavigationBar from '../CommunityHome/CommunityNavigationBar';

export default function ReadView() {
    const location = useLocation();
    const journal_id = location.state.journal_id;
    const {data, loading, error} = useQuery(LOAD_ALL_JOURNAL_ENTRIES, { variables: {
            journal_id: journal_id,
        }
    });

    if (loading) return <p>loading...</p>;
    if (error) return `error while loading journals: ${error}`
    
    const entries = data.getAllJournalEntriesInJournal;
    return (
        <div id={styles.background}>
            <div id={styles.side_divide_left}>
                { !location.state.community || location.state.user_name == null? (
                    <Profile />
                ): null}
                { location.state.community && location.state.user_name ? (
                    <CommunityProfile user_name={location.state.user_name}/>
                ): null}
                <div id={styles.navigation_bar_container}>
                    { !location.state.community || location.state.user_name == null? (
                        <NavigationBar />
                    ): null}
                    { location.state.community && location.state.user_name ? (
                        <CommunityNavigationBar />
                    ): null}
                </div>
            </div>
            <div id={styles.panel_container}>
                <EntryPage entries={entries} journal_id={journal_id} name={location.state.name} community={location.state.community}/>
            </div>
        </div>
    );
    
}
