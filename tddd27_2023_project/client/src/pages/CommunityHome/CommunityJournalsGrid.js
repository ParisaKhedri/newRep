import React, {useState} from 'react';
import { LOAD_ALL_COMMUNITY_USER_JOURNALS } from '../../GraphQL/Queries';
import { useQuery } from '@apollo/client';
import styles from './styles.module.css';
import CommunityJournalsItem from './CommunityJournalsItem';

export default function CommunityJournalGrid(props) {
    var allJournals = []; 
    const {data, loading, error} = useQuery(LOAD_ALL_COMMUNITY_USER_JOURNALS, {variables: {
        user_name: props.user_name
    }});

    if (loading) return <p>loading...</p>

    if (error) return `error while retriving journals ${error}`

    if (data) {
        allJournals = data.getAllJournalsByUserName;
        return (
                <div id={styles.journal_grid_container}>
                    {createCommunityJournalItems(allJournals)}
                </div>
        );
       
    }

    function createCommunityJournalItems(journals) {
        return journals.map(journal => {
            return <CommunityJournalsItem key={journal.id} 
                                            name={journal.name} 
                                            journal_id={journal.id} 
                                            journal_description={journal.description} 
                                            journal_image_path={journal.image_path}
                                            user_name={props.user_name}/>
        });
        
    }

}



