import React, {Component} from 'react';
import styles from './styles.module.css';
import Profile from '../../components/Profile';
import NavigationBar from '../../components/NavigationBar';
import { delete_cookie } from 'sfcookies';
import { useNavigate } from 'react-router-dom';
import { SIGN_OUT } from '../../GraphQL/Mutations';
import { useMutation } from '@apollo/client';

export default function Settings() {
    const navigate = useNavigate();
    const [signOutUser] = useMutation(SIGN_OUT);

    function handleSignOut() {
        const result = signOutUser({variables: {
            void: "",
        }});
        delete_cookie("signedin");
        delete_cookie("token");

        localStorage.removeItem("user");
        navigate("/");
    }

    return (
        <div id={styles.background}>
            <div id={styles.side_divide}>
                <Profile />
                <div id={styles.navigation_bar_container}>
                    <NavigationBar />
                </div>
            </div>
            <div id={styles.side_panel}>
                <button onClick={() => handleSignOut()}>Sign out</button>
            </div> 
        </div>
    );
    
}