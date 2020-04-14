import React from "react";
import { NavLink } from 'react-router-dom';
import { connect } from "react-redux";
import { 
  accessActions,
  collitypeActions,
  docdefActions,
  docfieldActions,
  fieldActions,
  fieldnameActions,
  opcoActions,
  poActions,
  projectActions, 
  supplierActions, 
  userActions 
} from "../../_actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TableCheckBoxAdmin from "../../_components/project-table/table-check-box-admin";
import TableCheckBoxSuperAdmin from "../../_components/project-table/table-check-box-spadmin";
import Modal from "../../_components/modal";
import Input from "../../_components/input";
import Select from '../../_components/select';
import Layout from "../../_components/layout";
import HeaderInput from '../../_components/project-table/header-input';
import HeaderCheckBox from '../../_components/project-table/header-check-box';
import moment from 'moment';
import _ from 'lodash';

const locale = Intl.DateTimeFormat().resolvedOptions().locale;
const options = Intl.DateTimeFormat(locale, {'year': 'numeric', 'month': '2-digit', day: '2-digit'})
const myLocale = Intl.DateTimeFormat(locale, options);

function getDateFormat(myLocale) {
    let tempDateFormat = ''
    myLocale.formatToParts().map(function (element) {
        switch(element.type) {
            case 'month': 
                tempDateFormat = tempDateFormat + 'MM';
                break;
            case 'literal': 
                tempDateFormat = tempDateFormat + element.value;
                break;
            case 'day': 
                tempDateFormat = tempDateFormat + 'DD';
                break;
            case 'year': 
                tempDateFormat = tempDateFormat + 'YYYY';
                break;
        }
    });
    return tempDateFormat;
}

function TypeToString (fieldValue, fieldType, myDateFormat) {
    if (fieldValue) {
        switch (fieldType) {
            case 'date': return String(moment(fieldValue).format(myDateFormat)); 
            default: return fieldValue;
        }
    } else {
        return '';
    }
}

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

function settingSorted(array, sort) {
  let tempArray = array.slice(0);
  switch(sort.name) {
    case 'userName':
    case 'name':
        if (sort.isAscending) {
            return tempArray.sort(function (a, b) {
                let nameA = !_.isUndefined(a[sort.name]) && !_.isNull(a[sort.name]) ? String(a[sort.name]).toUpperCase() : '';
                let nameB = !_.isUndefined(b[sort.name]) && !_.isNull(b[sort.name]) ? String(b[sort.name]).toUpperCase() : '';
                if (nameA < nameB) {
                    return -1;
                } else if (nameA > nameB) {
                    return 1;
                } else {
                    return 0;
                }
            });
        } else {
            return tempArray.sort(function (a, b) {
              let nameA = !_.isUndefined(a[sort.name]) && !_.isNull(a[sort.name]) ? String(a[sort.name]).toUpperCase() : '';
              let nameB = !_.isUndefined(b[sort.name]) && !_.isNull(b[sort.name]) ? String(b[sort.name]).toUpperCase() : '';
                if (nameA > nameB) {
                    return -1;
                } else if (nameA < nameB) {
                    return 1;
                } else {
                    return 0;
                }
            });
        }
    case 'opco':
      if (sort.isAscending) {
        return tempArray.sort(function (a, b) {
            let nameA = !_.isUndefined(a.opco.name) && !_.isNull(a.opco.name) ? String(a.opco.name).toUpperCase() : '';
            let nameB = !_.isUndefined(b.opco.name) && !_.isNull(b.opco.name) ? String(b.opco.name).toUpperCase() : '';
            if (nameA < nameB) {
                return -1;
            } else if (nameA > nameB) {
                return 1;
            } else {
                return 0;
            }
        });
      } else {
          return tempArray.sort(function (a, b) {
            let nameA = !_.isUndefined(a.opco.name) && !_.isNull(a.opco.name) ? String(a.opco.name).toUpperCase() : '';
            let nameB = !_.isUndefined(b.opco.name) && !_.isNull(b.opco.name) ? String(b.opco.name).toUpperCase() : '';
            if (nameA > nameB) {
                return -1;
            } else if (nameA < nameB) {
                return 1;
            } else {
                return 0;
            }
          });
      }
    case 'region':
      if (sort.isAscending) {
        return tempArray.sort(function (a, b) {
            let nameA = !_.isUndefined(a.opco.region.name) && !_.isNull(a.opco.region.name) ? String(a.opco.region.name).toUpperCase() : '';
            let nameB = !_.isUndefined(b.opco.region.name) && !_.isNull(b.opco.region.name) ? String(b.opco.region.name).toUpperCase() : '';
            if (nameA < nameB) {
                return -1;
            } else if (nameA > nameB) {
                return 1;
            } else {
                return 0;
            }
        });
      } else {
          return tempArray.sort(function (a, b) {
            let nameA = !_.isUndefined(a.opco.region.name) && !_.isNull(a.opco.region.name) ? String(a.opco.region.name).toUpperCase() : '';
            let nameB = !_.isUndefined(b.opco.region.name) && !_.isNull(b.opco.region.name) ? String(b.opco.region.name).toUpperCase() : '';
            if (nameA > nameB) {
                return -1;
            } else if (nameA < nameB) {
                return 1;
            } else {
                return 0;
            }
          });
      }
    case 'isAdmin':
    case 'isSuperAdmin':
        if (sort.isAscending) {
            return tempArray.sort(function (a, b) {
                let nameA = a[sort.name];
                let nameB = b[sort.name];
                if (nameA === nameB) {
                    return 0;
                } else if (!!nameA) {
                    return 1;
                } else {
                    return -1;
                }
            });
        } else {
            return tempArray.sort(function (a, b) {
                let nameA = a[sort.name];
                let nameB = b[sort.name];
                if (nameA === nameB) {
                    return 0;
                } else if (!!nameA) {
                    return -1;
                } else {
                    return 1;
                }
            });
        }
    default: return array; 
  }
}

