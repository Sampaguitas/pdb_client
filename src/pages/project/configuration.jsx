import React from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';
// import config from 'config';
import { 
    accessActions, 
    alertActions, 
    docdefActions,
    docfieldActions, 
    currencyActions, 
    erpActions,
    fieldnameActions, 
    fieldActions, 
    opcoActions, 
    projectActions, 
    supplierActions, 
    screenActions, 
    userActions  
} from '../../_actions';
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
import Certificates from './tabs/configuration/certificates';
// import { EventEmitter } from 'events';

const tabs = [
    {index: 0, id: 'general', label: 'General', component: General, active: true, isLoaded: false},
    {index: 1, id: 'suppliers', label: 'Suppliers', component: Suppliers, active: false, isLoaded: false},
    {index: 2, id: 'fields', label: 'Fields', component: Fields, active: false, isLoaded: false},
    {index: 3, id: 'screens', label: 'Screens', component: Screens, active: false, isLoaded: false},
    {index: 4, id: 'documents', label: 'Documents', component: Documents, active: false, isLoaded: false},
    {index: 5, id: 'duf', label: 'DUF', component: Duf, active: false, isLoaded: false},
    {index: 6, id: 'certificates', label: 'Certificates', component: Certificates, active: false, isLoaded: false}
]

const _ = require('lodash');

