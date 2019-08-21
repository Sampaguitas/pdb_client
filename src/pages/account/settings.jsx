import React from "react";
import { connect } from "react-redux";
import { userActions, opcoActions } from "../../_actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TableCheckBoxAdmin from "../../_components/project-table/table-check-box-admin";
import TableCheckBoxSuperAdmin from "../../_components/project-table/table-check-box-spadmin";
import Modal from "../../_components/modal/modal.js"
import Input from "../../_components/input";
import Select from '../../_components/select';
import Layout from "../../_components/layout";

function arraySorted(array, field) {
  if (array) {
      const newArray = array
      newArray.sort(function(a,b){
          if (a[field] < b[field]) {
              return -1;
          }
          if (a[field] > b[field]) {
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

function canClick(found, currentUser) {
  if (currentUser.isSuperAdmin) {
    return true;
  } else if (_.isEqual(currentUser.regionId, found.opco.regionId)){
    return true;
  } else {
    return false;
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
      submitted: false,
      show: false
      
    };
    this.getScrollWidthY = this.getScrollWidthY.bind(this);
    this.getTblBound = this.getTblBound.bind(this);
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.handleChangeUser = this.handleChangeUser.bind(this);
    this.handleChangeHeader = this.handleChangeHeader.bind(this);
    this.filterName = this.filterName.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleOnclick = this.handleOnclick.bind(this);
    this.accessibleArray = this.accessibleArray.bind(this);
    this.checkBoxDisabled = this.checkBoxDisabled.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(userActions.getAll());
    this.props.dispatch(opcoActions.getAll());
  }

  getScrollWidthY() {
    var scroll = document.getElementById("tblSettingsBody");
    if (!scroll) {
        return 0;
    } else {
        if(scroll.clientHeight == scroll.scrollHeight){
            return 0;
        } else {
            return 18;
        }
    }
  }

  getTblBound() {
    const tblContainer = document.getElementById("tblSettingsContainer");
    if (!tblContainer) {
      return {};
    }
    const rect = tblContainer.getBoundingClientRect();
    return {
      left: rect.left,
      top: rect.top + window.scrollY,
      width: rect.width || rect.right - rect.left,
      height: rect.height || rect.bottom - rect.top
    };
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
      submitted: false,
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
      return arraySorted(users.items, 'name').filter(function (user) {
        return (doesMatch(userName, user.userName, 'String') 
        && doesMatch(name, user.name, 'String') 
        && doesMatch(opco, user.opco.name, 'String')
        && doesMatch(region, user.opco.region.name, 'String')
        && doesMatch(isAdmin, user.isAdmin, 'Boolean')
        && doesMatch(isSuperAdmin, user.isSuperAdmin, 'Boolean'));
      });
    }
  }

  accessibleArray(items, sortBy) {
    let user = JSON.parse(localStorage.getItem('user'));
    if (items) {
        return arraySorted(items, sortBy).filter(function (item) {
            if (user.isSuperAdmin) {
                return true;
            } else {
                return _.isEqual(user.regionId, item.regionId);
            }
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
      user.opcoId &&
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
    const { users } = this.props
    let currentUser = JSON.parse(localStorage.getItem('user'));
    //if (event.target.type != 'checkbox' && this.props.users.items) {
    if (event.target.dataset['type'] != 'checkbox' && users.items) {
      let found = users.items.find(element => element.id === id);
      if (canClick(found, currentUser)) {
        this.setState({
          user: {
            id: id,
            userName: found.userName,
            name: found.name,
            opcoId: found.opcoId,
            email: found.email,
          },
          show: true
        });
      }
    }
  }

  handleDeletUser(event, id) {
    event.preventDefault();
    this.props.dispatch(userActions.delete(id));
    this.hideModal();
    this.setState({ submitted: false });
  }

  checkBoxDisabled(user, type) {
    let currentUser = JSON.parse(localStorage.getItem('user'));
    if (_.isEqual(user.id, currentUser.id)) {
        return true;
    } else if (type === 'isSuperAdmin' && !currentUser.isSuperAdmin) {
        return true;
    } else if (_.isEqual(currentUser.regionId, user.opco.regionId)) {
        return false;
    } else if (currentUser.isSuperAdmin) {
        return false;
    } else {
        return true;
    }
  }

  onKeyPress(event) {
    if (event.which === 13 /* prevent form submit on key Enter */) {
      event.preventDefault();
    }
  }

  render() {
    const { user, userName, name, opco, region, isAdmin, isSuperAdmin, submitted } = this.state;
    const { registering, userUpdating, userDeleting, alert, opcos } = this.props;
    const tblBound = this.getTblBound();
    const tblScrollWidth = this.getScrollWidthY();
    return (
      <Layout alert={this.props.alert}>
        {alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div>}
        <div id="setting" className="full-height">
          <h2>Add or Update user</h2>
          <hr />
          <div className="row full-height">
            <div className="col-12 full-height">
              <div className="card full-height" id="tblSettingsContainer">
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
                <div className="card-body"> {/* table-responsive */}
                  <table className="table table-hover table-bordered table-sm">
                    <thead>
                      <tr style={{display: 'block', height: '62px'}}>
                        <th scope="col" style={{width: `${tblBound.width*0.10 + 'px'}`}}>Initials<br />
                          <input className="form-control" name="userName" value={userName} onChange={this.handleChangeHeader} />
                        </th>
                        <th scope="col" style={{width: `${tblBound.width*0.30 + 'px'}`}}>Name<br />
                          <input className="form-control" name="name" value={name} onChange={this.handleChangeHeader} />
                        </th>
                        <th scope="col" style={{width: `${tblBound.width*0.35 + 'px'}`}}>Operating Company<br />
                          <input className="form-control" name="opco" value={opco} onChange={this.handleChangeHeader} />
                        </th>
                        <th scope="col" style={{width: `${tblBound.width*0.15 + 'px'}`}}>Region<br />
                          <input className="form-control" name="region" value={region} onChange={this.handleChangeHeader} />
                        </th>
                        <th scope="col" style={{width: `${tblBound.width*0.10 + 'px'}`}}>Admin<br />
                        <select className="form-control" name="isAdmin" value={isAdmin} onChange={this.handleChangeHeader}>
                          <option key="1" value="1">Any</option>
                          <option key="2" value="2">True</option>
                          <option key="3" value="3">False</option>                  
                        </select>
                        </th>
                        <th scope="col" style={{width: `${tblBound.width*0.10 + 'px'}`}}>SpAdmin<br />
                        <select className="form-control" name="isSuperAdmin" value={isSuperAdmin} onChange={this.handleChangeHeader}>
                          <option key="1" value="1">Any</option>
                          <option key="2" value="2">True</option> 
                          <option key="3" value="3">False</option>  
                        </select>
                        </th>
                      </tr>
                    </thead>
                    <tbody style={{display:'block', height: `${tblBound.height-36-25-62 + 'px'}`, overflow:'auto'}} id="tblSettingsBody">
                      {this.props.users.items && this.filterName(this.props.users).map((u) =>
                        <tr key={u._id}> {/* onClick={(event) => this.handleOnclick(event, u._id)} */}
                          <td style={{width: `${tblBound.width*0.10 + 'px'}`}} onClick={(event) => this.handleOnclick(event, u._id)}>{u.userName}</td>
                          <td style={{width: `${tblBound.width*0.30 + 'px'}`}} onClick={(event) => this.handleOnclick(event, u._id)}>{u.name}</td>
                          <td style={{width: `${tblBound.width*0.35 + 'px'}`}} onClick={(event) => this.handleOnclick(event, u._id)}>{u.opco.name}</td>
                          <td style={{width: `${tblBound.width*0.15 + 'px'}`}} onClick={(event) => this.handleOnclick(event, u._id)}>{u.opco.region.name}</td>
                          <td style={{width: `${tblBound.width*0.10 + 'px'}`}} data-type="checkbox">
                              <TableCheckBoxAdmin
                                  id={u._id}
                                  checked={u.isAdmin}
                                  onChange={this.handleInputChange}
                                  disabled={this.checkBoxDisabled(u,'isAdmin')}
                                  data-type="checkbox"
                              />
                          </td>
                          <td style={{width: `${tblBound.width*0.10-tblScrollWidth + 'px'}`}} data-type="checkbox">
                              <TableCheckBoxSuperAdmin
                                  id={u._id}
                                  checked={u.isSuperAdmin}
                                  onChange={this.handleInputChange}
                                  disabled={this.checkBoxDisabled(u,'isSuperAdmin')}
                                  data-type="checkbox"
                              />
                          </td>
                        </tr>                      
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
                    <form
                      name="form"
                      onKeyPress={this.onKeyPress}
                    >
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
                          options={this.accessibleArray(opcos.items, 'name')}
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
                        {this.state.user.id ?
                            <div className="row">
                                <div className="col-6">
                                    <button
                                        className="btn btn-outline-dark btn-lg"
                                        onClick={(event) => {this.handleDeletUser(event, this.state.user.id)}}
                                    >
                                        {userDeleting && (
                                            <FontAwesomeIcon
                                                icon="spinner"
                                                className="fa-pulse fa-1x fa-fw" 
                                            />
                                        )}
                                        Delete
                                    </button>
                                </div>
                                <div className="col-6">
                                    <button
                                        className="btn btn-outline-leeuwen btn-lg"
                                        onClick={event => this.handleSubmit(event)}
                                    >
                                        {userUpdating && (
                                            <FontAwesomeIcon
                                                icon="spinner"
                                                className="fa-pulse fa-1x fa-fw" 
                                            />
                                        )}
                                        Update
                                    </button>
                                </div>
                            </div>
                        :
                            <button
                                className="btn btn-outline-leeuwen btn-lg btn-full"
                                onClick={event => this.handleSubmit(event)}
                            >
                                {registering && (
                                    <FontAwesomeIcon
                                        icon="spinner"
                                        className="fa-pulse fa-1x fa-fw" 
                                    />
                                )}
                                Create
                            </button>
                        }
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
  const { users, alert, opcos } = state;
  const { userUpdating, userDeleting } = state.users;
  const { registering } = state.registration;
  
  return {
    alert,
    userUpdating,
    userDeleting,
    registering,
    users,
    opcos
  };
}

const connectedSettings = connect(mapStateToProps)(Settings);
export { connectedSettings as Settings };
