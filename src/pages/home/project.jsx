import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { history } from '../../_helpers';
import { 
    alertActions,
    accessActions,
    collitypeActions,
    currencyActions,
    docdefActions,
    docfieldActions,
    erpActions,
    fieldActions,
    fieldnameActions,
    opcoActions,
    poActions,
    projectActions,
    sidemenuActions,
    supplierActions,
    userActions 
} from '../../_actions';
import { arraySorted, doesMatch, copyObject, isAdmin } from '../../_functions';
import HeaderCheckBox from '../../_components/project-table/header-check-box';
import HeaderInput from '../../_components/project-table/header-input';
import TableCheckBoxRole from '../../_components/project-table/table-check-box-role';
import { CheckBox, Input, Layout, Select } from '../../_components';
import _ from 'lodash';

function userSorted(array, sort) {
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
        case 'isExpediting':
        case 'isInspection':
        case 'isShipping':
        case 'isWarehouse':
        case 'isConfiguration':
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

class Project extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            project: {
                copyId: '5cc98cf8ab2a306e44a8fe90',
                name: '',
                erpId: '',
                currencyId: '',
                opcoId:'',
                projectUsers: [],
                enableInspection: false,
                enableShipping: false,
                enableWarehouse: false
            },
            userName: '',
            name: '',
            isExpediting: '',
            isInspection: '',
            isShipping: '',
            isWarehouse: '',
            isConfiguration: '',
            sort: {
                name: '',
                isAscending: true,
            },
            submitted: false,
            menuItem: 'Add project',
            settingsColWidth: {}
        };
        this.handleClearAlert = this.handleClearAlert.bind(this);
        this.toggleSort = this.toggleSort.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeHeader = this.handleChangeHeader.bind(this);
        this.filterName = this.filterName.bind(this);
        this.handleIsRole = this.handleIsRole.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this);
        this.accessibleArray = this.accessibleArray.bind(this);
        this.gotoPage = this.gotoPage.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
        this.toggleCollapse = this.toggleCollapse.bind(this);
        this.colDoubleClick = this.colDoubleClick.bind(this);
        this.setColWidth = this.setColWidth.bind(this);
    }
    componentDidMount() {
        const { dispatch, users } = this.props;
        const { project, menuItem } = this.state;
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
        //Get currencies, erps, opcos, projects, users
        dispatch(currencyActions.getAll());
        dispatch(erpActions.getAll());
        dispatch(opcoActions.getAll());
        dispatch(projectActions.getAll());
        dispatch(userActions.getAll());
        dispatch(sidemenuActions.select(menuItem));

        var userArray = []
        if (users.items) {
            users.items.map(function (user) {
                let NewUserArrayElement = {
                    'userId': user._id,
                    'userName': user.userName,
                    'name': user.name,
                    'isExpediting': false,
                    'isInspection': false,
                    'isShipping': false,
                    'isWarehouse': false,
                    'isConfiguration': false
                };
                userArray.push(NewUserArrayElement);
            });
            userArray = arraySorted(userArray, 'name')
            this.setState({
                project:{
                    ...project,
                    projectUsers: userArray,
                }
            });
        }
    }

    componentDidUpdate(prevProp, prevState) {
        const { users } = this.props;
        const { project } = this.state;
        var userArray = []
        if (prevProp.users != users && users.items) {
            users.items.map(function (user) {
                let NewUserArrayElement = {
                    'userId': user._id,
                    'userName': user.userName,
                    'name': user.name,
                    'isExpediting': false,
                    'isInspection': false,
                    'isShipping': false,
                    'isWarehouse': false,
                    'isConfiguration': false
                };
                userArray.push(NewUserArrayElement);
            });
            userArray = arraySorted(userArray, 'name')
            this.setState({
                project:{
                    ...project,
                    projectUsers: userArray,
                }
            });
        }
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

    handleChangeHeader(event) {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    }

    handleChange(event) {
        const { project } = this.state;
        const target = event.target;
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({
            project: {
                ...project,
                [name]: value
            }
        });
    }

    

    filterName(array){
        const { userName, name, isExpediting, isInspection, isShipping, isWarehouse, isConfiguration, sort } = this.state
        if (array) {
          return userSorted(array, sort).filter(function (object) {
            return (doesMatch(userName, object.userName, 'String', false)
            && doesMatch(name, object.name, 'String', false) 
            && doesMatch(isExpediting, object.isExpediting, 'Boolean', false) 
            && doesMatch(isInspection, object.isInspection, 'Boolean', false)
            && doesMatch(isShipping, object.isShipping, 'Boolean', false)
            && doesMatch(isWarehouse, object.isWarehouse, 'Boolean', false)
            && doesMatch(isConfiguration, object.isConfiguration, 'Boolean', false));
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

    handleIsRole(event, role) {
        const { name } = event.target;
        const { projectUsers } = this.state.project;
        let clickedUser = projectUsers.find(x=>x.userId == name);
        clickedUser[role] = !clickedUser[role];
        this.setState(this.state);
    }

    handleSubmit(event) {
        event.preventDefault();
        
        this.setState({ submitted: true });
        const { project } = this.state;
        const { dispatch } = this.props;
        if (
            project.copyId &&
            project.name &&
            project.erpId &&
            project.currencyId &&
            project.opcoId
        ) {
            dispatch(projectActions.create(project));
        }
    }
    
    gotoPage(event, page) {
        event.preventDefault();
        history.push({pathname: page});
    }

    onKeyPress(event) {
        if (event.which === 13 /* prevent form submit on key Enter */) {
          event.preventDefault();
        }
    }

    toggleCollapse() {
        const { dispatch } = this.props;
        dispatch(sidemenuActions.toggle());
    }

    colDoubleClick(event, index) {
        event.preventDefault();
        const { settingsColWidth } = this.state;
        if (settingsColWidth.hasOwnProperty(index)) {
            let tempArray = copyObject(settingsColWidth);
            delete tempArray[index];
            this.setState({ settingsColWidth: tempArray });
        } else {
            this.setState({
                settingsColWidth: {
                    ...settingsColWidth,
                    [index]: 10
                }
            });
        }
    }

    setColWidth(index, width) {
        const { settingsColWidth } = this.state;
        this.setState({
            settingsColWidth: {
                ...settingsColWidth,
                [index]: width
            }
        });
    }

    render() {
        const { alert, currencies, erps, projectCreating, opcos, projects, sidemenu, users } = this.props;
        const { menuItem, project, userName, name, isExpediting, isInspection, isShipping, isWarehouse, isConfiguration, sort, submitted, settingsColWidth } = this.state; //loaded
        const { projectUsers } = this.state.project;
        return (
            <Layout sidemenu={sidemenu} toggleCollapse={this.toggleCollapse} menuItem={menuItem}>
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
                        <li className="breadcrumb-item active" aria-current="page">Add project</li>
                    </ol>
                </nav>
                <div id="project" className={alert.message ? "main-section-alert" : "main-section"}>
                    <div className="col-md-8 mb-md-0 col-sm-12 mb-sm-3 full-height">
                        <div className="row full-height" style={{borderStyle: 'solid', borderWidth: '1px', borderColor: '#ddd'}}>
                            <div className="table-responsive custom-table-container">
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
                                                index="0"
                                                colDoubleClick={this.colDoubleClick}
                                                setColWidth={this.setColWidth}
                                                settingsColWidth={settingsColWidth}
                                            />
                                            <HeaderInput
                                                type="text"
                                                title="User"
                                                name="name"
                                                value={name}
                                                onChange={this.handleChangeHeader}
                                                width="40%"
                                                sort={sort}
                                                toggleSort={this.toggleSort}
                                                index="1"
                                                colDoubleClick={this.colDoubleClick}
                                                setColWidth={this.setColWidth}
                                                settingsColWidth={settingsColWidth}
                                            />
                                            <HeaderCheckBox
                                                title="Expediting"
                                                name="isExpediting"
                                                value={isExpediting}
                                                onChange={this.handleChangeHeader}
                                                width="10%"
                                                sort={sort}
                                                toggleSort={this.toggleSort}
                                                index="2"
                                            />
                                            <HeaderCheckBox
                                                title="Inspection"
                                                name="isInspection"
                                                value={isInspection}
                                                onChange={this.handleChangeHeader}
                                                width="10%"
                                                sort={sort}
                                                toggleSort={this.toggleSort}
                                            />
                                            <HeaderCheckBox
                                                title="Shipping"
                                                name="isShipping"
                                                value={isShipping}
                                                onChange={this.handleChangeHeader}
                                                width="10%"
                                                sort={sort}
                                                toggleSort={this.toggleSort}
                                            />
                                            <HeaderCheckBox
                                                title="Warehouse"
                                                name="isWarehouse"
                                                value={isWarehouse}
                                                onChange={this.handleChangeHeader}
                                                width="10%"
                                                sort={sort}
                                                toggleSort={this.toggleSort}
                                            />
                                            <HeaderCheckBox
                                                title="Config"
                                                name="isConfiguration"
                                                value={isConfiguration}
                                                onChange={this.handleChangeHeader}
                                                width="10%"
                                                sort={sort}
                                                toggleSort={this.toggleSort}
                                            />
                                        </tr>
                                    </thead>
                                    <tbody className="full-height">
                                        {projectUsers && this.filterName(projectUsers).map(u => (
                                            <tr key={u.userId}>
                                                <td className="no-select">{u.userName}</td>
                                                <td className="no-select">{u.name}</td>
                                                <TableCheckBoxRole
                                                    id={u.userId}
                                                    checked={u.isExpediting}
                                                    onChange={(event) => {this.handleIsRole(event, 'isExpediting')}}
                                                    disabled={false}
                                                    
                                                />   
                                                <TableCheckBoxRole
                                                    id={u.userId}
                                                    checked={u.isInspection}
                                                    onChange={(event) => {this.handleIsRole(event, 'isInspection')}}
                                                    disabled={false}
                                                />   
                                                <TableCheckBoxRole
                                                    id={u.userId}
                                                    checked={u.isShipping}
                                                    onChange={(event) => {this.handleIsRole(event, 'isShipping')}}
                                                    disabled={false}
                                                />   
                                                <TableCheckBoxRole
                                                    id={u.userId}
                                                    checked={u.isWarehouse}
                                                    onChange={(event) => {this.handleIsRole(event, 'isWarehouse')}}
                                                    disabled={false}
                                                />
                                                <TableCheckBoxRole
                                                    id={u.userId}
                                                    checked={u.isConfiguration}
                                                    onChange={(event) => {this.handleIsRole(event, 'isConfiguration')}}
                                                    disabled={false}
                                                />
                                            </tr> 
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 col-sm-12 pl-md-3 p-sm-0 full-height">
                        <div className="card" style={{maxHeight: '100%'}}>
                            <div className="card-header">
                                <h5>General information</h5>
                            </div>
                            <div className="card-body" style={{maxHeight: 'calc(100% - 20px)', overflowY: 'auto'}}>
                                <form
                                    className="row m-0"
                                    onKeyPress={this.onKeyPress}
                                    onSubmit={this.handleSubmit}
                                >
                                    <div className="col-12 justify-content-around p-0">
                                        <Select
                                            title="Copy settings from project"
                                            name="copyId"
                                            options={arraySorted(projects.items, 'name')}
                                            value={project.copyId}
                                            onChange={this.handleChange}
                                            placeholder=""
                                            submitted={submitted}
                                            inline={false}
                                            required={true}
                                        />
                                        <Input
                                            title="Name"
                                            name="name"
                                            type="text"
                                            value={project.name}
                                            onChange={this.handleChange}
                                            submitted={submitted}
                                            inline={false}
                                            required={true}
                                        />
                                        <Select
                                            title="ERP"
                                            name="erpId"
                                            options={arraySorted(erps.items, 'name')}
                                            value={project.erpId}
                                            onChange={this.handleChange}
                                            placeholder=""
                                            submitted={submitted}
                                            inline={false}
                                            required={true}
                                        />
                                        <Select
                                            title="OPCO"
                                            name="opcoId"
                                            options={this.accessibleArray(opcos.items, 'name')}
                                            value={project.opcoId}
                                            onChange={this.handleChange}
                                            placeholder=""
                                            submitted={submitted}
                                            inline={false}
                                            required={true}
                                        />
                                        <Select
                                            title="Currency"
                                            name="currencyId"
                                            options={arraySorted(currencies.items, 'name')}
                                            value={project.currencyId}
                                            onChange={this.handleChange}
                                            placeholder=""
                                            submitted={submitted}
                                            inline={false}
                                            required={true}
                                        />
                                        <CheckBox 
                                            title="Enable Inspection Module"
                                            name="enableInspection"
                                            checked={project.enableInspection}
                                            onChange={this.handleChange}
                                        />
                                        <CheckBox 
                                            title="Enable Shipping Module"
                                            name="enableShipping"
                                            checked={project.enableShipping}
                                            onChange={this.handleChange}
                                        />
                                        <CheckBox 
                                            title="Enable Warehouse Module"
                                            name="enableWarehouse"
                                            checked={project.enableWarehouse}
                                            onChange={this.handleChange}
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-leeuwen-blue btn-full btn-lg" disabled={isAdmin() ? false : true}>
                                        <span><FontAwesomeIcon icon={projectCreating ? "spinner" : "plus"} className={projectCreating ? "fa-pulse fa-fw fa mr-2" : "fa mr-2"}/>Create</span>
                                    </button>
                                </form>                                
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }
}

function mapStateToProps(state) {
    const { alert, currencies, erps, opcos, projects, sidemenu, users } = state;
    const { projectCreating } = state.projects;
    return {
        alert,
        currencies,
        erps,
        projectCreating,
        opcos,
        projects,
        sidemenu,
        users
    };
}

const connectedProject = connect(mapStateToProps)(Project);
export { connectedProject as Project };