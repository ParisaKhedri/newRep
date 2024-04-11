import React, {useEffect, useState} from 'react';
import { LOAD_ALL_FOLLOWED_JOURNALS } from '../../GraphQL/Queries';
import { useQuery } from '@apollo/client';
import styles from './styles.module.css';
import JournalItem from './JournalItem';

export default function JournalGrid(props) {
    const followed_users = props.follows;
    
    const {data, loading, error} = useQuery(LOAD_ALL_FOLLOWED_JOURNALS, {variables: {
    followed_users: followed_users,
    }});

    if (loading) return <p>loading...</p>

    if (error) return `error while retriving journals ${error}`

    const allJournals = data.getAllFollowedJournals;
    
   function createJournalItems(journals) {
        return journals.map(journal => {
            return <JournalItem key={journal.id} 
                                name={journal.name}
                                author_id={journal.author_id}
                                journal_id={journal.id} 
                                journal_description={journal.description} 
                                journal_image_path={journal.image_path}
                                />
        });
        
    }
            
    return (
            <div id={styles.journal_grid_container}>
                {createJournalItems(allJournals)}
            </div>
    );
        
        
}



