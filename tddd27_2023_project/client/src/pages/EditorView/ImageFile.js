import React from 'react';
import styles from './styles.module.css';
import {image} from 'react-icons-kit/icomoon/image';
import { Icon } from 'react-icons-kit';

export default function ImageFile() {
    return (
        <div id={styles.image_container}>
            <Icon icon={image} id={styles.image_icon} size={20}/>
            <p>image_name.png</p>
        </div>
    );
}