import React, {Component} from 'react';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

/* 
    Button bar handling the navigation to main pages
*/
export default function NavigationBar() {
    const navigation = useNavigate();
    return (
        <>
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
            <Button variant="primary" onClick={() => {
                navigation('/home');
            }}>
                home
            </Button>
            <Button variant="primary" onClick={() => {
               navigation('/activity'); 
            }}>
                activity
            </Button>

            <Button variant="primary" onClick={() => {
                navigation('/searchCommunity');
            }}>
                community
            </Button>

            <Button variant="primary" onClick={() => {
                navigation('/chatroom');

            }}>
                messages
            </Button>
            <Button variant="primary" onClick={() => {
               navigation('/settings'); 
            }}>
                settings
            </Button>
        </>
    );

}