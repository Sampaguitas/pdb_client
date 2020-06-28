import React, { Component } from "react";
import { connect } from "react-redux";
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
  sidemenuActions
} from "../../_actions";
import Layout from '../../_components/layout';
import logo from "../../_assets/logo.svg";
import pdb from "../../_assets/pdb.svg";

class NotFound extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuItem: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
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
    dispatch(sidemenuActions.restore())
  }

  handleSubmit(event){
      event.preventDefault();
      window.location.href = "/login";
  }

  render() {
    const { menuItem } = this.state;
    const { sidemenu } = this.props;
    return (
      <Layout sidemenu={sidemenu} menuItem={menuItem}>
        <div
          id="notfound-card"
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
              <h2>#404 Not Found</h2>
              <p>The page requested was not found!</p>
              <p>Click on the button below to go back to the login page.</p>
              <hr />
              <button
                type="submit"
                className="btn btn-leeuwen btn-full btn-lg"
                onClick={this.handleSubmit}
              >
                Go back to login page
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

function mapStateToProps(state) {
  const { alert, sidemenu } = state;
  const { loggingIn } = state.authentication;
  return {
    alert,
    sidemenu,
    loggingIn
  };
}

const connectedNotFound = connect(mapStateToProps)(NotFound);
export { connectedNotFound as NotFound };
