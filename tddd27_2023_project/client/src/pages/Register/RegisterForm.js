import React, { Component } from 'react';
import CommonButton from '../../components/CommonButton';
import styles from './styles.module.css';
import { Icon } from 'react-icons-kit';
import { eye } from 'react-icons-kit/feather/eye';
import { eyeOff } from 'react-icons-kit/feather/eyeOff';
import { useMutation } from '@apollo/client';
import { REGISTER_USER } from '../../GraphQL/Mutations';
import { useNavigate } from 'react-router-dom';

export default function RegisterFormHelper() {
    const [createUser, {data, loading, error}] = useMutation(REGISTER_USER);
    const navigate = useNavigate();
    if (error) {
        console.log(error);
    }
    return <RegisterForm createUser={createUser} navigation={navigate}/> 
}
    
class RegisterForm extends Component {

    constructor(props) {
        super(props);
       
        this.state = {
            username: '',
            firstname: '',
            lastname: '',
            password: '',
            email: '',
            phonenumber: '',
            usernameError: false,
            emailError: false,
            passwordError: false,
            showPassword: false,
            icon: eye
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);

    }

    handleTogglePasswordVisibility = () => {

        if (this.state.showPassword) {
            this.setState({ icon: eye})
        }
        else {
            this.setState({ icon: eyeOff })
        }
        this.setState({ showPassword: !this.state.showPassword })
    }

    validate() {
        let usernameError = false;
        let emailError = false;
        let passwordError = false;

        if (!this.state.username) {
            usernameError = true;
        }

        const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!this.state.email || reg.test(this.state.email) === false) {
            emailError = true;
        }

        if (!this.state.password) {
            passwordError = true;
        }

        if (emailError || usernameError || passwordError) {
            this.setState({ usernameError, emailError, passwordError });
            return false;
        }

        return true;
    }

    handleSubmit() { 
        if (this.validate()) {
           
            const username = this.state.username;
            const first_name = this.state.firstname;
            const last_name = this.state.lastname;
            const password = this.state.password;
            const email = this.state.email;
            const phonenumber = this.state.phonenumber;
            
            this.props.createUser({
                variables: {
                    email: email,
                    user_name: username,
                    first_name: first_name,
                    last_name: last_name,
                    phone_number: phonenumber, 
                    password: password
                },
            });
            this.props.navigation('/');
        }

    }

    handleChange(e) {
        const target = e.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });

    }




    render() {
        return (
            <div id={styles.register_form_container}>
                <form id={styles.register_form}>

                    <label className={styles.register_form_lable} style={{ color: this.state.usernameError ? 'red' : 'black' }}>
                        Username*
                        <br />
                        <input className={styles.register_form_input}
                            type="text"
                            name="username"
                            onChange={this.handleChange}
                            required
                        />
                    </label>
                    <br />

                    <label className={styles.register_form_lable}>
                        First name
                        <br />
                        <input className={styles.register_form_input}
                            type="text"
                            name="firstname"
                            onChange={this.handleChange}
                        />
                    </label>
                    <br />

                    <label className={styles.register_form_lable}>
                        Last name
                        <br />
                        <input className={styles.register_form_input}
                            type="text"
                            name="lastname"
                            onChange={this.handleChange}
                        />
                    </label>
                    <br />

                    <label className={styles.register_form_lable} style={{ color: this.state.passwordError ? 'red' : 'black' }}>
                        Password*
                        <br />
                        <div>
                            <input className={styles.register_form_input}
                                type={this.state.showPassword ? 'text' : 'password'}
                                name="password"
                                onChange={this.handleChange}
                                required
                            />
                            <span
                                className={styles.clearBtn}
                                onClick={this.handleTogglePasswordVisibility}>
                                <Icon className={styles.eye_icon} icon={this.state.icon} size={25}/>
                            </span>
                        </div>



                    </label>

                    <br />

                    <label className={styles.register_form_lable} style={{ color: this.state.emailError ? 'red' : 'black' }}>
                        Email*
                        <br />
                        <input className={styles.register_form_input}
                            type="text"
                            name="email"
                            onChange={this.handleChange}
                            required
                        />
                    </label>
                    <br />

                    <label className={styles.register_form_lable}>
                        Phone number
                        <br />
                        <input className={styles.register_form_input}
                            type="text"
                            name="phonenumber"
                            onChange={this.handleChange}
                        />
                    </label>

                </form>

                <div id={styles.button_container}>
                    <CommonButton 
                    action={this.handleSubmit} 
                    text="Register" />
                </div>

            </div>

        );

    }
}