import React from 'react';
import styles from './styles.module.css';

export default function JournalHeader(props) {
    return (
        <div id={styles.header_container}>
            <header id={styles.editor_header}>
                <div id={styles.header_border}>
                    {props.journal_name}
                </div>
            </header>
        </div>
    );
    
}