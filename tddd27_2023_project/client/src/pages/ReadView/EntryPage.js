import React, {useState} from 'react';
import styles from './styles.module.css';
import {Icon} from 'react-icons-kit';
import {arrowRight2} from 'react-icons-kit/icomoon/arrowRight2';
import {arrowLeft2} from 'react-icons-kit/icomoon/arrowLeft2';
import {ic_camera_alt} from 'react-icons-kit/md/ic_camera_alt';
import ReactHtmlParser from 'react-html-parser'; 
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { UPLOAD_IMAGE } from '../../GraphQL/Mutations';
import { LOAD_USER_JOURNALS } from '../../GraphQL/Queries';

export default function EntryPage(props) {
    const user = JSON.parse(localStorage.getItem("user"));
    const entry_list = props.entries;
    const last_entry_index = entry_list.length-1;
    const navigate = useNavigate();
    const [currentEntry, setCurrentEntry] = useState(0);
    const hiddenFileInput = React.useRef(null);

    const [uploadImage, {data, loading, error}] = useMutation(UPLOAD_IMAGE);

    if (loading) return 'Uploading...';
    
    if (error) return `Uploading error! ${error.message}`;

    function handleNextPage() {
        setCurrentEntry(currentEntry+1);
    }

    function handlePreviousPage() {
        setCurrentEntry(currentEntry-1);
    }

    function handleEditImage() {
        hiddenFileInput.current.click();
    }

    async function handleChange(event) {
        const fileUploaded = event.target.files[0];
        const result = await uploadImage({variables: {
         image: fileUploaded,
         journal_id: props.journal_id,
        }, refetchQueries: [{query: LOAD_USER_JOURNALS, variables: {
            author_id: user.id
        }}]});

        if (result) {
            navigate('/home');
        }
    }

    return(
        <div id={styles.entry_container}>
            <div id={styles.paper_container}>
                <div id={styles.body_container}>
                    {ReactHtmlParser(entry_list[currentEntry].body)}
                </div>
                <div id={styles.page_buttons_container}>
                    {currentEntry != 0 ? (
                        <button id={styles.previous_page_button} onClick={() => {handlePreviousPage()}}> <Icon icon={arrowLeft2} size={20}/> previous page </button>
                    ): null}
                    {currentEntry != last_entry_index ? (
                        <button id={styles.next_page_button} onClick={() => {handleNextPage()}}> next page <Icon icon={arrowRight2} size={20}/></button>
                    ): null}
                </div>
            </div>
            { !props.community ? (
                <div id={styles.options_bar}>
                    <p className={styles.option_text}>entry options</p>
                    <button className={styles.read_view_option} onClick={()=>{navigate("/editor", {
                        state:{
                            journal_id: props.journal_id,
                            name: props.name,
                        }
                    })}}>add</button>
                    <button className={styles.read_view_option}>edit</button>
                    <button className={styles.read_view_option}>delete</button>
                    <p className={styles.option_text} id={styles.journal_option_text}>journal options</p>
                    <button className={styles.read_view_option} onClick={()=>{handleEditImage()}}>edit image</button>
                    <Icon id={styles.camera_icon} icon={ic_camera_alt} size={45}></Icon>
                    <input type="file" accept='image/*' style={{display:'none'}} ref={hiddenFileInput} onChange={(event) => {handleChange(event)}} /> 
                    <button className={styles.read_view_option} id={styles.delete_journal_button}>delete journal</button>
        
                </div>
            ): null}
        </div>
    );
}
