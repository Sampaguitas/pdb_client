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

function doesMatch(search, array, type) {
    if (!search) {
        return true;
    } else if (!array && search != 'any' && search != 'false') {
        return false;
    } else {
        switch(type) {
            case 'Id':
                return _.isEqual(search, array);
            case 'String':
                search = search.replace(/([()[{*+.$^\\|?])/g, "");
                return !!array.match(new RegExp(search, "i"));
            case 'Number':
                search = String(search).replace(/([()[{*+.$^\\|?])/g, "");
                return !!String(array).match(new RegExp(search, "i"));
                //return array == Number(search);
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
            loaded: false,
        };
        
        this.handleIsRole = this.handleIsRole.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeHeader = this.handleChangeHeader.bind(this);
        this.filterName = this.filterName.bind(this);
        this.accessibleArray = this.accessibleArray.bind(this);
        this.stateReload = this.stateReload.bind(this);
        this.handleIsRole = this.handleIsRole.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
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

    handleChangeHeader(event) {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    }

    filterName(users){
        const { userName, name, isExpediting, isInspection, isShipping, isWarehouse, isConfiguration } = this.state
        if (users) {
          return arraySorted(users, 'name').filter(function (user) {
            return (doesMatch(userName, user.userName, 'String')
            && doesMatch(name, user.name, 'String') 
            && doesMatch(isExpediting, user.isExpediting, 'Boolean') 
            && doesMatch(isInspection, user.isInspection, 'Boolean')
            && doesMatch(isShipping, user.isShipping, 'Boolean')
            && doesMatch(isWarehouse, user.isWarehouse, 'Boolean')
            && doesMatch(isConfiguration, user.isConfiguration, 'Boolean'));
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

    stateReload(event){
        const { users, selection, accesses } = this.props;
        // const { accesses } = this.props.selection.project;
        const { project } = this.state;
        var userArray = []
        // var i
        if (users.items) {
            for(var i=0;i<users.items.length;i++){
                var result = _.find(accesses, { 'userId' : users.items[i]._id });
                if (result) {
                    let NewUserArrayElement = {
                        'userId': users.items[i]._id, //result.user._id,
                        'userName': users.items[i].userName, //result.user.userName,
                        'name': users.items[i].name, // result.user.name,
                        'isExpediting': result.isExpediting,
                        'isInspection': result.isInspection,
                        'isShipping': result.isShipping,
                        'isWarehouse': result.isWarehouse,
                        'isConfiguration': result.isConfiguration
                    };
                    userArray.push(NewUserArrayElement)
                } else {
                    let NewUserArrayElement = {
                        'userId': users.items[i]._id,
                        'userName': users.items[i].userName,
                        'name': users.items[i].name,
                        'isExpediting': false,
                        'isInspection': false,
                        'isShipping': false,
                        'isWarehouse': false,
                        'isConfiguration': false
                    };
                    userArray.push(NewUserArrayElement)                
                }
            };
            userArray = arraySorted(userArray, 'name')
            this.setState({
                project:{
                    // ...project,
                    id: selection.project._id,
                    name: selection.project.name,
                    erpId: selection.project.erpId,
                    currencyId: selection.project.currencyId,
                    opcoId: selection.project.opcoId,
                    projectUsers: userArray,
                },
                loaded: true,
            });
        };
    }

    handleIsRole(event, role) {
        const { name } = event.target;
        const { projectUsers } = this.state.project;
        let clickedUser = projectUsers.find(x=>x.userId == name);
        clickedUser[role] = !clickedUser[role];
        this.setState(this.state);
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
            loaded,
        } = this.state;  

        const { projectUsers } = this.state.project;
        {users.items && !loaded && selection.project && this.stateReload()}
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
                                        />                                            
                                        <HeaderInput
                                            type="text"
                                            title="User"
                                            name="name"
                                            value={name}
                                            onChange={this.handleChangeHeader}
                                            width ="40%"
                                        />                                             
                                        <HeaderCheckBox 
                                            title="Expediting"
                                            name="isExpediting"
                                            value={isExpediting}
                                            onChange={this.handleChangeHeader}
                                            width ="10%"
                                        />                                            
                                        <HeaderCheckBox 
                                            title="Inspection"
                                            name="isInspection"
                                            value={isInspection}
                                            onChange={this.handleChangeHeader}
                                            width ="10%"
                                        /> 
                                        <HeaderCheckBox 
                                            title="Shipping"
                                            name="isShipping"
                                            value={isShipping}
                                            onChange={this.handleChangeHeader}
                                            width ="10%"
                                        /> 
                                        <HeaderCheckBox 
                                            title="Warehouse"
                                            name="isWarehouse"
                                            value={isWarehouse}
                                            onChange={this.handleChangeHeader}
                                            width ="10%"
                                        />
                                        <HeaderCheckBox 
                                            title="Config"
                                            name="isConfiguration"
                                            value={isConfiguration}
                                            onChange={this.handleChangeHeader}
                                            width ="10%"
                                        />
                                    </tr>
                                </thead>
                                <tbody className="full-height">
                                    {projectUsers && this.filterName(projectUsers).map(u => (
                                        <tr key={u.userId}>
                                            <td>{u.userName}</td>
                                            <td>{u.name}</td>
                                            <TableCheckBoxRole
                                                id={u.userId}
                                                checked={u.isExpediting}
                                                onChange={(event) => {this.handleIsRole(event, 'isExpediting')}}
                                                disabled={false} //_.isEqual(u.userId, currentUser.id)
                                            />   
                                            <TableCheckBoxRole
                                                id={u.userId}
                                                checked={u.isInspection}
                                                onChange={(event) => {this.handleIsRole(event, 'isInspection')}}
                                                disabled={false} //_.isEqual(u.userId, currentUser.id)
                                            />   
                                            <TableCheckBoxRole
                                                id={u.userId}
                                                checked={u.isShipping}
                                                onChange={(event) => {this.handleIsRole(event, 'isShipping')}}
                                                disabled={false} //_.isEqual(u.userId, currentUser.id)
                                            />   
                                            <TableCheckBoxRole
                                                id={u.userId}
                                                checked={u.isWarehouse}
                                                onChange={(event) => {this.handleIsRole(event, 'isWarehouse')}}
                                                disabled={false} //_.isEqual(u.userId, currentUser.id)
                                            />
                                            <TableCheckBoxRole
                                                id={u.userId}
                                                checked={u.isConfiguration}
                                                onChange={(event) => {this.handleIsRole(event, 'isConfiguration')}}
                                                disabled={false} //_.isEqual(u.userId, currentUser.id)
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
                                                type="submit"
                                                className="btn btn-leeuwen btn-lg"
                                                onClick={(event) => { handleDeleteProject(event, project.id)}} 
                                                style={{ marginRight: 10 }}
                                            >
                                                {projectDeleting && (
                                                    <FontAwesomeIcon 
                                                        icon="spinner"
                                                        className="fa-pulse fa-1x fa-fw" 
                                                    /> 
                                                )}
                                                Delete
                                            </button>
                                            <button
                                                type="submit"
                                                className="btn btn-leeuwen-blue btn-lg"
                                                onClick={(event) => { handleSubmitProject(event, project)} }
                                            >
                                                {projectUpdating && (
                                                    <FontAwesomeIcon
                                                        icon="spinner"
                                                        className="fa-pulse fa-1x fa-fw"
                                                    />
                                                )}
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
