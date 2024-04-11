import React from 'react';
import { LOAD_USERS } from '../../GraphQL/Queries';
import { useQuery } from '@apollo/client';
import styles from './styles.module.css';
import SearchGridItem from './SearchGridItem';

export default function SearchGrid(props) {
    const { data, loading, error } = useQuery(LOAD_USERS);
    if (loading) return <p> Loading users... </p>
    if (error) return `error loading users: ${error}`
    const all_users = data.getAllUsers;

    function searchAlgorithm(all_users) {
        if (props.search_value == '') {
            return [];
        }
        const search_value = props.search_value;
        return all_users.filter(user => user.user_name.startsWith(search_value));
    }

    function createSearchGridItems(all_users) {
        const filtered_users = searchAlgorithm(all_users);
        return filtered_users.map(user => {
            return <SearchGridItem key={user.id} user_name={user.user_name}  user_profile_image={user.profile_img}/>
        });
        
    }

    return (
            <div id={styles.journal_grid_container}>
                {createSearchGridItems(all_users)}
            </div>
    );
}



