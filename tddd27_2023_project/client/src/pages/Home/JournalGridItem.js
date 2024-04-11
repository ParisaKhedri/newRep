import React from 'react';
import styles from './styles.module.css';
import JournalTitle from './JournalTitle';
import { useNavigate } from 'react-router-dom';

export default function JournalGridItem(props) {
    const navigation = useNavigate();
    var full_path = null;
    if (props.journal_image_path != null) {
        full_path = props.journal_image_path;
    }

    return (
        <div onClick={() => {navigation('/read_view', {
            state: {
                journal_id: props.journal_id,
                name: props.name,
                community: false,
            }
        })}}>
            <div className={styles.journal_item}>
                {full_path != null ? (
                    <img id={styles.journal_image} src={props.journal_image_path} />
                ) : null}
            </div>
            <JournalTitle name={props.name}/>
        </div>
    );
}
