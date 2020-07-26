import React, { Component } from "react";
import { connect } from "react-redux";
import { NavLink, Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  accessActions,
  collitypeActions,
  docdefActions,
  docfieldActions,
  fieldActions,
  fieldnameActions,
  poActions,
  projectActions, 
  supplierActions, 
  userActions,
  sidemenuActions,
} from "../../_actions";
import {
  InputIcon,
  Layout
} from "../../_components";
import logo from "../../_assets/logo.svg";
import pdb from "../../_assets/pdb.svg";

class RequestPwd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      submitted: false,
      menuItem: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(userActions.logout());
    //Clear Selection
    dispatch(accessActions.clear());
    dispatch(collitypeActions.clear());
    dispatch(docdefActions.clear());
    dispatch(docfieldActions.clear());
    dispatch(fieldActions.clear());
    dispatch(fieldnameActions.clear());
    dispatch(poActions.clear());
    dispatch(projectActions.clearSelection());
    dispatch(supplierActions.clear());
    dispatch(sidemenuActions.restore());
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
    const { alert, requesting, sidemenu } = this.props;
    const { email, menuItem, submitted } = this.state;
    return (
      <Layout sidemenu={sidemenu} menuItem={menuItem}>
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
                        onSubmit={this.handleSubmit}
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
                        <button type="submit" className="btn btn-leeuwen btn-full btn-lg">
                          <span><FontAwesomeIcon icon={requesting ? "spinner" : "hand-point-right"} className={requesting ? "fa-pulse fa-fw fa mr-2" : "fa mr-2"}/>Submit</span>
                        </button>
                        <NavLink to={{ pathname: "/login" }} className="btn btn-link" tag="a"> Go back to login page</NavLink>
                        <br />
                        {alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div>}
                    </form>
                    </div>
                </div>
            </div>
      </Layout>
    );
  }
}

function mapStateToProps(state) {
  const { alert, sidemenu } = state;
  const { requesting } = state.requestpwd;
  return {
    alert,
    sidemenu,
    requesting
  };
}

const connectedRequestPwd = connect(mapStateToProps)(RequestPwd);
export { connectedRequestPwd as RequestPwd };
