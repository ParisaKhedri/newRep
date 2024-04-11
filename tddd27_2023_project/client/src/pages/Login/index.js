import React from 'react';
import LoginForm from './LoginForm';
import styles from './styles.module.css'
import WelcomeMessage from '../../components/WelcomeMessage';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();
    return (
        <div>
            <div id={styles.welcome_container}>
                <WelcomeMessage />
            </div>
            <div id={styles.login_container}>
                <LoginForm />
                <p className={styles.register_text} id={styles.no_account_text}>Don't have an account?</p>
                <p className={styles.register_text} id={styles.register_button} 
                    onClick={ () => {
                        navigate('/register');
                    }}>Register</p>
            </div>
        </div>
    );
    
}