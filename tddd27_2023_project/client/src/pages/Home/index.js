import React, {Component} from 'react';
import styles from './styles.module.css';
import Profile from '../../components/Profile';
import MyJournals from './MyJournals';
import NavigationBar from '../../components/NavigationBar';

export default class Home extends Component {
    render() {
        return (
            <div id={styles.background}>
                <div id={styles.side_divide}>
                    <Profile />
                    <div id={styles.navigation_bar_container}>
                        <NavigationBar />
                    </div>
                </div>
                <div id={styles.my_journals_container}>
                        <MyJournals />
                </div>
            </div>
        );
    }
}