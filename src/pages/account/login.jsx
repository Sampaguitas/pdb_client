import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUnlock, faUser } from '@fortawesome/free-solid-svg-icons';

import { userActions } from '../../_actions';
import Layout from '../../_components/layout';
import InputIcon from '../../_components/input-icon';
import logo from '../../_assets/logo.svg';
import pdb from '../../_assets/pdb.svg';
import './login.css';


class Login extends React.Component {
    constructor(props) {
        super(props);

        // reset login status
        this.props.dispatch(userActions.logout());

        this.state = {
            email: '',
            password: '',
            submitted: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleSubmit(e) {
        e.preventDefault();

        this.setState({ submitted: true });
        const { email, password } = this.state;
        const { dispatch } = this.props;
        if (email && password) {
            dispatch(userActions.login(email, password));
        }
    }

    render() {
        const { loggingIn } = this.props;
        const { email, password, submitted } = this.state;
        return (
            <Layout>
            <div id="login-card" className='row justify-content-center align-self-center'>
                    <div className="card">
                        <div className="card-body">
                            <img src={logo} className="img-fluid" alt="Van Leeuwen Pipe and Tube" />
                            <br />
                            <img src={pdb} className="img-fluid" alt="Project Database" />
                            <hr />
                            <form name="form" onSubmit={this.handleSubmit}>
                                <InputIcon
                                    title="Email"
                                    name="email"
                                    type="email"
                                    value={email}
                                    onChange={this.handleChange}
                                    placeholder="Email"
                                    icon={faUser}
                                    submitted={submitted}
                                />
                                <InputIcon
                                    title="Password"
                                    name="password"
                                    type="password"
                                    value={password}
                                    onChange={this.handleChange}
                                    placeholder="Password"
                                    icon={faUnlock}
                                    submitted={submitted}
                                />
                                <hr />
                                <button type="submit" className="btn btn-leeuwen btn-full btn-lg">Login</button>
                            </form>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }
}

function mapStateToProps(state) {
    const { loggingIn } = state.authentication;
    return {
        loggingIn
    };
}

const connectedLogin = connect(mapStateToProps)(Login);
export { connectedLogin as Login }; 