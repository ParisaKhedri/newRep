import React from 'react';
import styles from './styles.module.css';


export default function Message(props) {
    return (
        <div className={styles.message_container}>
            {props.content}
        </div>

    );

}