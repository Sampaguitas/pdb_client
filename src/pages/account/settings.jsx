import React from "react";
import { connect } from "react-redux";

import { userActions, opcoActions } from "../../_actions";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//Components
import TableCheckBoxAdmin from "../../_components/table-check-box-admin";
import Input from "../../_components/input";
import Select from '../../_components/select';
import Layout from "../../_components/layout";
//import { users } from "../../_reducers/users.reducer";

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        userName: "",
        name: "",
        opcoId: "",
        email: "",
        password: "",
        confirmPassword: ""
      },
      tableHeader: {
        name:'',
        opco: ''
      },
      tableUsers: [],
      loaded: false,
      submitted: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.isUser = this.isUser.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(userActions.getAll());
    this.props.dispatch(opcoActions.getAll());
  }

  handleChange(event) {
    const { name, value } = event.target;
    const { user } = this.state;
    this.setState({
      user: {
        ...user,
        [name]: value
      }
    });
  }
  
  handleSubmit(event) {
    event.preventDefault();

    this.setState({ submitted: true });
    const { user } = this.state;
    const { dispatch } = this.props;
    if (
      user.userName &&
      user.name &&
      user.email &&
      user.password &&
      user.confirmPassword
    ) {
      dispatch(userActions.register(user));
    }
  }

  isUser(id) {
    let user = JSON.parse(localStorage.getItem('user'));
    if (user.id == id) {
      return true;
    } else {
      return false;
    }
  }

  render() {
    const { user, submitted } = this.state;
    const { users, registering, alert, opcos } = this.props;
    return (
      <Layout>
        {alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div>}
        <br />
        <div id="setting">
          <h2>Settings</h2>
          <hr />
          <div className="row">
            <div className="col-md-8 col-sm-12 mb-sm-3">
              <div className="card">
                <div className="card-header">
                  <h5>Users</h5>
                </div>
                <div className="card-body table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Operating Company</th>
                        <th>Admin</th>
                      </tr>
                    </thead>
                    {users.items && (
                      <tbody>
                        {users.items.map(u => (
                          <tr key={u._id}>
                            <td>{u.name}</td>
                            <td>{u.opco.name}</td>
                            <td>
                            {
                              this.isUser(u._id) ?
                                <TableCheckBoxAdmin
                                  id={u._id}
                                  checked={u.isAdmin}
                                  onChange={this.handleInputChange}
                                  disabled={true}
                                />
                              :
                              <TableCheckBoxAdmin
                                id={u._id}
                                checked={u.isAdmin}
                                onChange={this.handleInputChange}
                                disabled={false}
                              />
                            }
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    )}
                  </table>
                </div>
              </div>
            </div>
            <div className="col-md-4 col-sm-12">
              <div className="card">
                <div className="card-header">
                  <h5>New User</h5>
                </div>
                <div className="card-body">
                  <form name="form" onSubmit={this.handleSubmit}>
                    <Input
                      title="Initials"
                      name="userName"
                      type="text"
                      value={user.userName}
                      onChange={this.handleChange}
                      submitted={submitted}
                      inline={false}
                      required={true}
                    />
                    <Input
                      title="Full Name"
                      name="name"
                      type="text"
                      value={user.name}
                      onChange={this.handleChange}
                      submitted={submitted}
                      inline={false}
                      required={true}
                    />
                    <Select
                        title="OPCO"
                        name="opcoId"
                        options={opcos.items}
                        value={user.opcoId}
                        onChange={this.handleChange}
                        placeholder=""
                        submitted={submitted}
                        inline={false}
                        required={true}
                    />
                    <Input
                      title="Email"
                      name="email"
                      type="email"
                      value={user.email}
                      onChange={this.handleChange}
                      submitted={submitted}
                      inline={false}
                      required={true}
                    />
                    <Input
                      title="Password"
                      name="password"
                      type="password"
                      value={user.password}
                      onChange={this.handleChange}
                      submitted={submitted}
                      inline={false}
                      required={true}
                    />
                    <Input
                      title="Confirm Password"
                      name="confirmPassword"
                      type="password"
                      value={user.confirmPassword}
                      onChange={this.handleChange}
                      submitted={submitted}
                      inline={false}
                      required={true}
                    />
                    <button
                      type="submit"
                      className="btn btn-leeuwen btn-full btn-lg mb-3"
                    >
                      {registering && (
                        <FontAwesomeIcon
                          icon="spinner"
                          className="fa-pulse fa-1x fa-fw"
                        />
                      )}
                      Register
                    </button>
                  </form>
                  {/* <br /> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

function mapStateToProps(state) {
  const { registering } = state.registration;
  const { users, alert, opcos } = state;
  return {
    alert,
    registering,
    users,
    opcos
  };
}

const connectedSettings = connect(mapStateToProps)(Settings);
export { connectedSettings as Settings };
