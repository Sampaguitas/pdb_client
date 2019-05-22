import React from "react";
import { connect } from "react-redux";

import { userActions, opcoActions } from "../../_actions";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//Components
import TableCheckBox from "../../_components/table-check-box";
import Input from "../../_components/input";
import Select from '../../_components/select';
import Layout from "../../_components/layout";
//import { users } from "../../_reducers/users.reducer";

function userSorted(user) {
  const newArray = user
  newArray.sort(function(a,b){
      if (a.name < b.name) {
          return -1;
      }
      if (a.name > b.name) {
          return 1;
      }
      return 0;
  });
  return newArray;
}

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
        opco: '',
        admin: ''
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

  handleChangeHeader(event) {
    const { name, value } = event.target;
    const { tableHeader } = this.state;
    this.setState({
      tableHeader: {
        ...tableHeader,
        [name]: value
      }      
    }, () => {
        this.filterTable(tableHeader.name, tableHeader.opco);
    });
  }
  
  filterTable(name, opco){
    if (!name && !opco) {
        this.setState({
          tableUsers: userSorted(this.props.users.items)
        });
    } else {
        name = name.replace(/([()[{*+.$^\\|?])/g, ""); 
        opco = opco.replace(/([()[{*+.$^\\|?])/g, "");
        this.setState({
          tableUsers: userSorted(this.props.users.items).filter(function (user) {
                if(name && opco) {
                    return !!user.name.match(new RegExp(name, "i")) && !!user.opco.name.match(new RegExp(opco, "i"))
                } else if (name) {
                    return !!user.name.match(new RegExp(name, "i"))
                } else {
                    return !!user.opco.name.match(new RegExp(opco, "i"))
                }
            })
        });
    }
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
    {users.items && this.state.loaded === false && this.stateReload()}
    return (
      <Layout>
        <div id="user">
          <h2>Register new users / Permissions</h2>
          <div className="row">
            <div className="col-md-4 mb-3">
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
                        <th>User<br />
                          <input className="form-control" name="name" value={name} onChange={this.handleChangeHeader} />
                        </th>
                        <th>Operating Company<br />
                          <input className="form-control" name="opco" value={opco} onChange={this.handleChangeHeader} />
                        </th>
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
                                <TableCheckBox
                                  id={u._id}
                                  checked={u.isAdmin}
                                  onChange={this.handleInputChange}
                                  disabled={true}
                                />
                              :
                              <TableCheckBox
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
