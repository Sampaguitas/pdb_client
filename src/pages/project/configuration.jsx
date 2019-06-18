import React from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';
import config from 'config';
import { currencyActions, opcoActions, projectActions, supplierActions, userActions, erpActions  } from '../../_actions';
import { authHeader } from '../../_helpers';
import Layout from '../../_components/layout';
import Tabs from '../../_components/tabs/tabs';

import General from './tabs/configuration/general';
import Suppliers from './tabs/configuration/suppliers';
import Fields from './tabs/configuration/fields';
import Screens from './tabs/configuration/screens';
import Documents from './tabs/configuration/documents';
import Duf from './tabs/configuration/duf';

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
            submittedSupplier: false
        }
        this.handleSubmitProject=this.handleSubmitProject.bind(this);
        this.handleDeleteProject=this.handleDeleteProject.bind(this);
        this.handleSubmitSupplier=this.handleSubmitSupplier.bind(this);
        this.handleDeleteSupplier=this.handleDeleteSupplier.bind(this);

    }

    componentDidMount(){
        const { dispatch, location } = this.props
        var qs = queryString.parse(location.search);
        if (qs.id) {
            dispatch(projectActions.getById(qs.id));
        }
        dispatch(currencyActions.getAll());
        dispatch(erpActions.getAll());
        dispatch(opcoActions.getAll());
        dispatch(userActions.getAll());
        dispatch(projectActions.getAll());
    }

    handleSubmitProject(event, project) {
        event.preventDefault();
        const { dispatch } = this.props;
        this.setState({ submittedProject: true });
        if (project._id, project.name && project.erpId && project.currencyId && project.opcoId) {
            dispatch(projectActions.update(project));
            this.setState({submittedProject: false})
        }
    }

    handleSubmitSupplier(event, supplier) {
        event.preventDefault();
        const { dispatch } = this.props;
        // console.log('clicked on submit handleSubmitSupplier');
        // console.log('supplier:', supplier);
        // console.log('this.state.submittedSupplier:', this.state.submittedSupplier);
        this.setState({ submittedSupplier: true });
        if (supplier._id && supplier.name && supplier.projectId) {
            dispatch(supplierActions.create(supplier));
            this.setState({submittedSupplier: false})
        } else if (supplier.name && supplier.projectId){
            dispatch(supplierActions.update(supplier));
            this.setState({submittedSupplier: false})
        }
    }

    handleDeleteProject(event, id) {
        event.preventDefault();
        const { dispatch } = this.props
        dispatch(projectActions.delete(id));
    }

    handleDeleteSupplier(event, id) {
        event.preventDefault();
        const { dispatch } = this.props
        dispatch(supplierActions.delete(id));
    }
    
    render() {
        const { 
                alert,  
                projectUpdating,
                projectDeleting,
                erps,
                opcos,
                currencies,
                selection,
                users,
                supplierUpdating,
                supplierDeleting
            } = this.props;
        
            const { submittedProject, submittedSupplier } = this.state

            // let currentUser = JSON.parse(localStorage.getItem('user'));
        return (
            <Layout accesses={selection.project && selection.project.accesses}>
                {alert.message ? <div className={`alert ${alert.type}`}>{alert.message}</div>: <br />}
                <h2>Configuration : {selection.project && selection.project.name}</h2>
                <hr />
                <div id="configuration" className="full-height">
                    <Tabs
                        tabs={tabs}
                        handleSubmitProject={this.handleSubmitProject}
                        handleDeleteProject={this.handleDeleteProject}
                        projectUpdating={projectUpdating}
                        projectDeleting={projectDeleting}
                        submittedProject = {submittedProject}                    
                        erps={erps}
                        opcos={opcos}
                        currencies={currencies}
                        selection={selection}
                        users={users}
                        handleSubmitSupplier={this.handleSubmitSupplier}
                        handleDeleteSupplier={this.handleDeleteSupplier}
                        supplierUpdating={supplierUpdating}
                        supplierDeleting={supplierDeleting}
                        submittedSupplier = {submittedSupplier}
                        // currentUser = {currentUser}
                    />
                </div>
            </Layout>
        );
    }
}

function mapStateToProps(state) {
    const { alert, currencies, opcos, users, selection, erps  } = state;
    const { projectUpdating, projectDeleting } = state.projects;
    const { supplierUpdating, supplierDeleting } = state.suppliers;
    return {
        alert,
        currencies,
        projectUpdating,
        projectDeleting,
        supplierUpdating,
        supplierDeleting,        
        opcos,
        users,
        selection,
        erps
    };
}

const connectedConfiguration = connect(mapStateToProps)(Configuration);
export { connectedConfiguration as Configuration };