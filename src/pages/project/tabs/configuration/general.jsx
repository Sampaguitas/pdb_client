import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//Components
import CheckBox from '../../../../_components/check-box';
import Input from '../../../../_components/input';
import Select from '../../../../_components/select';
import TableCheckBox from '../../../../_components/table-check-box';

const _ = require('lodash');

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
        const { users, selection } = this.props;
        const { accesses } = this.props.selection.project;
        const { project } = this.state;
        var userArray = []
        var i
        if (users.items) {
            for(i=0;i<users.items.length;i++){
                var result = _.find(accesses, { 'userId' : users.items[i]._id });
                if (result) {
                    let NewUserArrayElement = {
                        'userId': result.user._id,
                        'userName': result.user.userName,
                        'name': result.user.name,
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
                    ...project,
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

    render() {

        const { 
            handleSubmitProject,
            handleDeleteProject,
            projectUpdating,
            projectDeleting,
            submittedProject,
            erps,
            opcos,
            currencies,
            selection,
            users,                  
            tab,
            // currentUser
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
                <div className="row full-height">
                    <div className="col-md-8 col-sm-12 mb-sm-3 full-height">
                        <div className="card full-height">
                            <div className="card-header">
                                <h5>Set user roles</h5>
                            </div>
                            <div className="card-body table-responsive">
                                <table className="table table-hover" >
                                    <thead>
                                        <tr>
                                            <th scope="col" style={{width: '10%'}}>Initials<br />
                                                <input className="form-control" name="userName" value={userName} onChange={this.handleChangeHeader} />
                                            </th>
                                            <th scope="col">User<br />
                                                <input className="form-control" name="name" value={name} onChange={this.handleChangeHeader} />
                                            </th>
                                            <th scope="col" style={{width: '10%'}}>Expediting<br />
                                                <select className="form-control" name="isExpediting" value={isExpediting} onChange={this.handleChangeHeader}>
                                                    <option key="1" value="1">Any</option>
                                                    <option key="2" value="2">True</option> 
                                                    <option key="3" value="3">False</option>  
                                                </select>
                                            </th>
                                            <th scope="col" style={{width: '10%'}}>Inspection<br />
                                                <select className="form-control" name="isInspection" value={isInspection} onChange={this.handleChangeHeader}>
                                                    <option key="1" value="1">Any</option>
                                                    <option key="2" value="2">True</option> 
                                                    <option key="3" value="3">False</option>  
                                                </select>
                                            </th>
                                            <th scope="col" style={{width: '10%'}}>Shipping<br />
                                                <select className="form-control" name="isShipping" value={isShipping} onChange={this.handleChangeHeader}>
                                                    <option key="1" value="1">Any</option>
                                                    <option key="2" value="2">True</option> 
                                                    <option key="3" value="3">False</option>  
                                                </select>                                                
                                            </th>
                                            <th scope="col" style={{width: '10%'}}>Warehouse<br />
                                                <select className="form-control" name="isWarehouse" value={isWarehouse} onChange={this.handleChangeHeader}>
                                                    <option key="1" value="1">Any</option>
                                                    <option key="2" value="2">True</option> 
                                                    <option key="3" value="3">False</option>  
                                                </select>
                                            </th>
                                            <th scope="col" style={{width: '10%'}}>Config<br />
                                                <select className="form-control" name="isConfiguration" value={isConfiguration} onChange={this.handleChangeHeader}>
                                                    <option key="1" value="1">Any</option>
                                                    <option key="2" value="2">True</option> 
                                                    <option key="3" value="3">False</option>  
                                                </select>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {projectUsers && this.filterName(projectUsers).map(u => (
                                            <tr key={u.userId}>
                                            <td>{u.userName}</td>
                                            <td>{u.name}</td>
                                            <td>
                                                <TableCheckBox
                                                    id={u.userId}
                                                    checked={u.isExpediting}
                                                    onChange={(event) => {this.handleIsRole(event, 'isExpediting')}}
                                                    disabled={false} //_.isEqual(u.userId, currentUser.id)
                                                />   
                                            </td>
                                            <td>
                                                <TableCheckBox
                                                    id={u.userId}
                                                    checked={u.isInspection}
                                                    onChange={(event) => {this.handleIsRole(event, 'isInspection')}}
                                                    disabled={false} //_.isEqual(u.userId, currentUser.id)
                                                />   
                                            </td>
                                            <td>
                                                <TableCheckBox
                                                    id={u.userId}
                                                    checked={u.isShipping}
                                                    onChange={(event) => {this.handleIsRole(event, 'isShipping')}}
                                                    disabled={false} //_.isEqual(u.userId, currentUser.id)
                                                />   
                                            </td>
                                            <td>
                                                <TableCheckBox
                                                    id={u.userId}
                                                    checked={u.isWarehouse}
                                                    onChange={(event) => {this.handleIsRole(event, 'isWarehouse')}}
                                                    disabled={false} //_.isEqual(u.userId, currentUser.id)
                                                />
                                            </td>
                                            <td>
                                                <TableCheckBox
                                                    id={u.userId}
                                                    checked={u.isConfiguration}
                                                    onChange={(event) => {this.handleIsRole(event, 'isConfiguration')}}
                                                    disabled={false} //_.isEqual(u.userId, currentUser.id)
                                                />
                                            </td>
                                            </tr> 
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 col-sm-12">
                        <div className="card">
                            <div className="card-header">
                                <h5>General information</h5>
                            </div>
                            <div className="card-body">
                                <form>
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
                                        <button type="submit" className="btn btn-outline-dark btn-lg" onClick={(event) => { handleDeleteProject(event, project.id)}} style={{ marginRight: 10 }} >
                                            {projectDeleting ? <FontAwesomeIcon icon="spinner" className="fa-pulse fa-1x fa-fw" /> : '' }
                                            Remove
                                        </button>
                                        <button type="submit" className="btn btn-lg btn-outline-leeuwen" onClick={(event) => { handleSubmitProject(event, project)} }>
                                        {projectUpdating ? <FontAwesomeIcon icon="spinner" className="fa-pulse fa-1x fa-fw" /> : ''}
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
            </div>
        );
    }
}

export default General;