function doesMatch(search, value, type, isEqual) {
    
  if (!search) {
      return true;
  } else if (!value && search != 'any' && search != 'false' && search != '-1' && String(search).toUpperCase() != '=BLANK') {
      return false;
  } else {
      switch(type) {
          case 'Id':
              return _.isEqual(search, value);
          case 'String':
              if (String(search).toUpperCase() === '=BLANK') {
                  return !value;
              } else if (String(search).toUpperCase() === '=NOTBLANK') {
                  return !!value;
              } else if (isEqual) {
                  return _.isEqual(String(value).toUpperCase(), String(search).toUpperCase());
              } else {
                  return String(value).toUpperCase().includes(String(search).toUpperCase());
              }
          case 'Date':
              if (String(search).toUpperCase() === '=BLANK') {
                  return !value;
              } else if (String(search).toUpperCase() === '=NOTBLANK') {
                  return !!value;
              } else if (isEqual) {
                  return _.isEqual(TypeToString(value, 'date', getDateFormat(myLocale)), search);
              } else {
                  return TypeToString(value, 'date', getDateFormat(myLocale)).includes(search);
              }
          case 'Number':
              if (search === '-1') {
                  return !value;
              } else if (search === '-2') {
                  return !!value;
              } else if (isEqual) {
                  return _.isEqual( Intl.NumberFormat().format(value).toString(), Intl.NumberFormat().format(search).toString());
              } else {
                  return Intl.NumberFormat().format(value).toString().includes(Intl.NumberFormat().format(search).toString());
              }
          case 'Boolean':
              if(search == 'any') {
                  return true; //any or equal
              } else if (search == 'true' && !!value) {
                  return true; //true
              } else if (search == 'false' && !value) {
                  return true; //true
              }else {
                  return false;
              }
          case 'Select':
              if(search == 'any' || _.isEqual(search, value)) {
                  return true; //any or equal
              } else {
                  return false;
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
      userName: '',
      name: '',
      opco: '',
      region: '',
      isAdmin: 0,
      isSuperAdmin: 0,
      sort: {
        name: '',
        isAscending: true,
      },
      loaded: false,
      submitted: false,
      show: false
      
    };
    this.handleClearAlert = this.handleClearAlert.bind(this);
    this.toggleSort = this.toggleSort.bind(this);
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
    dispatch(collitypeActions.clear());
    dispatch(docdefActions.clear());
    dispatch(docfieldActions.clear());
    dispatch(fieldActions.clear());
    dispatch(fieldnameActions.clear());
    dispatch(poActions.clear());
    dispatch(projectActions.clearSelection());
    dispatch(supplierActions.clear());
    //Get users and opcos
    dispatch(userActions.getAll());
    dispatch(opcoActions.getAll());
  }

  handleClearAlert(event){
    event.preventDefault;
    const { dispatch } = this.props;
    dispatch(alertActions.clear());
  }

  toggleSort(event, name) {
    event.preventDefault();
    const { sort } = this.state;
    if (sort.name != name) {
        this.setState({
            sort: {
                name: name,
                isAscending: true
            }
        });
    } else if (!!sort.isAscending) {
        this.setState({
            sort: {
                name: name,
                isAscending: false
            }
        });
    } else {
        this.setState({
            sort: {
                name: '',
                isAscending: true
            }
        });
    }
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

  filterName(array){
    const { userName, name, opco, region, isAdmin, isSuperAdmin, sort } = this.state
    if (array) {
      return settingSorted(array, sort).filter(function (object) {
        return (doesMatch(userName, object.userName, 'String', false) 
        && doesMatch(name, object.name, 'String', false) 
        && doesMatch(opco, object.opco.name, 'String', false)
        && doesMatch(region, object.opco.region.name, 'String', false)
        && doesMatch(isAdmin, object.isAdmin, 'Boolean', false)
        && doesMatch(isSuperAdmin, object.isSuperAdmin, 'Boolean', false));
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
    const { user, userName, name, opco, region, isAdmin, isSuperAdmin, sort, submitted } = this.state;
    const { users, registering, userUpdating, userDeleting, alert, opcos } = this.props;

    return (
      <Layout alert={alert}>
        {alert.message && 
          <div className={`alert ${alert.type}`}>{alert.message}
            <button className="close" onClick={(event) => this.handleClearAlert(event)}>
              <span aria-hidden="true"><FontAwesomeIcon icon="times"/></span>
            </button>
          </div>
        }
        <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
                <li className="breadcrumb-item">
                    <NavLink to={{ pathname: '/' }} tag="a">Home</NavLink>
                </li>
                <li className="breadcrumb-item active" aria-current="page">Settings</li>
            </ol>
        </nav>
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
                            sort={sort}
                            toggleSort={this.toggleSort} 
                        />
                        <HeaderInput
                            type="text"
                            title="Name"
                            name="name"
                            value={name}
                            onChange={this.handleChangeHeader}
                            width="30%"
                            sort={sort}
                            toggleSort={this.toggleSort} 
                        />
                        <HeaderInput
                            type="text"
                            title="Operating Company"
                            name="opco"
                            value={opco}
                            onChange={this.handleChangeHeader}
                            width="30%"
                            sort={sort}
                            toggleSort={this.toggleSort} 
                        />
                        <HeaderInput
                            type="text"
                            title="Region"
                            name="region"
                            value={region}
                            onChange={this.handleChangeHeader}
                            width="10%"
                            sort={sort}
                            toggleSort={this.toggleSort} 
                        />
                        <HeaderCheckBox
                            title="Admin"
                            name="isAdmin"
                            value={isAdmin}
                            onChange={this.handleChangeHeader}
                            width="10%"
                            sort={sort}
                            toggleSort={this.toggleSort} 
                        />
                        <HeaderCheckBox
                            title="SpAdmin"
                            name="isSuperAdmin"
                            value={isSuperAdmin}
                            onChange={this.handleChangeHeader}
                            width="10%"
                            sort={sort}
                            toggleSort={this.toggleSort} 
                        />
                      </tr>
                    </thead>
                    <tbody className="full-height">
                      {users.items && this.filterName(users.items).map((u) =>
                        <tr key={u._id}>
                          <td className="no-select" onClick={(event) => this.handleOnclick(event, u._id)}>{u.userName}</td>
                          <td className="no-select" onClick={(event) => this.handleOnclick(event, u._id)}>{u.name}</td>
                          <td className="no-select" onClick={(event) => this.handleOnclick(event, u._id)}>{u.opco.name}</td>
                          <td className="no-select" onClick={(event) => this.handleOnclick(event, u._id)}>{u.opco.region.name}</td>
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
                                        className="btn btn-leeuwen btn-lg"
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
                                        className="btn btn-leeuwen-blue btn-lg"
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
                                className="btn btn-leeuwen-blue btn-lg btn-full"
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
