import React from "react";
import { connect } from "react-redux";
import { accessActions, opcoActions, projectActions, supplierActions, userActions } from "../../_actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TableCheckBoxAdmin from "../../_components/project-table/table-check-box-admin";
import TableCheckBoxSuperAdmin from "../../_components/project-table/table-check-box-spadmin";
import Modal from "../../_components/modal";
import Input from "../../_components/input";
import Select from '../../_components/select';
import Layout from "../../_components/layout";
import HeaderInput from '../../_components/project-table/header-input';
import HeaderCheckBox from '../../_components/project-table/header-check-box';

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
            if (search == 'any') {
              return true;
            } else if (search == 'true') {
              return !!array == 1;
            } else if (search == 'false') {
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
    const { dispatch } = this.props;
    //Clear Selection
    dispatch(accessActions.clear());
    dispatch(projectActions.clearSelection());
    dispatch(supplierActions.clear());
    //Get users and opcos
    dispatch(userActions.getAll());
    dispatch(opcoActions.getAll());
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

    return (
      <Layout alert={this.props.alert}>
        {alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div>}
          <h2>Add or Update user</h2>
          <hr />
          <div id="setting" className="full-height">
            <div className="action-row row ml-1 mb-3 mr-1" style={{height: '34px'}}>
              <div className="ml-auto pull-right">
                  <button
                      className="btn btn-leeuwen-blue btn-lg"
                      onClick={this.showModal}
                      style={{height: '34px'}}
                  >
                      <span><FontAwesomeIcon icon="plus" className="fa-lg mr-2"/>Create User</span>
                  </button>
              </div>
            </div>
            <div className="" style={{height: 'calc(100% - 44px)'}}>
              <div className="row ml-1 mr-1 full-height" style={{borderStyle: 'solid', borderWidth: '1px', borderColor: '#ddd'}}>
                <div className="table-responsive custom-table-container" >
                  <table className="table table-hover table-bordered table-sm">
                    <thead>
                      <tr>
                        <HeaderInput
                            type="text"
                            title="Initials"
                            name="userName"
                            value={userName}
                            onChange={this.handleChangeHeader}
                            width="10%" 
                        />
                        <HeaderInput
                            type="text"
                            title="Name"
                            name="name"
                            value={name}
                            onChange={this.handleChangeHeader}
                            width="30%" 
                        />
                        <HeaderInput
                            type="text"
                            title="Operating Company"
                            name="opco"
                            value={opco}
                            onChange={this.handleChangeHeader}
                            width="30%"
                        />
                        <HeaderInput
                            type="text"
                            title="Region"
                            name="region"
                            value={region}
                            onChange={this.handleChangeHeader}
                            width="10%"
                        />
                        <HeaderCheckBox
                            title="Admin"
                            name="isAdmin"
                            value={isAdmin}
                            onChange={this.handleChangeHeader}
                            width="10%"
                        />
                        <HeaderCheckBox
                            title="SpAdmin"
                            name="isSuperAdmin"
                            value={isSuperAdmin}
                            onChange={this.handleChangeHeader}
                            width="10%"
                        />
                      </tr>
                    </thead>
                    <tbody className="full-height">
                      {this.props.users.items && this.filterName(this.props.users).map((u) =>
                        <tr key={u._id}>
                          <td onClick={(event) => this.handleOnclick(event, u._id)}>{u.userName}</td>
                          <td onClick={(event) => this.handleOnclick(event, u._id)}>{u.name}</td>
                          <td onClick={(event) => this.handleOnclick(event, u._id)}>{u.opco.name}</td>
                          <td onClick={(event) => this.handleOnclick(event, u._id)}>{u.opco.region.name}</td>
                          <td data-type="checkbox">
                              <TableCheckBoxAdmin
                                  id={u._id}
                                  checked={u.isAdmin}
                                  onChange={this.handleInputChange}
                                  disabled={this.checkBoxDisabled(u,'isAdmin')}
                                  data-type="checkbox"
                              />
                          </td>
                          <td data-type="checkbox">
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
