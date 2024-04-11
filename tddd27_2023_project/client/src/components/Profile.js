import React, { useState } from 'react';
import styles from './styles.module.css';
import figure_style from './figure_style.css';
import { RiImageAddFill } from "react-icons/ri";
import { LOAD_USER_BY_USER_ID } from '../GraphQL/Queries';
import { useQuery } from '@apollo/client';
import { Icon } from 'react-icons-kit'
import { pen_2 } from 'react-icons-kit/ikons/pen_2'
import { IconContext } from "react-icons";
import { useMutation } from '@apollo/client';
import { UPLOAD_PROFILE_IMAGE } from '../GraphQL/Mutations';
import { UPDATE_PROFILE } from '../GraphQL/Mutations';

/* Profile page */
export default function Profile(){
    const user = JSON.parse(localStorage.getItem("user"));
    const hiddenFileInput = React.useRef(null);

    const [changeProfileImage] = useMutation(UPLOAD_PROFILE_IMAGE);
    const [changeProfileInfo] = useMutation(UPDATE_PROFILE);

    const [editing, setEditing] = useState(false);
    const [username, setUsername] = useState(user.user_name);
    const [profileDescription, setProfileDescription] = useState(user.profile_description);

    // fetch data presented in the profile
    const {data, loading, error, refetch, isRefetching} = useQuery(LOAD_USER_BY_USER_ID, {variables: {
        id: user.id
    }})
 
    
    const created_at = new Date(Number(user.createdAt));
    const year = created_at.getFullYear();
    var month = created_at.getMonth() + 1;
    if (month < 10) {
        month = "0" + month;
    }
    const day = created_at.getDate();

    if (loading) return <p> loading user info... </p>;
    if (error) return `error while loading user info: ${error}`;
    //if (isRefetching) return <p>loading user info</p>

    var imagePath = data.getUserByID.profile_img;
    
    // update local storage user-info in case of mutation
    localStorage.setItem("user", JSON.stringify(data.getUserByID)); 

    async function handleProfileImageChange(event) {
        const fileUploaded = event.target.files[0];
        const result = await changeProfileImage({variables: {
            new_image: fileUploaded,
            id: user.id,
        }})

        if (result) {
            refetch({id: user.id});
        }

    }

    async function handleEditView() {
        if (editing) {
            const result = await changeProfileInfo({variables: {
                id: user.id,
                new_username: username,
                new_description: profileDescription
            }})
        }
        setEditing(!editing);
    }

    function handleUserNameChange(event) {
        const target = event.target;
        const value = target.value;
        setUsername(value);
    }

    function handleDescriptionChange(event) {
        const target = event.target;
        const value = target.value;
        setProfileDescription(value);
    }

    return (
            <div id={styles.profile_container}>
                <p id={styles.active_text}>active since: {"" + year + "-" + month + "-" + day}</p>

                <IconContext.Provider value={{ className: "img-icon", style: figure_style }}>
                    <div id={styles.profile_img_container}>
                         {imagePath == null ? (
                            <RiImageAddFill onClick={() => {
                            hiddenFileInput.current.click();
                        }} />
                        ): null}
                        {imagePath != null ? (
                            <img id={styles.profile_img} src={imagePath} onClick={() => {

                            {/* activated a click on the hidden input element, opening the file explorer to gather input */}
                            hiddenFileInput.current.click();
                        }} ></img>
                        ): null}

                        {/* hidden input element */}
                        <input type="file" accept='image/*' style={{display:'none'}} ref={hiddenFileInput} onChange={(event) => {handleProfileImageChange(event)}} /> 
                    </div>
                </IconContext.Provider>


                <div id={styles.user_name_text_p}>
                    {!editing ? (
                        <p id={styles.username_text}>{username}</p>
                    ): null}
                    {editing ? (
                        <input id={styles.username_input} name="username_input" defaultValue={username} onChange={(event) => handleUserNameChange(event)}></input>
                    ): null}
                    <div id={styles.edit_icon_container}>
                        {!editing? (
                        <Icon id={styles.edit_icon} icon={pen_2} size={30} onClick={() => {handleEditView()}} />
                        ): null }
                        {editing? (
                            <button id={styles.ok_button} onClick={() => {handleEditView()}}> OK </button>
                        ): null}
                    </div>
                </div>

                <div id={styles.description_gradient_container}>
                    {!editing ? (
                        <div id={styles.description_container} >
                            <p id={styles.description_text}>{profileDescription}</p>
                        </div>
                    ): null}
                   {editing ? (
                        <textarea defaultValue={profileDescription} id={styles.description_textarea} onChange={(event) => handleDescriptionChange(event)}>
                            
                        </textarea>
                   ): null} 

                    <div id={styles.overlap_gradient}></div>
                </div>
            </div>
    );
    
}