class Configuration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            submittedProject: false,
            submittedSupplier: false,
            projectId: ''
        }
        this.handleClearAlert = this.handleClearAlert.bind(this);
        this.handleSelectionReload=this.handleSelectionReload.bind(this);
        this.handleSubmitProject=this.handleSubmitProject.bind(this);
        this.handleDeleteProject=this.handleDeleteProject.bind(this);
        this.handleSubmitSupplier=this.handleSubmitSupplier.bind(this);
        this.handleDeleteSupplier=this.handleDeleteSupplier.bind(this);
        
        this.refreshDocfields = this.refreshDocfields.bind(this);
        this.refreshFieldnames = this.refreshFieldnames.bind(this);
        this.refreshFields = this.refreshFields.bind(this);

    }

    componentDidMount(){
        const { 
            currencies,
            erps,
            dispatch,
            loadingAccesses,
            loadingDocdefs,
            loadingDocfields,
            loadingFieldnames,
            loadingFields,
            loadingSelection,
            loadingSuppliers,
            location,
            opcos,
            screens,
            users
        } = this.props;

        var qs = queryString.parse(location.search);
        if (qs.id) {
            //State items with projectId
            this.setState({projectId: qs.id});
            if (!loadingAccesses) {
                dispatch(accessActions.getAll(qs.id));
            }
            if (!loadingDocdefs) {
                dispatch(docdefActions.getAll(qs.id));
            }
            if (!loadingDocfields) {
                dispatch(docfieldActions.getAll(qs.id));
            }
            if (!loadingFieldnames) {
                dispatch(fieldnameActions.getAll(qs.id));
            }
            if (!loadingFields) {
                dispatch(fieldActions.getAll(qs.id));
            }
            if (!loadingSelection) {
                dispatch(projectActions.getById(qs.id));
            }
            if (!loadingSuppliers) {
                dispatch(supplierActions.getAll(qs.id));
            }
        }
        //State items without projectId
        if (!currencies.items) {
            dispatch(currencyActions.getAll());
        }
        if (!erps.items) {
            dispatch(erpActions.getAll());
        }
        if (!opcos.items) {
            dispatch(opcoActions.getAll());
        }
        if (!screens.items) {
            dispatch(screenActions.getAll());
        }
        if (!users.items) {
            dispatch(userActions.getAll());
        }
    }

    handleClearAlert(event){
        event.preventDefault;
        const { dispatch } = this.props;
        dispatch(alertActions.clear());
    }

    handleSelectionReload(event){
        // event.preventDefault();
        const { 
            currencies,
            erps,
            dispatch,
            loadingAccesses,
            loadingDocdefs,
            loadingDocfields,
            loadingFieldnames,
            loadingFields,
            loadingSelection,
            loadingSuppliers,
            location,
            opcos,
            screens,
            users
        } = this.props;

        var qs = queryString.parse(location.search);
        if (qs.id) {
            //State items with projectId
            this.setState({projectId: qs.id});
            if (!loadingAccesses) {
                dispatch(accessActions.getAll(qs.id));
            }
            if (!loadingDocdefs) {
                dispatch(docdefActions.getAll(qs.id));
            }
            if (!loadingDocfields) {
                dispatch(docfieldActions.getAll(qs.id));
            }
            if (!loadingFieldnames) {
                dispatch(fieldnameActions.getAll(qs.id));
            }
            if (!loadingFields) {
                dispatch(fieldActions.getAll(qs.id));
            }
            if (!loadingSelection) {
                dispatch(projectActions.getById(qs.id));
            }
            if (!loadingSuppliers) {
                dispatch(supplierActions.getAll(qs.id));
            }
        }
        //State items without projectId
        if (!currencies.items) {
            dispatch(currencyActions.getAll());
        }
        if (!erps.items) {
            dispatch(erpActions.getAll());
        }
        if (!opcos.items) {
            dispatch(opcoActions.getAll());
        }
        if (!screens.items) {
            dispatch(screenActions.getAll());
        }
        if (!users.items) {
            dispatch(userActions.getAll());
        }    
    }

    refreshDocfields() {
        const { dispatch } = this.props;
        const { projectId } = this.state;
        if (projectId) {
            dispatch(docfieldActions.getAll(projectId));
        }
    }

    refreshFieldnames() {
        const { dispatch } = this.props;
        const { projectId } = this.state;
        if (projectId) {
            dispatch(fieldnameActions.getAll(projectId));
        }
    }

    refreshFields() {
        const { dispatch } = this.props;
        const { projectId } = this.state;
        if (projectId) {
            dispatch(fieldActions.getAll(projectId));
        }
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

    handleSubmitSupplier(event, supplier, callback ) {
        event.preventDefault();
        const { dispatch } = this.props;
        this.setState({ submittedSupplier: true }, () => {
            if(supplier.id && supplier.name && supplier.projectId) {
                dispatch(supplierActions.update(supplier));
                this.setState({submittedSupplier: false }, () => callback )
            } else if (supplier.name && supplier.projectId) {
                dispatch(supplierActions.create(supplier))
                this.setState({submittedSupplier: false }, () => callback );
            }
        });
    }

    handleDeleteSupplier(event, id, callback) {
        event.preventDefault();
        const { dispatch } = this.props;
        dispatch(supplierActions.delete(id));
        callback;
    }

    render() {
        const {
                accesses, 
                alert,
                currencies,
                docdefs,
                docfields,
                erps,
                fieldnames,
                fields,
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
                submittedSupplier
            } = this.state

        return (
            <Layout alert={alert} accesses={accesses}>
                {alert.message && 
                    <div className={`alert ${alert.type}`}>{alert.message}
                        <button className="close" onClick={(event) => this.handleClearAlert(event)}>
                            <span aria-hidden="true"><FontAwesomeIcon icon="times"/></span>
                        </button>
                    </div>
                }
                <h2>Configuration : {selection.project ? selection.project.name : <FontAwesomeIcon icon="spinner" className="fa-pulse fa-1x fa-fw" />}</h2>
                <hr />
                <div id="configuration" className="full-height">
                    <Tabs
                        tabs={tabs}
                        //Functions
                        handleSelectionReload={this.handleSelectionReload}
                        handleSubmitProject={this.handleSubmitProject}
                        handleDeleteProject={this.handleDeleteProject}
                        handleSubmitSupplier={this.handleSubmitSupplier}
                        handleDeleteSupplier={this.handleDeleteSupplier}
                        //refreshStore
                        refreshDocfields={this.refreshDocfields}
                        refreshFieldnames={this.refreshFieldnames}
                        refreshFields={this.refreshFields}
                        //Props
                        accesses={accesses}
                        currencies={currencies}
                        docdefs={docdefs}
                        docfields={docfields}
                        erps={erps}
                        fieldnames={fieldnames}
                        fields={fields}
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
                        submittedSupplier={submittedSupplier}
                    />
                </div>
            </Layout>
        );
    }
}

function mapStateToProps(state) {
    const { 
        accesses, 
        alert, 
        currencies, 
        docdefs,
        docfields,
        erps,
        fieldnames,
        fields, 
        opcos, 
        screens, 
        selection, 
        suppliers, 
        users 
    } = state;

    const { projectDeleting, projectUpdating } = state.projects;
    const { loadingAccesses } = accesses;
    const { loadingDocdefs } = docdefs;
    const { loadingDocfields } = docfields;
    const { loadingFieldnames } = fieldnames;
    const { loadingFields } = fields;
    const { loadingSelection } = selection;
    const { loadingSuppliers } = suppliers;
    return {
        accesses,
        alert,
        currencies,
        docdefs,
        docfields,
        erps,
        fieldnames,
        fields,
        loadingAccesses,
        loadingDocdefs,
        loadingDocfields,
        loadingFieldnames,
        loadingFields,
        loadingSelection,
        loadingSuppliers,
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