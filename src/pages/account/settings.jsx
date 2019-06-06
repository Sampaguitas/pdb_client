import React from "react";
import { connect } from "react-redux";
import { history } from '../../_helpers';
import queryString from 'query-string';
// import { Modal, Button } from 'react-bootstrap';
import { userActions, opcoActions } from "../../_actions";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//Components
import TableCheckBoxAdmin from "../../_components/table-check-box-admin";
import TableCheckBoxSuperAdmin from "../../_components/table-check-box-spadmin";
import UserRow from '../../_components/project-table/user-row.js';
import Modal from "../../_components/modal/modal.js"
import Input from "../../_components/input";
import Select from '../../_components/select';
import Layout from "../../_components/layout";
//import { users } from "../../_reducers/users.reducer";

function usersSorted(user) {
  if (user.items) {
      const newArray = user.items
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
}

function doesMatch(search, array, type) {
  if (!search) {
      return true;
  // } else if (!array) {
  //     return true;
  } else {
      switch(type) {
          case 'String':
              search = search.replace(/([()[{*+.$^\\|?])/g, "");
              return !!array.match(new RegExp(search, "i"));
          case 'Number': 
              return array == Number(search);
          case 'Boolean':
            if (Number(search) == 1) {
              return true;
            } else if (Number(search) == 2) {
              return !!array == 1;
            } else if (Number(search) == 3) {
              return !!array == 0;
            }
          default: return true;
      }
  }
}


class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      userName: "",
      name: "",
      opco: "",
      region: "",
      isAdmin: 0,
      isSuperAdmin: 0,
      users: [],
      loaded: false,
      show: false,
      submitted: false
    };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.handleChangeUser = this.handleChangeUser.bind(this);
    this.handleChangeHeader = this.handleChangeHeader.bind(this);
    this.filterName = this.filterName.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleOnclick = this.handleOnclick.bind(this);
    this.isUser = this.isUser.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(userActions.getAll());
    this.props.dispatch(opcoActions.getAll());
  }

  showModal() {
    this.setState({
      user: {
        userName: "",
        name: "",
        opcoId: "",
        email: "",
        password: "",
        confirmPassword: ""
      },
      show: true
    });
  }

  hideModal() {
    this.setState({
      user: {
        userName: "",
        name: "",
        opcoId: "",
        email: "",
        password: "",
        confirmPassword: ""
      },
      show: false
    });
  }

  handleChangeUser(event) {
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
    this.setState({
        [name]: value
    });
  }

  filterName(users){
    const { userName, name, opco, region, isAdmin, isSuperAdmin } = this.state
    if (users.items) {
      return usersSorted(users).filter(function (user) {
        return (doesMatch(userName, user.userName, 'String') 
        && doesMatch(name, user.name, 'String') 
        && doesMatch(opco, user.opco.name, 'String')
        && doesMatch(region, user.opco.region.name, 'String')
        && doesMatch(isAdmin, user.isAdmin, 'Boolean')
        && doesMatch(isSuperAdmin, user.isSuperAdmin, 'Boolean'));
      });
    }
}
  
  handleSubmit(event) {
    event.preventDefault();
    this.setState({ submitted: true });
    const { user } = this.state;
    const { dispatch } = this.props;
    if (
      user.id &&
      user.userName &&
      user.name &&
      user.opcoId &&
      user.email
    ) {
      dispatch(userActions.update(user));
      this.hideModal();
      this.setState({ submitted: false });
    } else if (
      user.userName &&
      user.name &&
      user.email &&
      user.password &&
      user.confirmPassword
    ) {
      dispatch(userActions.register(user));
      this.hideModal();
      this.setState({ submitted: false });
    }
  }

  handleOnclick(event, id) {
    let user = JSON.parse(localStorage.getItem('user'));
    if (event.target.type != 'checkbox' && this.props.users.items && user.isSuperAdmin) {
      let found = this.props.users.items.find(element => element.id === id);
      this.setState({
        user: {
          id: id,
          userName: found.userName,
          name: found.name,
          opcoId: found.opcoId,
          email: found.email,
        },
        show: true
      })
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
    const { user, userName, name, opco, region, isAdmin, isSuperAdmin, submitted } = this.state;
    const { registering, alert, opcos } = this.props;
    let currentUser = JSON.parse(localStorage.getItem('user'));
    return (
      <Layout>
        {alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div>}
        <br />
        <div id="setting">
          <h2>Settings</h2>
          <hr />
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <div className="row">
                    <div className="col-8">
                      <h5>Users</h5>
                    </div>
                    <div className="col-4 text-right">
                      <div className="modal-link" >
                        <FontAwesomeIcon icon="plus" className="red" name="plus" onClick={this.showModal}/>
                      </div>
                    </div>
                  </div>
                  
                </div>
                <div className="card-body table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th scope="col" style={{width: '10%'}}>Initials<br />
                          <input className="form-control" name="userName" value={userName} onChange={this.handleChangeHeader} />
                        </th>
                        <th scope="col">Name<br />
                          <input className="form-control" name="name" value={name} onChange={this.handleChangeHeader} />
                        </th>
                        <th scope="col">Operating Company<br />
                          <input className="form-control" name="opco" value={opco} onChange={this.handleChangeHeader} />
                        </th>
                        <th scope="col" style={{width: '15%'}}>Region<br />
                          <input className="form-control" name="region" value={region} onChange={this.handleChangeHeader} />
                        </th>
                        <th scope="col" style={{width: '10%'}}>Admin<br />
                        <select className="form-control" name="isAdmin" value={isAdmin} onChange={this.handleChangeHeader}>
                          <option key="1" value="1">Any</option>
                          <option key="2" value="2">True</option> 
                          <option key="3" value="3">False</option>                    
                        </select>
                        </th>
                        <th scope="col" style={{width: '10%'}}>SpAdmin<br />
                        <select className="form-control" name="isSuperAdmin" value={isSuperAdmin} onChange={this.handleChangeHeader}>
                          <option key="1" value="1">Any</option>
                          <option key="2" value="2">True</option> 
                          <option key="3" value="3">False</option>  
                        </select>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.props.users.items && this.filterName(this.props.users).map((user) => 
                          <UserRow 
                            user={user}
                            currentUser={currentUser}
                            handleOnclick={this.handleOnclick}
                            handleInputChange={this.handleInputChange}
                            key={user._id} 
                            />
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <Modal
              show={this.state.show}
              hideModal={this.hideModal}
              title={this.state.user.id ? 'Update user' : 'Add user'}
            >
              <div className="col-12">
                    <form name="form" onSubmit={this.handleSubmit}>
                      <Input
                        title="Initials"
                        name="userName"
                        type="text"
                        value={user.userName}
                        onChange={this.handleChangeUser}
                        submitted={submitted}
                        inline={false}
                        required={true}
                      />
                      <Input
                        title="Full Name"
                        name="name"
                        type="text"
                        value={user.name}
                        onChange={this.handleChangeUser}
                        submitted={submitted}
                        inline={false}
                        required={true}
                      />
                      <Select
                          title="OPCO"
                          name="opcoId"
                          options={opcos.items}
                          value={user.opcoId}
                          onChange={this.handleChangeUser}
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
                        onChange={this.handleChangeUser}
                        submitted={submitted}
                        inline={false}
                        required={true}
                      />
                      {!this.state.user.id &&
                      <div>
                        <Input
                          title="Password"
                          name="password"
                          type="password"
                          value={user.password}
                          onChange={this.handleChangeUser}
                          submitted={submitted}
                          inline={false}
                          required={true}
                        />
                        <Input
                          title="Confirm Password"
                          name="confirmPassword"
                          type="password"
                          value={user.confirmPassword}
                          onChange={this.handleChangeUser}
                          submitted={submitted}
                          inline={false}
                          required={true}
                        />
                      </div>
                      }
                      <div className="modal-footer">
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
                          {this.state.user.id ? 'Update' : 'Create'}
                        </button>
                      </div>
                    </form>
              </div>
            </Modal>
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
