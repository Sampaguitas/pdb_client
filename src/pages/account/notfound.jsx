import React, { Component } from "react";
import { connect } from "react-redux";
import Layout from '../../_components/layout';
import logo from "../../_assets/logo.svg";
import pdb from "../../_assets/pdb.svg";

class NotFound extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event){
      event.preventDefault();
      window.location.href = "/login";
  }

  render() {
    const { alert } = this.props;
    return (
      <Layout alert={alert} background={true}>
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
  const { alert } = state;
  const { loggingIn } = state.authentication;
  return {
    alert,
    loggingIn
  };
}

const connectedNotFound = connect(mapStateToProps)(NotFound);
export { connectedNotFound as NotFound };
