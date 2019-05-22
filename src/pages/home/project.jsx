import React from 'react';
import { connect } from 'react-redux';
import { currencyActions, erpActions, opcoActions, projectActions, userActions } from '../../_actions';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

//Components
import CheckBox from '../../_components/check-box';
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
                projectInspection: true,
                projectShipping: true,
                projectWarehouse: true,
            },
            projectUsers: [],
            loaded: false,
            submitted: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleCheck = this.handleCheck.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        // this.stateReload = this.stateReload.bind(this);
    }
    componentDidMount() {
        this.props.dispatch(currencyActions.getAll());
        this.props.dispatch(erpActions.getAll());
        this.props.dispatch(opcoActions.getAll());
        this.props.dispatch(projectActions.getAll());
        this.props.dispatch(userActions.getAll());
        // this.stateReload();
    }

    // stateReload(event){
    //     const { users } = this.props;
    //     var userArray = []
    //     var i
    //     if (users.items) {
    //         for(i=0;i<users.items.length;i++){
    //             let NewUserArrayElement = {
    //                 'userId': users.items[i]._id,
    //                 'name': users.items[i].name,
    //                 'isExpediting': false,
    //                 'isInspection': false,
    //                 'isShipping': false,
    //                 'isWarehouse': false,
    //                 'isConfiguration': false
    //             };
    //             userArray.push(NewUserArrayElement)
    //         };
    //         this.setState({
    //             projectUsers: userArray,
    //             loaded: true,
    //         });
    //     };
    // }

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
    handleChange(event) {
        const { project } = this.state;
        const { name, value } = event.target;
        this.setState({
            project: {
                ...project,
                [name]: value
            }
        });
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
        // {users.items && loaded === false && this.stateReload()}
        return (
            <Layout>
                {alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div>}
                <br />
                <h2>Add or Edit Project:</h2>
                <hr />
                <form onSubmit={this.handleSubmit}>
                    <Select
                        title="Copy Settings from"
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
                    <div className="col-sm-10 offset-md-2">
                        <CheckBox
                            title="Enable Inspection Module"
                            id="projectInspection"
                            name="projectInspection"
                            checked={project.projectInspection}
                            onChange={this.handleCheck}
                            small="Check this if this project requires the Inspection Module. The Inspection Module is required if you want to use the Warehouse Module."
                        />
                        <CheckBox
                            title="Enable Shipping Module"
                            id="projectShipping"
                            name="projectShipping"
                            checked={project.projectShipping}
                            onChange={this.handleCheck}
                            small="Check this if this project requires the Shipping Module."
                        />
                        <CheckBox
                            title="Enable Warehouse Module"
                            id="projectWarehouse"
                            name="projectWarehouse"
                            checked={project.projectWarehouse}
                            onChange={this.handleCheck}
                            small="Check this if this project requires the Warehouse Module. "
                            strong="Requires the Inspection Module to be enabled."
                        />
                    </div>
                    <div className="text-right">
                        <button type="submit" className="btn btn-lg btn-outline-leeuwen">
                            {loading ? <FontAwesomeIcon icon="spinner" className="fa-pulse fa-1x fa-fw" /> : ''}
                        Save Project
                        </button>
                    </div>
                </form>
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