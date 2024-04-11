import React, { Component } from 'react';
import WelcomeMessage from '../../components/WelcomeMessage';
import { useNavigate } from 'react-router-dom';
import RegisterForm from './RegisterForm';
import styles from './styles.module.css';

 export default function NavigateHelper() {
    const navigate = useNavigate() // extract navigation prop here 
    
     return <Register navigation={navigate} /> 
    
}


class Register extends Component {
    render() {
        return (
            <div>
                <div id={styles.welcome_container}>
                    <WelcomeMessage />
                </div>
                <div id={styles.register_container} >
                    <RegisterForm />
                    <p className={styles.login_text} id={styles.have_account_text}>Already have an account?</p>
                    <p className={styles.login_text} id={styles.login_button}
                        onClick={ () => {
                            this.props.navigation('/');
                        }}>Sign in</p>
                </div>
            </div>

        );
    }
} 