import React from 'react';
import { connect } from 'react-redux';
import { currencyActions, erpActions, opcoActions, projectActions, userActions } from '../../_actions';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

//Components
import CheckBox from '../../_components/check-box';
import TableCheckBox from '../../_components/table-check-box';
import Input from '../../_components/input';
import Select from '../../_components/select';
import Layout from '../../_components/layout';

class Project extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            project: {
                copyId: '',
                name: '',
                erpId: '',
                currencyId: '',
                opcoId:'',
                projectUsers: [],
            },
            loaded: false,
            submitted: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleCheck = this.handleCheck.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.stateReload = this.stateReload.bind(this);
        this.handleIsExpediting = this.handleIsExpediting.bind(this);
        this.handleIsInspection = this.handleIsInspection.bind(this);
        this.handleIsShipping = this.handleIsShipping.bind(this);
        this.handleIsWarehouse = this.handleIsWarehouse.bind(this);
        this.handleIsConfiguration = this.handleIsConfiguration.bind(this);
    }
    componentDidMount() {
        this.props.dispatch(currencyActions.getAll());
        this.props.dispatch(erpActions.getAll());
        this.props.dispatch(opcoActions.getAll());
        this.props.dispatch(projectActions.getAll());
        this.props.dispatch(userActions.getAll());
        // this.stateReload();
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
                    'name': users.items[i].name,
                    'isExpediting': false,
                    'isInspection': false,
                    'isShipping': false,
                    'isWarehouse': false,
                    'isConfiguration': false
                };
                userArray.push(NewUserArrayElement)
            };
            this.setState({
                project:{
                    ...project,
                    projectUsers: userArray,
                },
                loaded: true,
            });
        };
    }

    handleCheck(event) {
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

    handleIsExpediting(event) {
        const { name } = event.target;
        const { projectUsers } = this.state.project;
        let clickedUser = projectUsers.find(x=>x.userId == name);
        clickedUser.isExpediting = !clickedUser.isExpediting;
        this.setState(this.state);
    }

    handleIsInspection(event) {
        const { name } = event.target;
        const { projectUsers } = this.state.project;
        let clickedUser = projectUsers.find(x=>x.userId == name);
        clickedUser.isInspection = !clickedUser.isInspection;
        this.setState(this.state);
    }

    handleIsShipping(event) {
        const { name } = event.target;
        const { projectUsers } = this.state.project;
        let clickedUser = projectUsers.find(x=>x.userId == name);
        clickedUser.isShipping = !clickedUser.isShipping;
        this.setState(this.state);
    }

    handleIsWarehouse(event) {
        const { name } = event.target;
        const { projectUsers } = this.state.project;
        let clickedUser = projectUsers.find(x=>x.userId == name);
        clickedUser.isWarehouse = !clickedUser.isWarehouse;
        this.setState(this.state);
    }

    handleIsConfiguration(event) {
        const { name } = event.target;
        const { projectUsers } = this.state.project;
        let clickedUser = projectUsers.find(x=>x.userId == name);
        clickedUser.isConfiguration = !clickedUser.isConfiguration;
        this.setState(this.state);
    }

    handleChange(event) {
        const { project } = this.state;
        const { name, value } = event.target;
        this.setState({
            project: {
                ...project,
                [name]: value
            }
        });
        console.log(this.state.projectUsers)
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
    handleDeletProject(id) {
        return (event) => this.props.dispatch(projectActions.delete(id));
    }
    render() {
        const { alert, currencies, erps, loading, opcos, projects, users } = this.props;
        const { loaded, project, submitted } = this.state;
        const { projectUsers } = this.state.project;
        {users.items && loaded === false && this.stateReload()}
        return (
            <Layout>
                {alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div>}
                <br />
                <div id="setting">
                    <h2>Add Project</h2>
                    <hr />
                    <div className="row">
                        <div className="col-md-8 col-sm-12 mb-sm-3">
                            <div className="card">
                                <div className="card-header">
                                    <h5>Assign users to project</h5>
                                </div>
                                <div className="card-body table-responsive">
                                    <table className="table table-hover">
                                        <thead>
                                            <tr>
                                                <th>User</th>
                                                <th>Expediting</th>
                                                <th>Inspection</th>
                                                <th>Shipping</th>
                                                <th>Warehouse</th>
                                                <th>Config</th>
                                            </tr>
                                        </thead>
                                        {projectUsers && (
                                            <tbody>
                                                {projectUsers.map(u => (
                                                   <tr key={u.userId}>
                                                    <td>{u.name}</td>
                                                    <td>
                                                        <TableCheckBox
                                                            id={u.userId}
                                                            checked={u.isExpediting}
                                                            onChange={this.handleIsExpediting}
                                                            disabled={false}
                                                        />   
                                                    </td>
                                                    <td>
                                                        <TableCheckBox
                                                            id={u.userId}
                                                            checked={u.isInspection}
                                                            onChange={this.handleIsInspection}
                                                            disabled={false}
                                                        />   
                                                    </td>
                                                    <td>
                                                        <TableCheckBox
                                                            id={u.userId}
                                                            checked={u.isShipping}
                                                            onChange={this.handleIsShipping}
                                                            disabled={false}
                                                        />   
                                                    </td>
                                                    <td>
                                                        <TableCheckBox
                                                            id={u.userId}
                                                            checked={u.isWarehouse}
                                                            onChange={this.handleIsWarehouse}
                                                            disabled={false}
                                                        />   
                                                    </td>
                                                    <td>
                                                        <TableCheckBox
                                                            id={u.userId}
                                                            checked={u.isConfiguration}
                                                            onChange={this.handleIsConfiguration}
                                                            disabled={false}
                                                        />
                                                    </td>
                                                   </tr> 
                                                ))}
                                            </tbody>
                                        )}
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
                                <form onSubmit={this.handleSubmit}>
                                        <Select
                                            title="Copy settings from project"
                                            name="copyId"
                                            options={projects.items}
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
                                            options={erps.items}
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
                                            options={opcos.items}
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
                                            options={currencies.items}
                                            value={project.currencyId}
                                            onChange={this.handleChange}
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
                                                {loading && (
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
                </div>
            </Layout>
        );
    }
}

function mapStateToProps(state) {
    const { alert, currencies, erps, opcos, projects, users } = state;
    const { loading } = state.projects;
    return {
        alert,
        currencies,
        erps,
        loading,
        opcos,
        projects,
        users
    };
}

const connectedProject = connect(mapStateToProps)(Project);
export { connectedProject as Project };