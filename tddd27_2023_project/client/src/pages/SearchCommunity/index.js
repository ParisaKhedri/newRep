import React, {useState} from 'react';
import NavigationBar from '../../components/NavigationBar';
import Profile from '../../components/Profile';
import styles from './styles.module.css';
import SearchGrid from './searchGrid';

export default function SearchCommunity() {
    const [searchValue, setSearchValue] = useState(false);

    return (
        <div id={styles.main_container}>
            <div id={styles.side_divide_left}>
                <Profile />
                <div id={styles.navigation_bar_container}>
                    <NavigationBar />
                </div>
            </div>

            <div id={styles.side_divide_right}>

                <div id={styles.search_main_container}>

                    <input
                        id={styles.search_input}
                        placeholder="Search for people"
                        type="text"
                        name="lastname"
                        onChange={(event) => {setSearchValue(event.target.value)}}
                    />

                    

                </div>
                <SearchGrid search_value={searchValue}/>

            </div>
        </div>
    );

}