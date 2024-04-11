import React, {Component} from 'react';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './styles.module.css';
import button_styles from './button_styles.css'
import JournalGrid from './JournalGrid';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { ADD_JOURNAL_CREATION_INFO } from '../../GraphQL/Mutations';

export default function MyJournalHelper() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    const [ createJournal, {data, loading, error}] = useMutation(ADD_JOURNAL_CREATION_INFO);

    return <MyJournals navigation={navigate} createJournal={createJournal} user={user}/> 
}

class MyJournals extends Component {
    constructor(props) {
        super(props);
        this.state = {
            journal_title: '',
            description: ''
        };

        this.handleChange = this.handleChange.bind(this);
    }

    createJournalOptions() {
        var modal = document.getElementById(styles.modal);
        modal.style.display = "block";
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    createJournalRequest = async (title, author_id, description) => {
        const result = await this.props.createJournal({ variables: {
            name: title,
            author_id: author_id,
            description: description,
            image_path: null,
            public: false
        },});
        return result.data.createJournal;
    }

    async handleJournalSubmit() {
        const title = this.state.journal_title;
        const author_id = this.props.user.id;
        const description = this.state.description;

        const data = await this.createJournalRequest(title, author_id, description);
        if (data) {
            this.props.navigation('/editor', {
                state: {
                    name: title,
                    journal_id: data.id
                }
            });
        }
    }

    render() {
        return (
            <div id={styles.my_journals_structure_container}>
                <style type="text/css">
                    {`
                    .btn-primary {
                        background-color: rgb(191, 93, 109);
                        border: 0;
                        width: 100%;
                        border-radius: 12px;
                        padding: 13px 0 13px 0;
                        font-size: 1.2em;
                        margin-bottom: 10px;
                        box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
                    }
                    .btn-primary:hover {
                        background-color: rgb(191, 112, 125);
                        border: 0;
                    }
                    .btn-primary:active {
                        --bs-btn-active-bg: rgb(191, 93, 109);
                        --bs-btn-active-border: 0;
                    }
                    `}
                </style>
                <div id={styles.modal}>
                    <div id={styles.modal_content}>
                        <span id={styles.close_button} onClick={() => {
                            var modal = document.getElementById(styles.modal);
                            modal.style.display = 'none';
                        }
                        }>&times;</span>
                        <h1 className={styles.journalOptionsText}>Choose a title for your journal</h1>
                        <input className={styles.journalOptionsInput} name="journal_title" onChange={this.handleChange}></input>
                        <h1 className={styles.journalOptionsText}>Write a description</h1>
                        <textarea id={styles.journal_description_input} name="description" onChange={this.handleChange}></textarea>
                        <Button variant="secondary" style={button_styles} onClick={() => this.handleJournalSubmit()}>OK</Button>
                    </div>
                </div>
                <Button variant="primary" onClick={() => this.createJournalOptions()}>
                        create new journal
                </Button>
                <JournalGrid />
            </div>
        );
    }
}