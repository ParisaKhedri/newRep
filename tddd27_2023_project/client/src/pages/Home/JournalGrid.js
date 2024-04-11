import React from 'react';
import JournalGridItem  from './JournalGridItem';
import { useQuery } from '@apollo/client';
import { LOAD_USER_JOURNALS } from '../../GraphQL/Queries';
import styles from './styles.module.css';


export default function JournalGrid() {
    const user = JSON.parse(localStorage.getItem("user"));
    const {data, loading, error } = useQuery(LOAD_USER_JOURNALS, {variables: {
        author_id: user.id
    }});
    if (loading) {
        return <p>loading...</p>
    }

    if (data) {
        const journalData = data.getAllJournalsFromUser;
        return (
            <div id={styles.journal_grid_container}>
                {createJournalGridItems(journalData)}
            </div>
        );
    }

    function createJournalGridItems(journals) {
        return journals.map(journal => {
            return <JournalGridItem key={journal.id} name={journal.name} journal_id={journal.id} journal_image_path={journal.image_path}/>
        });
    }
    
}