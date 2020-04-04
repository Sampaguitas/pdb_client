import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//Components
import HeaderCheckBox from '../../../../_components/project-table/header-check-box';
import HeaderInput from '../../../../_components/project-table/header-input';
import Input from '../../../../_components/input';
import Select from '../../../../_components/select';
import TableCheckBoxRole from '../../../../_components/project-table/table-check-box-role';


const _ = require('lodash');

function resolve(path, obj) {
    return path.split('.').reduce(function(prev, curr) {
        return prev ? prev[curr] : null
    }, obj || self)
}

function arraySorted(array, field) {
    if (array) {
        const newArray = array
        newArray.sort(function(a,b){
            if (resolve(field, a) < resolve(field, b)) {
                return -1;
            } else if ((resolve(field, a) > resolve(field, b))) {
                return 1;
            } else {
                return 0;
            }
        });
        return newArray;             
    }
}

function projectSorted(array, sort) {
    let tempArray = array.slice(0);
    switch(sort.name) {
        case 'userName':
        case 'name':
            if (sort.isAscending) {
                return tempArray.sort(function (a, b) {
                    let nameA = a[sort.name].toUpperCase();
                    let nameB = b[sort.name].toUpperCase();
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
                    let nameA = a[sort.name].toUpperCase();
                    let nameB = b[sort.name].toUpperCase();
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

function doesMatch(search, array, type, isEqual) {
    if (!search) {
        return true;
    } else if (!array && search != 'any' && search != 'false') {
        return false;
    } else {
      switch(type) {
        case 'Id':
            return _.isEqual(search, array);
        case 'String':
            if(isEqual) {
                return _.isEqual(array.toUpperCase(), search.toUpperCase());
            } else {
                return array.toUpperCase().includes(search.toUpperCase());
            }
        case 'Date':
            if (isEqual) {
                return _.isEqual(TypeToString(array, 'date', getDateFormat(myLocale)), search);
            } else {
                return TypeToString(array, 'date', getDateFormat(myLocale)).includes(search);
            }
        case 'Number':
            if (isEqual) {
                return _.isEqual( Intl.NumberFormat().format(array).toString(), Intl.NumberFormat().format(search).toString());
            } else {
                return Intl.NumberFormat().format(array).toString().includes(Intl.NumberFormat().format(search).toString());
            }
        case 'Boolean':
            if(search == 'any') {
                return true; //any or equal
            } else if (search == 'true' && !!array) {
                return true; //true
            } else if (search == 'false' && !array) {
                return true; //true
            } else {
                return false;
            }
        case 'Select':
            if(search == 'any' || _.isEqual(search, array)) {
                return true; //any or equal
            } else {
                return false;
            }
        default: return true;
      }
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
                projectUsers: []
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
        };
        this.toggleSort = this.toggleSort.bind(this);
        this.handleChangeHeader = this.handleChangeHeader.bind(this);
        this.handleIsRole = this.handleIsRole.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.filterName = this.filterName.bind(this);
        this.accessibleArray = this.accessibleArray.bind(this);
        this.handleIsRole = this.handleIsRole.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
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
                }
            });
        };
    }
    
    componentDidUpdate(prevProp, prevState) {
        const { users, selection, accesses } = this.props;
        if (prevProp.users != users || prevProp.selection != selection || prevProp.accesses != accesses) {
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
          return projectSorted(array, sort).filter(function (object) {
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
            sort
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
                                        />                                             
                                        <HeaderCheckBox 
                                            title="Expediting"
                                            name="isExpediting"
                                            value={isExpediting}
                                            onChange={this.handleChangeHeader}
                                            width ="10%"
                                            sort={sort}
                                            toggleSort={this.toggleSort}
                                        />                                            
                                        <HeaderCheckBox 
                                            title="Inspection"
                                            name="isInspection"
                                            value={isInspection}
                                            onChange={this.handleChangeHeader}
                                            width ="10%"
                                            sort={sort}
                                            toggleSort={this.toggleSort}
                                        /> 
                                        <HeaderCheckBox 
                                            title="Shipping"
                                            name="isShipping"
                                            value={isShipping}
                                            onChange={this.handleChangeHeader}
                                            width ="10%"
                                            sort={sort}
                                            toggleSort={this.toggleSort}
                                        /> 
                                        <HeaderCheckBox 
                                            title="Warehouse"
                                            name="isWarehouse"
                                            value={isWarehouse}
                                            onChange={this.handleChangeHeader}
                                            width ="10%"
                                            sort={sort}
                                            toggleSort={this.toggleSort}
                                        />
                                        <HeaderCheckBox 
                                            title="Config"
                                            name="isConfiguration"
                                            value={isConfiguration}
                                            onChange={this.handleChangeHeader}
                                            width ="10%"
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
                <div className="col-md-4 col-sm-12 pl-md-3 p-sm-0">
                    <div className="card">
                        <div className="card-header">
                            <h5>General information</h5>
                        </div>
                        <div className="card-body">
                            <form
                                onKeyPress={this.onKeyPress}
                            >
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
                                <div className="text-right">
                                    {project.id &&
                                        <div>
                                            <button
                                                className="btn btn-leeuwen btn-lg mr-2"
                                                onClick={(event) => { handleDeleteProject(event, project.id)}} 
                                            >
                                                {projectDeleting ?
                                                    <FontAwesomeIcon icon="spinner" className="fa-pulse fa-1x fa-fw mr-2"/>
                                                    : 
                                                    <FontAwesomeIcon icon="trash-alt" className="fa-lg mr-2"/>
                                                }
                                                Delete
                                            </button>
                                            <button
                                                className="btn btn-leeuwen-blue btn-lg"
                                                onClick={(event) => { handleSubmitProject(event, project)} }
                                            >
                                                {projectUpdating ?
                                                    <FontAwesomeIcon icon="spinner" className="fa-pulse fa-1x fa-fw mr-2"/>
                                                :
                                                    <FontAwesomeIcon icon="edit" className="fa-lg mr-2"/>
                                                }
                                                Update
                                            </button>
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
