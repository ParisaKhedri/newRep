import React from 'react';
import styles from './styles.module.css';
import Profile from '../../components/Profile';
import NavigationBar from '../../components/NavigationBar';
import EditorSidePanel from './EditorSidePanel';
import JournalHeader from './JournalHeader';
import { useLocation } from 'react-router-dom';

export default function EditorView() {
        const location = useLocation();
        return (
            <div id={styles.background}>
                <div id={styles.side_divide}>
                    <Profile />
                    <div id={styles.navigation_bar_container}>
                        <NavigationBar />
                    </div>
                </div>
                <div id={styles.panel_container}>
                    <JournalHeader journal_name={location.state.name}/>
                    <EditorSidePanel journal_id={location.state.journal_id}/>
                </div>
            </div>
        );
}
