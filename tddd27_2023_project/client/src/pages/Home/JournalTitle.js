import React, {Component} from 'react';
import styles from './styles.module.css';

export default class JournalTitle extends Component {

    render() {
        return (
            <div className={styles.title_container}>
                <p className={styles.journal_title_text}>{this.props.name}</p>
            </div>
        );
    }
}