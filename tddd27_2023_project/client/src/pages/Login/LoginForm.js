import React, { useState } from 'react';
import CommonButton from '../../components/CommonButton';
import styles from './styles.module.css';
import { bake_cookie, read_cookie } from 'sfcookies';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../../GraphQL/Mutations';
import { useNavigate } from 'react-router-dom';

import { Icon } from 'react-icons-kit';
import { eye } from 'react-icons-kit/feather/eye';
import { eyeOff } from 'react-icons-kit/feather/eyeOff';

export default function LoginForm() {
    const [signInUser] = useMutation(LOGIN_USER);
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [icon, setIcon] = useState(eye);
    const [showPassword, setShowPassword] = useState(false);

    function handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        if (name == "username") {
            setUsername(value);
        }
        if (name == "password") {
            setPassword(value);
        }
    }
    function handleTogglePasswordVisibility () {
        if (showPassword) {
            setIcon(eye);
        }
        else {
            setIcon(eyeOff);
        }
        setShowPassword(!showPassword);
    }

    async function handleSubmit() {
        const username_input = username;
        const password_input = password;

        const result = await signInUser({
            variables: {
                user_name: username_input,
                password: password_input,
            }
        });

        if (result) {
            const user = result.data.signInUser;

            localStorage.setItem(
                'user', JSON.stringify(user)
            );

            bake_cookie("signedin", true);

            if (read_cookie("signedin")) {
                navigate('/home');
            }
        }
    }

    return (
        <div id={styles.form_container}>
            <form id={styles.login_form}>
                <label className={styles.label}>
                    username
                    <br />
                    <input className={styles.input}
                        name="username"
                        type="text"
                        onChange={e => { handleChange(e) }} />
                </label>
                <br />
                <label className={styles.label}>
                    password
                    <br />
                    <div>
                        <input className={styles.input}
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            onChange={e => { handleChange(e) }}
                        />

                        <span
                            className={styles.clearBtn}
                            onClick = {()=>handleTogglePasswordVisibility()}
                        >
                            <Icon className={styles.eye_icon} icon={icon} size={25} />
                        </span>


                    </div>

                </label>
            </form>
            <div id={styles.button_container}>
                <CommonButton action={() => { handleSubmit() }} text="Sign in" />
            </div>
        </div>
    );
}
