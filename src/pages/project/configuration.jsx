import React from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';
// import config from 'config';
import { accessActions, currencyActions, erpActions, opcoActions, projectActions, supplierActions, screenActions, userActions  } from '../../_actions';
// import { authHeader } from '../../_helpers';
import Layout from '../../_components/layout';
import Tabs from '../../_components/tabs/tabs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import General from './tabs/configuration/general';
import Suppliers from './tabs/configuration/suppliers';
import Fields from './tabs/configuration/fields';
import Screens from './tabs/configuration/screens';
import Documents from './tabs/configuration/documents';
import Duf from './tabs/configuration/duf';
// import { EventEmitter } from 'events';

const tabs = [
    {index: 0, id: 'general', label: 'General', component: General, active: true, isLoaded: false},
    {index: 1, id: 'suppliers', label: 'Suppliers', component: Suppliers, active: false, isLoaded: false},
    {index: 2, id: 'fields', label: 'Fields', component: Fields, active: false, isLoaded: false},
    {index: 3, id: 'screens', label: 'Screens', component: Screens, active: false, isLoaded: false},
    {index: 4, id: 'documents', label: 'Documents', component: Documents, active: false, isLoaded: false},
    {index: 5, id: 'duf', label: 'DUF', component: Duf, active: false, isLoaded: false}
]

const _ = require('lodash');

class Configuration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            submittedProject: false,
            projectId: ''
        }
        this.handleSelectionReload=this.handleSelectionReload.bind(this);
        this.handleSubmitProject=this.handleSubmitProject.bind(this);
        this.handleDeleteProject=this.handleDeleteProject.bind(this);

    }

    componentDidMount(){
        const { dispatch, location } = this.props
        var qs = queryString.parse(location.search);
        if (qs.id) {
            //State items with projectId
            this.setState({projectId: qs.id});
            dispatch(accessActions.getAll(qs.id));
            dispatch(projectActions.getById(qs.id));
            dispatch(supplierActions.getAll(qs.id));
        }
        //State items without projectId
        dispatch(currencyActions.getAll());
        dispatch(erpActions.getAll());
        dispatch(opcoActions.getAll());
        dispatch(screenActions.getAll());
        dispatch(userActions.getAll());
    }

    handleSelectionReload(event){
        // event.preventDefault();
        const { dispatch, location } = this.props
        var qs = queryString.parse(location.search);
        if (qs.id) {
            this.setState({projectId: qs.id}),
            dispatch(projectActions.getById(qs.id));
        }
        // dispatch(projectActions.getAll());     
    }

    handleSubmitProject(event, project) {
        event.preventDefault();
        const { dispatch } = this.props;
        this.setState({ submittedProject: true });
        if (project._id, project.name && project.erpId && project.opcoId) {
            dispatch(projectActions.update(project));
            this.setState({submittedProject: false})
        }
    }

    handleDeleteProject(event, id) {
        event.preventDefault();
        const { dispatch } = this.props
        dispatch(projectActions.delete(id));
    }

    render() {
        const {
                accesses, 
                alert,
                currencies,
                erps,
                opcos,
                projectUpdating,
                projectDeleting,
                screens,
                selection,
                suppliers,
                users,
            } = this.props;
        
            const {
                projectId,
                submittedProject,
            } = this.state

        return (
            <Layout alert={alert} accesses={accesses}>
                {alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div>}
                <h2>Configuration : {selection.project ? selection.project.name : <FontAwesomeIcon icon="spinner" className="fa-pulse fa-1x fa-fw" />}</h2>
                <hr />
                <div id="configuration" className="full-height">
                    <Tabs
                        tabs={tabs}
                        //Functions
                        handleSelectionReload={this.handleSelectionReload}
                        handleSubmitProject={this.handleSubmitProject}
                        handleDeleteProject={this.handleDeleteProject}
                        //Props
                        accesses={accesses}
                        currencies={currencies}
                        erps={erps}
                        opcos={opcos}
                        projectDeleting={projectDeleting}
                        projectUpdating={projectUpdating}
                        screens={screens}
                        selection={selection}
                        suppliers={suppliers}
                        users={users}
                        //State
                        projectId={projectId}
                        submittedProject={submittedProject} 
                    />
                </div>
            </Layout>
        );
    }
}

function mapStateToProps(state) {
    const { accesses, alert, currencies, erps, opcos, screens, selection, suppliers, users } = state;
    const { projectDeleting, projectUpdating } = state.projects;
    return {
        accesses,
        alert,
        currencies,
        erps,
        opcos,
        projectDeleting,
        projectUpdating,
        screens,
        selection,
        suppliers,
        users,
    };
}

const connectedConfiguration = connect(mapStateToProps)(Configuration);
export { connectedConfiguration as Configuration };