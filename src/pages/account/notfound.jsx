import React, { Component } from "react";
import { connect } from "react-redux";
import Layout from '../../_components/layout';
import "./notfound.css";

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
    return (
        <div className="row">
            <div className="col-md-12">
                <div className="error-template">
                    <h1>Ooops!</h1>
                    <h2>404 Not Found</h2>
                    <div className="error-details">
                        Sorry, an error has occured, Requested page not found!
                    </div>
                    <div className="error-actions">
                        <button type="submit" className="btn btn-leeuwen " onClick={this.handleSubmit}>
                            Take Me Home
                        </button>
                    </div>
                </div>
            </div>
        </div>
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
