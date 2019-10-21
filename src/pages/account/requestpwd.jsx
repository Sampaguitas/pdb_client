import React, { Component } from "react";
import { connect } from "react-redux";
import { NavLink, Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { userActions } from "../../_actions";
import Layout from "../../_components/layout";
import InputIcon from "../../_components/input-icon";
import logo from "../../_assets/logo.svg";
import pdb from "../../_assets/pdb.svg";

class RequestPwd extends React.Component {
  constructor(props) {
    super(props);
    this.props.dispatch(userActions.logout());
    this.state = {
      email: "",
      submitted: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({ submitted: true });
    const { email } = this.state;
    const { dispatch } = this.props;
    if (email) {
      dispatch(userActions.requestPwd(email));
    }
  }

  onKeyPress(event) {
    if (event.which === 13 /* prevent form submit on key Enter */) {
      event.preventDefault();
    }
  }

  render() {
    const { alert, requesting } = this.props;
    const { email, submitted } = this.state;
    return (
      <Layout alert={alert} background={true}>
            <div
              id="requestpwd-card"
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
                    <p>Please provide your email address and we'll send you instructions on how to change your password.</p>
                    <form
                        name="form"
                        onKeyPress={this.onKeyPress}
                    >
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
                        <hr />
                        <button
                          type="submit"
                          className="btn btn-leeuwen btn-full btn-lg"
                          onClick={this.handleSubmit}
                        >
                        {requesting && (
                            <FontAwesomeIcon
                            icon="spinner"
                            className="fa-pulse fa-1x fa-fw"
                            />
                        )}
                        Get a new password
                        </button>
                        <NavLink
                          to={{
                            pathname: "/login"
                          }}
                          className="btn btn-link" tag="a"
                        >
                          Go back to login page
                        </NavLink>
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
  const { requesting } = state.requestpwd;
  return {
    alert,
    requesting
  };
}

const connectedRequestPwd = connect(mapStateToProps)(RequestPwd);
export { connectedRequestPwd as RequestPwd };
