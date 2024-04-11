
import React, {Component} from 'react';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';


export default class CommonButton extends Component {

    render() {
        return (
            <>
                <style type="text/css">
                    {`
                    .btn-primary {
                        background-color: rgb(191, 93, 109);
                        border: 0;
                        width: 100px;
                    }
                    .btn-primary:hover {
                        background-color: rgb(191, 93, 109);
                        border: 0;
                    }
                    .btn-primary:active {
                        --bs-btn-active-bg: rgb(138, 61, 74);
                        --bs-btn-active-border: 0;
                    }
                    `}
                </style>
                <Button variant="primary" onClick={this.props.action}>
                    {this.props.text}
                </Button>
            </>
        )
    }
}