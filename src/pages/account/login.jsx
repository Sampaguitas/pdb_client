import React, { Component } from "react";
import { connect } from "react-redux";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { userActions } from "../../_actions";
import Layout from "../../_components/layout";
import InputIcon from "../../_components/input-icon";
import logo from "../../_assets/logo.svg";
import pdb from "../../_assets/pdb.svg";
import "./login.css";

class Login extends React.Component {
  constructor(props) {
    super(props);

    // reset login status
    this.props.dispatch(userActions.logout());

    this.state = {
      email: "",
      password: "",
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
      dispatch(userActions.login(email, encodeURI(password)));
    }
  }

  render() {
    const { alert, loggingIn } = this.props;
    const { email, password, submitted } = this.state;
    return (
      <Layout>
        <div
          id="login-card"
          className="row justify-content-center align-self-center"
        >
          <div className="card card-login">
            <div className="card-body">
              <img
                src={logo}
                className="img-fluid"
                alt="Van Leeuwen Pipe and Tube"
              />
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
                  icon="user"
                  submitted={submitted}
                  autoComplete="email"
                />
                <InputIcon
                  title="Password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={this.handleChange}
                  placeholder="Password"
                  icon="lock"
                  submitted={submitted}
                  autoComplete="current-password"
                />
                <hr />
                <button
                  type="submit"
                  className="btn btn-leeuwen btn-full btn-lg"
                >
                  {loggingIn && (
                    <FontAwesomeIcon
                      icon="spinner"
                      className="fa-pulse fa-1x fa-fw"
                    />
                  )}
                  Login
                </button>
                <br />
                {alert.message && (
                  <div className={`alert ${alert.type}`}>{alert.message}</div>
                )}
              </form>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

function mapStateToProps(state) {
  const { alert } = state;
  const { loggingIn } = state.authentication;
  return {
    alert,
    loggingIn
  };
}

const connectedLogin = connect(mapStateToProps)(Login);
export { connectedLogin as Login };
