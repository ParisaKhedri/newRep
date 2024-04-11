
import React, {Component} from 'react';
import styles from './styles.module.css';


export default class WelcomeMessage extends Component {
    render() {
        return (
            <div id={styles.welcome_container}>
                <p id={styles.welcome}>Welcome to</p>
                <p id={styles.application_name}>Memento</p>
            </div>
        );
    }
}