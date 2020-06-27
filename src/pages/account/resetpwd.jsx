import React from "react";
import { connect } from "react-redux";
import { NavLink } from 'react-router-dom';
import queryString from 'query-string';
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
  sidemenuActions,
  userActions 
} from "../../_actions";
import Layout from "../../_components/layout";
import InputIcon from "../../_components/input-icon";
import logo from "../../_assets/logo.svg";
import pdb from "../../_assets/pdb.svg";

class ResetPwd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        user: {
            userId: '',
            token: '',
            newPassword: '',
            confirmPassword: '',
        },
        submitted: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
  }

  componentDidMount() {
    const { location, dispatch } = this.props;
    const { user } = this.state;
    var qs = queryString.parse(location.search);
    if (qs.id && qs.token) {
        this.setState({
            user: {
                ...user,
                userId: qs.id,
                token: qs.token
            }
        });
    }
    //Clear Selection
    dispatch(userActions.logout());
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
    const { user } = this.state;
    const { name, value } = e.target;
    this.setState({
        user: {
            ...user,
            [name]: value
        }
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const { user } = this.state;
    const { dispatch } = this.props;
    this.setState({
      ...this.state,
      submitted: true
    });
    if (user.newPassword && user.confirmPassword) {
      dispatch(userActions.resetPwd(user));
    }
  }

  onKeyPress(event) {
    if (event.which === 13 /* prevent form submit on key Enter */) {
      event.preventDefault();
    }
  }

  render() {
    const { alert, sidemenu, reseting } = this.props;
    const { user, submitted } = this.state;
    return (
      <Layout sidemenu={sidemenu}>
            <div
              id="resetpwd-card"
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
                    <form
                        name="form"
                        onKeyPress={this.onKeyPress}
                        onSubmit={this.handleSubmit}
                    >
                        <InputIcon
                            title="New Password"
                            name="newPassword"
                            type="password"
                            value={user.newPassword}
                            onChange={this.handleChange}
                            placeholder="New Password"
                            icon="lock"
                            submitted={submitted}
                            autoComplete="new-password"
                        />
                        <InputIcon
                            title="Confirm Password"
                            name="confirmPassword"
                            type="password"
                            value={user.confirmPassword}
                            onChange={this.handleChange}
                            placeholder="Confirm Password"
                            icon="lock"
                            submitted={submitted}
                            autoComplete="new-password"
                        />
                        <hr />
                        <button type="submit" className="btn btn-leeuwen btn-full btn-lg">
                          <span><FontAwesomeIcon icon={reseting ? "spinner" : "hand-point-right"} className={reseting ? "fa-pulse fa-fw fa mr-2" : "fa mr-2"}/>Reset</span>
                        </button>
                        <NavLink to={{ pathname: "/login" }} className="btn btn-link" tag="a">Go back to login page</NavLink>
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
  const { reseting } = state.resetpwd;
  return {
    alert,
    sidemenu,
    reseting
  };
}

const connectedResetPwd = connect(mapStateToProps)(ResetPwd);
export { connectedResetPwd as ResetPwd };
