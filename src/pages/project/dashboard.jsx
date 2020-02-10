import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import queryString from 'query-string';
import { 
    accessActions,
    alertActions,
    docdefActions,
    docfieldActions,
    currencyActions,
    erpActions,
    fieldActions,
    fieldnameActions,
    opcoActions,
    poActions,
    projectActions,
    supplierActions,
    screenActions,
    userActions,
} from '../../_actions';
import Layout from '../../_components/layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            projectId:''
        };
        this.handleClearAlert = this.handleClearAlert.bind(this);
    }

    componentDidMount() {
        const { 
            currencies,
            erps,
            dispatch,
            loadingAccesses,
            loadingDocdefs,
            loadingDocfields,
            loadingFieldnames,
            loadingFields,
            loadingPos,
            loadingSelection,
            loadingSuppliers,
            location,
            opcos,
            screens,
            users
        } = this.props;

        var qs = queryString.parse(location.search);
        if (qs.id) {
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
            if (!loadingFields) {
                dispatch(fieldActions.getAll(qs.id));
            }
            if (!loadingFieldnames) {
                dispatch(fieldnameActions.getAll(qs.id));
            }
            if (!loadingPos) {
                dispatch(poActions.getAll(qs.id));
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

    render() {
        const { projectId } = this.state
        const { accesses, alert, selection } = this.props;
        return (
            <Layout alert={alert} accesses={accesses}>
                {alert.message && 
                    <div className={`alert ${alert.type}`}>{alert.message}
                        <button className="close" onClick={(event) => this.handleClearAlert(event)}>
                            <span aria-hidden="true"><FontAwesomeIcon icon="times"/></span>
                        </button>
                    </div>
                }
                <h2>Dashboard > {selection.project ? selection.project.name : <FontAwesomeIcon icon="spinner" className="fa-pulse fa-1x fa-fw" />}</h2>
                <hr />
                <div id="dashboard">
                    <div className="row justify-content-center">
                    <NavLink to={{ 
                            pathname: "/duf",
                            search: '?id=' + projectId
                        }} className="card col-lg-4 m-lg-5 col-md-12 m-md-0 p-5" tag="a"
                    >
                        <div className="card-body">
                            <div className="text-center">
                                <FontAwesomeIcon 
                                    icon="upload" 
                                    className="fa-5x mb-3" 
                                    name="upload"
                                />
                                <h3>Data Upload File (DUF)</h3>
                            </div>
                        </div>
                    </NavLink>
                    <NavLink to={{ 
                            pathname: "/expediting",
                            search: '?id=' + projectId
                        }} className="card col-lg-4 m-lg-5 col-md-12 m-md-0 p-5" tag="a"
                    >
                        <div className="card-body">
                            <div className="text-center">
                                <FontAwesomeIcon 
                                    icon="stopwatch" 
                                    className="fa-5x mb-3" 
                                    name="stopwatch"
                                />
                                <h3>Expediting</h3>
                            </div>
                        </div>
                    </NavLink>
                    <NavLink to={{ 
                            pathname: "/inspection",
                            search: '?id=' + projectId
                        }} className="card col-lg-4 m-lg-5 col-md-12 m-md-0 p-5" tag="a"
                    >
                        <div className="card-body">
                            <div className="text-center">
                                <FontAwesomeIcon 
                                    icon="search" 
                                    className="fa-5x mb-3" 
                                    name="search"
                                />
                                <h3>Inspection</h3>
                            </div>
                        </div>
                    </NavLink>
                    <NavLink to={{ 
                            pathname: "/shipping",
                            search: '?id=' + projectId
                        }} className="card col-lg-4 m-lg-5 col-md-12 m-md-0 p-5" tag="a"
                    >
                        <div className="card-body">
                            <div className="text-center">
                                <FontAwesomeIcon 
                                    icon="ship" 
                                    className="fa-5x mb-3" 
                                    name="ship"
                                />
                                <h3>Shipping</h3>
                            </div>
                        </div>
                    </NavLink>
                    <NavLink to={{ 
                            pathname: "/warehouse",
                            search: '?id=' + projectId
                        }} className="card col-lg-4 m-lg-5 col-md-12 m-md-0 p-5" tag="a"
                    >
                        <div className="card-body">
                            <div className="text-center">
                                <FontAwesomeIcon 
                                    icon="warehouse" 
                                    className="fa-5x mb-3" 
                                    name="warehouse"
                                />
                                <h3>Warehouse</h3>
                            </div>
                        </div>
                    </NavLink>
                    <NavLink to={{ 
                            pathname: "/configuration",
                            search: '?id=' + projectId
                        }} className="card col-lg-4 m-lg-5 col-md-12 m-md-0 p-5" tag="a"
                    >
                        <div className="card-body">
                            <div className="text-center">
                                <FontAwesomeIcon 
                                    icon="cog" 
                                    className="fa-5x mb-3" 
                                    name="cog"
                                />
                                <h3>Configuration</h3>
                            </div>
                        </div>
                    </NavLink>
                    </div>
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
        pos, 
        selection,
        suppliers,
        users
    } = state;

    const { loadingAccesses } = accesses;
    const { loadingDocdefs } = docdefs;
    const { loadingDocfields } = docfields;
    const { loadingFieldnames } = fieldnames;
    const { loadingFields } = fields;
    const { loadingPos } = pos;
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
        loadingPos,
        loadingSelection,
        loadingSuppliers,
        opcos,
        pos,
        screens,
        selection,
        suppliers,
        users
    };
}

const connectedDashboard = connect(mapStateToProps)(Dashboard);
export { connectedDashboard as Dashboard };