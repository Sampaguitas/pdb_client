import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    doesMatch,
    arraySorted,
    copyObject
} from '../../../../_functions';
import HeaderCheckBox from '../../../../_components/project-table/header-check-box';
import HeaderInput from '../../../../_components/project-table/header-input';
import Input from '../../../../_components/input';
import Select from '../../../../_components/select';
import TableCheckBoxRole from '../../../../_components/project-table/table-check-box-role';
import CheckBox from '../../../../_components/check-box';
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

class General extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            project: {
                id: '',
                name: '',
                erpId: '',
                currencyId: '',
                opcoId: '',
                projectUsers: [],
                enableInspection: false,
                enableShipping: false,
                enableWarehouse: false,
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
            colsWidth: {}
        };
        this.toggleSort = this.toggleSort.bind(this);
        this.handleChangeHeader = this.handleChangeHeader.bind(this);
        this.handleIsRole = this.handleIsRole.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.filterName = this.filterName.bind(this);
        this.accessibleArray = this.accessibleArray.bind(this);
        this.handleIsRole = this.handleIsRole.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
        this.colDoubleClick = this.colDoubleClick.bind(this);
        this.setColWidth = this.setColWidth.bind(this);
    }

    componentDidMount() {
        const { users, selection, accesses, refreshProject } = this.props;
        //refreshStore
        refreshProject;

        var userArray = [];
        if (users.items && selection.project && accesses.items) {
            users.items.map(function (user) {
                var found = accesses.items.find(element => element.userId === user._id);
                if (found) {
                    let NewUserArrayElement = {
                        'userId': user._id, //result.user._id,
                        'userName': user.userName, //result.user.userName,
                        'name': user.name, // result.user.name,
                        'isExpediting': found.isExpediting,
                        'isInspection': found.isInspection,
                        'isShipping': found.isShipping,
                        'isWarehouse': found.isWarehouse,
                        'isConfiguration': found.isConfiguration
                    };
                    userArray.push(NewUserArrayElement)
                } else {
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
                    userArray.push(NewUserArrayElement)
                }
            });
            // userArray = arraySorted(userArray, 'name');
            this.setState({
                project:{
                    // ...project,
                    id: selection.project._id,
                    name: selection.project.name,
                    erpId: selection.project.erpId,
                    currencyId: selection.project.currencyId,
                    opcoId: selection.project.opcoId,
                    projectUsers: userArray,
                    enableInspection: selection.project.enableInspection || false,
                    enableShipping: selection.project.enableShipping || false,
                    enableWarehouse: selection.project.enableWarehouse || false,
                }
            });
        };
    }
    
    componentDidUpdate(prevProps, prevState) {
        const { users, selection, accesses } = this.props;
        if (prevProps.users != users || prevProps.selection != selection || prevProps.accesses != accesses) {
            var userArray = [];
            if (users.items && selection.project && accesses.items) {
                users.items.map(function (user) {
                    var found = accesses.items.find(element => element.userId === user._id);
                    if (found) {
                        let NewUserArrayElement = {
                            'userId': user._id, //result.user._id,
                            'userName': user.userName, //result.user.userName,
                            'name': user.name, // result.user.name,
                            'isExpediting': found.isExpediting,
                            'isInspection': found.isInspection,
                            'isShipping': found.isShipping,
                            'isWarehouse': found.isWarehouse,
                            'isConfiguration': found.isConfiguration
                        };
                        userArray.push(NewUserArrayElement)
                    } else {
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
                        userArray.push(NewUserArrayElement)
                    }
                });
                // userArray = arraySorted(userArray, 'name');
                this.setState({
                    project:{
                        // ...project,
                        id: selection.project._id,
                        name: selection.project.name,
                        erpId: selection.project.erpId,
                        currencyId: selection.project.currencyId,
                        opcoId: selection.project.opcoId,
                        projectUsers: userArray,
                        enableInspection: selection.project.enableInspection || false,
                        enableShipping: selection.project.enableShipping || false,
                        enableWarehouse: selection.project.enableWarehouse || false,
                    }
                });
            };
        }
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

    handleIsRole(event, role) {
        const { name } = event.target;
        const { projectUsers } = this.state.project;
        let clickedUser = projectUsers.find(x=>x.userId == name);
        clickedUser[role] = !clickedUser[role];
        this.setState(this.state);
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
        const { project } = this.state;
        const { projectUsers } = project;
        let tempArray = projectUsers;
        let found = tempArray.find(element => element.userId === name);
        found[role] = !found[role];
        this.setState({
            project: {
                ...project,
                projectUsers: tempArray
            }
        });
    }

    onKeyPress(event) {
        if (event.which === 13 /* prevent form submit on key Enter */) {
          event.preventDefault();
        }
    }

    colDoubleClick(event, index) {
        event.preventDefault();
        const { colsWidth } = this.state;
        if (colsWidth.hasOwnProperty(index)) {
            let tempArray = copyObject(colsWidth);
            delete tempArray[index];
            this.setState({ colsWidth: tempArray });
        } else {
            this.setState({
                colsWidth: {
                    ...colsWidth,
                    [index]: 0
                }
            });
        }
    }

    setColWidth(index, width) {
        const { colsWidth } = this.state;
        this.setState({
            colsWidth: {
                ...colsWidth,
                [index]: width
            }
        });
    }

    render() {

        const {
            tab,
            //Functions
            handleSubmitProject,
            handleDeleteProject,
            //Props
            currencies,
            erps,
            opcos,
            projectDeleting,
            projectUpdating,
            selection,
            users,
            //State
            submittedProject,
        } = this.props

        const {
            project,
            userName,
            name,
            isExpediting,
            isInspection,
            isShipping,
            isWarehouse,
            isConfiguration,
            sort,
            colsWidth
        } = this.state;  

        const { projectUsers } = this.state.project;
        return (
            <div className="tab-pane fade show full-height" id={tab.id} role="tabpanel">
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
                                            width ="10%"
                                            sort={sort}
                                            toggleSort={this.toggleSort}
                                            index="0"
                                            colDoubleClick={this.colDoubleClick}
                                            setColWidth={this.setColWidth}
                                            colsWidth={colsWidth}
                                        />                                            
                                        <HeaderInput
                                            type="text"
                                            title="User"
                                            name="name"
                                            value={name}
                                            onChange={this.handleChangeHeader}
                                            width ="40%"
                                            sort={sort}
                                            toggleSort={this.toggleSort}
                                            index="1"
                                            colDoubleClick={this.colDoubleClick}
                                            setColWidth={this.setColWidth}
                                            colsWidth={colsWidth}
                                        />                                             
                                        <HeaderCheckBox 
                                            title="Expediting"
                                            name="isExpediting"
                                            value={isExpediting}
                                            onChange={this.handleChangeHeader}
                                            width ="10%"
                                            sort={sort}
                                            toggleSort={this.toggleSort}
                                            index="2"
                                            colDoubleClick={this.colDoubleClick}
                                            setColWidth={this.setColWidth}
                                            colsWidth={colsWidth}
                                        />                                            
                                        <HeaderCheckBox 
                                            title="Inspection"
                                            name="isInspection"
                                            value={isInspection}
                                            onChange={this.handleChangeHeader}
                                            width ="10%"
                                            sort={sort}
                                            toggleSort={this.toggleSort}
                                            index="3"
                                            colDoubleClick={this.colDoubleClick}
                                            setColWidth={this.setColWidth}
                                            colsWidth={colsWidth}
                                        /> 
                                        <HeaderCheckBox 
                                            title="Shipping"
                                            name="isShipping"
                                            value={isShipping}
                                            onChange={this.handleChangeHeader}
                                            width ="10%"
                                            sort={sort}
                                            toggleSort={this.toggleSort}
                                            index="4"
                                            colDoubleClick={this.colDoubleClick}
                                            setColWidth={this.setColWidth}
                                            colsWidth={colsWidth}
                                        /> 
                                        <HeaderCheckBox 
                                            title="Warehouse"
                                            name="isWarehouse"
                                            value={isWarehouse}
                                            onChange={this.handleChangeHeader}
                                            width ="10%"
                                            sort={sort}
                                            toggleSort={this.toggleSort}
                                            index="5"
                                            colDoubleClick={this.colDoubleClick}
                                            setColWidth={this.setColWidth}
                                            colsWidth={colsWidth}
                                        />
                                        <HeaderCheckBox 
                                            title="Config"
                                            name="isConfiguration"
                                            value={isConfiguration}
                                            onChange={this.handleChangeHeader}
                                            width ="10%"
                                            sort={sort}
                                            toggleSort={this.toggleSort}
                                            index="6"
                                            colDoubleClick={this.colDoubleClick}
                                            setColWidth={this.setColWidth}
                                            colsWidth={colsWidth}
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
                                onSubmit={event => handleSubmitProject(event, project)}
                            >
                                <div className="col-12 justify-content-around p-0">
                                    <Input
                                        title="Name"
                                        name="name"
                                        type="text"
                                        value={project.name}
                                        onChange={this.handleChange}
                                        submittedProject={submittedProject}
                                        inline={false}
                                        required={false}
                                    />
                                    <Select
                                        title="ERP"
                                        name="erpId"
                                        options={erps.items}
                                        value={project.erpId}
                                        onChange={this.handleChange}
                                        placeholder=""
                                        submittedProject={submittedProject}
                                        inline={false}
                                        required={false}
                                    />
                                    <Select
                                        title="OPCO"
                                        name="opcoId"
                                        options={opcos.items}
                                        value={project.opcoId}
                                        onChange={this.handleChange}
                                        placeholder=""
                                        submittedProject={submittedProject}
                                        inline={false}
                                        required={false}
                                    />
                                    <Select
                                        title="Currency"
                                        name="currencyId"
                                        options={currencies.items}
                                        value={project.currencyId}
                                        onChange={this.handleChange}
                                        placeholder=""
                                        submittedProject={submittedProject}
                                        inline={false}
                                        required={false}
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
                                    {project.id &&
                                        <div className="col-12 text-right p-0">
                                            <div>
                                                <button className="btn btn-leeuwen btn-lg mr-2" onClick={event => handleDeleteProject(event, project.id)}>
                                                    <span><FontAwesomeIcon icon={projectDeleting ? "spinner" : "trash-alt"} className={projectDeleting ? "fa-pulse fa-fw fa mr-2" : "fa mr-2"}/>Delete</span>
                                                </button>
                                                <button type="submit" className="btn btn-leeuwen-blue btn-lg">
                                                    <span><FontAwesomeIcon icon={projectUpdating ? "spinner" : "edit"} className={projectUpdating ? "fa-pulse fa-fw fa mr-2" : "fa mr-2"}/>Update</span>
                                                </button>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </form> 
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export default General;
