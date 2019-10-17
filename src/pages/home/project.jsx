import React from 'react';
import { connect } from 'react-redux';
import { currencyActions, erpActions, opcoActions, projectActions, userActions } from '../../_actions';
import { history } from '../../_helpers';
import CheckBox from '../../_components/check-box';
import TableCheckBoxRole from '../../_components/project-table/table-check-box-role';
import Input from '../../_components/input';
import Select from '../../_components/select';
import Layout from '../../_components/layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import HeaderInput from '../../_components/project-table/header-input';
import HeaderCheckBox from '../../_components/project-table/header-check-box';

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
            },
            userName: '',
            name: '',
            isExpediting: '',
            isInspection: '',
            isShipping: '',
            isWarehouse: '',
            isConfiguration: '',
            loaded: false,
            submitted: false
        };
        // this.getScrollWidthY = this.getScrollWidthY.bind(this);
        // this.getTblBound = this.getTblBound.bind(this);
        this.handleChangeProject = this.handleChangeProject.bind(this);
        this.handleChangeHeader = this.handleChangeHeader.bind(this);
        this.filterName = this.filterName.bind(this);
        this.stateReload = this.stateReload.bind(this);
        this.handleIsRole = this.handleIsRole.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this);
        this.accessibleArray = this.accessibleArray.bind(this);
        this.gotoPage = this.gotoPage.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
    }
    componentDidMount() {
        const { dispatch, projects } = this.props;
        const { options } = this.state;
        dispatch(currencyActions.getAll());
        dispatch(erpActions.getAll());
        dispatch(opcoActions.getAll());
        dispatch(projectActions.getAll());
        dispatch(userActions.getAll());
    }

    // getTblBound() {
    //     const tblContainer = document.getElementById("tblProjectContainer");
    //     if (!tblContainer) {
    //         return {};
    //     }
    //     const rect = tblContainer.getBoundingClientRect();
    //     return {
    //         left: rect.left,
    //         top: rect.top + window.scrollY,
    //         width: rect.width || rect.right - rect.left,
    //         height: rect.height || rect.bottom - rect.top
    //     };
    // }    

    // getScrollWidthY() {
    //     var scroll = document.getElementById("tblProjectBody");
    //     if (!scroll) {
    //         return 0;
    //     } else {
    //         if(scroll.clientHeight == scroll.scrollHeight){
    //             return 0;
    //         } else {
    //             return 15;
    //         }
    //     }
    // }    

    handleChangeProject(event) {
        const { project } = this.state;
        const { name, value } = event.target;
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
        const { users } = this.props;
        const { project } = this.state;
        var userArray = []
        var i
        if (users.items) {
            for(i=0;i<users.items.length;i++){
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
            };
            userArray = arraySorted(userArray, 'name')
            this.setState({
                project:{
                    ...project,
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

    render() {
        const { alert, currencies, erps, projectCreating, opcos, projects, users } = this.props;
        const { project, userName, name, isExpediting, isInspection, isShipping, isWarehouse, isConfiguration, loaded, submitted } = this.state;
        const { projectUsers } = this.state.project;
        // const tblBound = this.getTblBound();
        // const tblScrollWidth = this.getScrollWidthY();
        // let user = JSON.parse(localStorage.getItem('user'));
        {users.items && loaded === false && this.stateReload()}
        return (
            <Layout alert={this.props.alert}>
                {alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div>}
                {/* <div id="setting" className="full-height"> */}
                    <h2>Add project</h2>
                    <hr />
                    <div id="project" className="full-height">
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
                                                />
                                                <HeaderInput
                                                    type="text"
                                                    title="User"
                                                    name="name"
                                                    value={name}
                                                    onChange={this.handleChangeHeader}
                                                    width="40%" 
                                                />
                                                <HeaderCheckBox
                                                    title="Expediting"
                                                    name="isExpediting"
                                                    value={isExpediting}
                                                    onChange={this.handleChangeHeader}
                                                    width="10%"
                                                />
                                                <HeaderCheckBox
                                                    title="Inspection"
                                                    name="isInspection"
                                                    value={isInspection}
                                                    onChange={this.handleChangeHeader}
                                                    width="10%"
                                                />
                                                <HeaderCheckBox
                                                    title="Shipping"
                                                    name="isShipping"
                                                    value={isShipping}
                                                    onChange={this.handleChangeHeader}
                                                    width="10%"
                                                />
                                                <HeaderCheckBox
                                                    title="Warehouse"
                                                    name="isWarehouse"
                                                    value={isWarehouse}
                                                    onChange={this.handleChangeHeader}
                                                    width="10%"
                                                />
                                                <HeaderCheckBox
                                                    title="Config"
                                                    name="isConfiguration"
                                                    value={isConfiguration}
                                                    onChange={this.handleChangeHeader}
                                                    width="10%"
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
                                    onSubmit={this.handleSubmit}
                                    onKeyPress={this.onKeyPress}
                                >
                                        <Select
                                            title="Copy settings from project"
                                            name="copyId"
                                            options={arraySorted(projects.items, 'name')}
                                            value={project.copyId}
                                            onChange={this.handleChangeProject}
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
                                            onChange={this.handleChangeProject}
                                            submitted={submitted}
                                            inline={false}
                                            required={true}
                                        />
                                        <Select
                                            title="ERP"
                                            name="erpId"
                                            options={arraySorted(erps.items, 'name')}
                                            value={project.erpId}
                                            onChange={this.handleChangeProject}
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
                                            onChange={this.handleChangeProject}
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
                                            onChange={this.handleChangeProject}
                                            placeholder=""
                                            submitted={submitted}
                                            inline={false}
                                            required={true}
                                        />
                                        <div className="text-right">
                                            <button
                                                type="submit"
                                                className="btn btn-leeuwen btn-full btn-lg mb-3"
                                            >
                                                {projectCreating && (
                                                    <FontAwesomeIcon
                                                        icon="spinner"
                                                        className="fa-pulse fa-1x fa-fw"
                                                    />
                                                )}    
                                                Save Project
                                            </button>
                                        </div>
                                    </form>                                
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <div className="row full-height">
                        <div className="col-md-8 col-sm-12 mb-sm-3 full-height">
                            <div className="card full-height" id="tblProjectContainer">
                                <div className="card-header">
                                    <div className="row">
                                        <div className="col-8">
                                            <h5>Set user roles</h5>
                                        </div>
                                        <div className="col-4 text-right">
                                            <div className="modal-link" >
                                                <FontAwesomeIcon icon="plus" className="red" name="plus" onClick={(event) => {this.gotoPage(event, '/settings')}}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <table className="table table-hover table-bordered table-sm">
                                        <thead>
                                            <tr style={{display: 'block', height: '62px'}}>
                                                <th scope="col" style={{width: `${tblBound.width*0.10 + 'px'}`}}>Initials<br />
                                                    <input className="form-control" name="userName" value={userName} onChange={this.handleChangeHeader} />
                                                </th>
                                                <th scope="col" style={{width: `${tblBound.width*0.40 + 'px'}`}}>User<br />
                                                    <input className="form-control" name="name" value={name} onChange={this.handleChangeHeader} />
                                                </th>
                                                <th scope="col" style={{width: `${tblBound.width*0.10 + 'px'}`}}>Expediting<br />
                                                    <select className="form-control" name="isExpediting" value={isExpediting} onChange={this.handleChangeHeader}>
                                                        <option key="1" value="1">Any</option>
                                                        <option key="2" value="2">True</option> 
                                                        <option key="3" value="3">False</option>  
                                                    </select>
                                                </th>
                                                <th scope="col" style={{width: `${tblBound.width*0.10 + 'px'}`}}>Inspection<br />
                                                    <select className="form-control" name="isInspection" value={isInspection} onChange={this.handleChangeHeader}>
                                                        <option key="1" value="1">Any</option>
                                                        <option key="2" value="2">True</option> 
                                                        <option key="3" value="3">False</option>  
                                                    </select>
                                                </th>
                                                <th scope="col" style={{width: `${tblBound.width*0.10 + 'px'}`}}>Shipping<br />
                                                    <select className="form-control" name="isShipping" value={isShipping} onChange={this.handleChangeHeader}>
                                                        <option key="1" value="1">Any</option>
                                                        <option key="2" value="2">True</option> 
                                                        <option key="3" value="3">False</option>  
                                                    </select>                                                
                                                </th>
                                                <th scope="col" style={{width: `${tblBound.width*0.10 + 'px'}`}}>Warehouse<br />
                                                    <select className="form-control" name="isWarehouse" value={isWarehouse} onChange={this.handleChangeHeader}>
                                                        <option key="1" value="1">Any</option>
                                                        <option key="2" value="2">True</option> 
                                                        <option key="3" value="3">False</option>  
                                                    </select>
                                                </th>
                                                <th scope="col" style={{width: `${tblBound.width*0.10 + 'px'}`}}>Config<br />
                                                    <select className="form-control" name="isConfiguration" value={isConfiguration} onChange={this.handleChangeHeader}>
                                                        <option key="1" value="1">Any</option>
                                                        <option key="2" value="2">True</option> 
                                                        <option key="3" value="3">False</option>  
                                                    </select>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody style={{display:'block', height: `${tblBound.height-36-25-62 + 'px'}`, overflow:'auto'}} id="tblProjectBody">
                                            {projectUsers && this.filterName(projectUsers).map(u => (
                                                <tr key={u.userId}>
                                                    <td style={{width: `${tblBound.width*0.10 + 'px'}`}}>{u.userName}</td>
                                                    <td style={{width: `${tblBound.width*0.40 + 'px'}`}}>{u.name}</td>
                                                    <td style={{width: `${tblBound.width*0.10 + 'px'}`}}>
                                                        <TableCheckBoxRole
                                                            id={u.userId}
                                                            checked={u.isExpediting}
                                                            onChange={(event) => {this.handleIsRole(event, 'isExpediting')}}
                                                            disabled={false}
                                                            
                                                        />   
                                                    </td>
                                                    <td style={{width: `${tblBound.width*0.10 + 'px'}`}}>
                                                        <TableCheckBoxRole
                                                            id={u.userId}
                                                            checked={u.isInspection}
                                                            onChange={(event) => {this.handleIsRole(event, 'isInspection')}}
                                                            disabled={false}
                                                        />   
                                                    </td>
                                                    <td style={{width: `${tblBound.width*0.10 + 'px'}`}}>
                                                        <TableCheckBoxRole
                                                            id={u.userId}
                                                            checked={u.isShipping}
                                                            onChange={(event) => {this.handleIsRole(event, 'isShipping')}}
                                                            disabled={false}
                                                        />   
                                                    </td>
                                                    <td style={{width: `${tblBound.width*0.10 + 'px'}`}}>
                                                        <TableCheckBoxRole
                                                            id={u.userId}
                                                            checked={u.isWarehouse}
                                                            onChange={(event) => {this.handleIsRole(event, 'isWarehouse')}}
                                                            disabled={false}
                                                        />
                                                    </td>
                                                    <td style={{width: `${tblBound.width*0.10-tblScrollWidth + 'px'}`}}>
                                                        <TableCheckBoxRole
                                                            id={u.userId}
                                                            checked={u.isConfiguration}
                                                            onChange={(event) => {this.handleIsRole(event, 'isConfiguration')}}
                                                            disabled={false}
                                                        />
                                                    </td>
                                                </tr> 
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div> */}
                        
                    {/* </div>
                </div> */}
            </Layout>
        );
    }
}

function mapStateToProps(state) {
    const { alert, currencies, erps, opcos, projects, users } = state;
    const { projectCreating } = state.projects;
    return {
        alert,
        currencies,
        erps,
        projectCreating,
        opcos,
        projects,
        users
    };
}

const connectedProject = connect(mapStateToProps)(Project);
export { connectedProject as Project };