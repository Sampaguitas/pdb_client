import React from "react";
import { connect } from "react-redux";

import { userActions } from "../../_actions";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//Components
import TableCheckBox from "../../_components/table-check-box";
import Input from "../../_components/input";
import Layout from "../../_components/layout";
import { users } from "../../_reducers/users.reducer";

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        password: "",
        confirmPassword: ""
      },
      submitted: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(userActions.getAll());
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
      user.firstName &&
      user.lastName &&
      user.email &&
      user.phone &&
      user.password &&
      user.confirmPassword
    ) {
      dispatch(userActions.register(user));
    }
  }

  render() {
    const { user, submitted } = this.state;
    const { users, registering, alert } = this.props;
    return (
      <Layout>
        <div id="user">
          <h2>Register new users</h2>
          <div className="row">
            <div className="col-md-4 mb-3">
              <div className="card">
                <div className="card-header">
                  <h5>New User</h5>
                </div>
                <div className="card-body">
                  <form name="form" onSubmit={this.handleSubmit}>
                    <Input
                      title="First Name"
                      name="firstName"
                      type="text"
                      value={user.firstName}
                      onChange={this.handleChange}
                      submitted={submitted}
                      inline={false}
                      required={true}
                    />
                    <Input
                      title="Last Name"
                      name="lastName"
                      type="text"
                      value={user.lastName}
                      onChange={this.handleChange}
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
                      title="Phone"
                      name="phone"
                      type="tel"
                      value={user.phone}
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
                      className="btn btn-leeuwen btn-full btn-lg"
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
                  <br />
                  {alert.message && (
                    <div className={`alert ${alert.type}`}>{alert.message}</div>
                  )}
                </div>
              </div>
            </div>
            <div className="col-md-8">
              <div className="card">
                <div className="card-header">
                  <h5>Users</h5>
                </div>
                <div className="card-body table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Admin</th>
                      </tr>
                    </thead>
                    {users.items && (
                      <tbody>
                        {users.items.map(u => (
                          <tr key={u._id}>
                            <td>{u.firstName + " " + u.lastName}</td>
                            <td>{u.email}</td>
                            <td>{u.phone}</td>
                            <td>
                              <TableCheckBox
                                id={u._id}
                                checked={u.isAdmin}
                                onChange={this.handleInputChange}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    )}
                  </table>
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
  const { users, alert } = state;
  return {
    alert,
    registering,
    users
  };
}

const connectedSettings = connect(mapStateToProps)(Settings);
export { connectedSettings as Settings };
