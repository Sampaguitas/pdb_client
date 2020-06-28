import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import queryString from 'query-string';
import { accessActions, alertActions, projectActions, sidemenuActions } from '../../../_actions';
import Layout from '../../../_components/layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Warehouse extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            projectId:'',
            menuItem: 'Warehouse'
        };
        this.handleClearAlert = this.handleClearAlert.bind(this);
        this.toggleCollapse = this.toggleCollapse.bind(this);
    }

    componentDidMount() {
        const { menuItem } = this.state;
        const { 
            dispatch,
            loadingAccesses,
            loadingSelection, 
            location 
        } = this.props;
        
        var qs = queryString.parse(location.search);
        dispatch(sidemenuActions.select(menuItem));
        if (qs.id) {
             //State items with projectId
             this.setState({projectId: qs.id});
             if (!loadingAccesses) {
                 dispatch(accessActions.getAll(qs.id));
             }
             if (!loadingSelection) {
                 dispatch(projectActions.getById(qs.id));
             }
        }
    }

    handleClearAlert(event){
        event.preventDefault;
        const { dispatch } = this.props;
        dispatch(alertActions.clear());
    }

    toggleCollapse() {
        const { dispatch } = this.props;
        dispatch(sidemenuActions.toggle());
    }

    render() {
        const { projectId, menuItem } = this.state
        const { accesses, alert, selection, sidemenu } = this.props;
        return (
            <Layout accesses={accesses} selection={selection} sidemenu={sidemenu} toggleCollapse={this.toggleCollapse} menuItem={menuItem}>
                {alert.message && 
                    <div className={`alert ${alert.type}`}>{alert.message}
                        <button className="close" onClick={(event) => this.handleClearAlert(event)}>
                            <span aria-hidden="true"><FontAwesomeIcon icon="times"/></span>
                        </button>
                    </div>
                }
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <NavLink to={{ pathname: '/dashboard', search: '?id=' + projectId }} tag="a">Dashboard</NavLink>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">Warehouse:</li>
                        <span className="ml-3 project-title">{selection.project ? selection.project.name : <FontAwesomeIcon icon="spinner" className="fa-pulse fa fa-fw" />}</span>
                    </ol>
                </nav>
                <div id="warehouse" className={alert.message ? "main-section-alert" : "main-section"}>
                    <div className="row justify-content-center" style={{maxHeight: '100%', overflowY: 'auto'}}>
                        <NavLink to={{ 
                                pathname: "/whcertificates",
                                search: '?id=' + projectId
                            }} className="card col-lg-5 m-lg-4 col-md-12 m-md-0 p-5" tag="a"
                        >
                            <div className="card-body">
                                <div className="text-center">
                                    <FontAwesomeIcon 
                                        icon="cubes" 
                                        className="fa-5x mb-3" 
                                        name="cubes"
                                    />
                                    <h3>Certificates</h3>
                                </div>
                            </div>
                        </NavLink>
                        <NavLink to={{ 
                                pathname: "/stockmanagement",
                                search: '?id=' + projectId
                            }} className="card col-lg-5 m-lg-4 col-md-12 m-md-0 p-5" tag="a"
                        >
                            <div className="card-body">
                                <div className="text-center">
                                    <FontAwesomeIcon 
                                        icon="forklift" 
                                        className="fa-5x mb-3" 
                                        name="forklift"
                                    />
                                    <h3>Stock management</h3>
                                </div>
                            </div>
                        </NavLink>
                        <NavLink to={{ 
                                pathname: "/materialissuerecord",
                                search: '?id=' + projectId
                            }} className="card col-lg-5 m-lg-4 col-md-12 m-md-0 p-5" tag="a"
                        >
                            <div className="card-body">
                                <div className="text-center">
                                    <FontAwesomeIcon 
                                        icon="phone-square" 
                                        className="fa-5x mb-3" 
                                        name="phone-square"
                                    />
                                    <h3>Material issue record</h3>
                                </div>
                            </div>
                        </NavLink>
                        <NavLink to={{ 
                                pathname: "/pickingticket",
                                search: '?id=' + projectId
                            }} className="card col-lg-5 m-lg-4 col-md-12 m-md-0 p-5" tag="a"
                        >
                            <div className="card-body">
                                <div className="text-center">
                                    <FontAwesomeIcon 
                                        icon="clipboard-list" 
                                        className="fa-5x mb-3" 
                                        name="clipboard-list"
                                    />
                                    <h3>Picking ticket</h3>
                                </div>
                            </div>
                        </NavLink>
                        <NavLink to={{ 
                                pathname: "/whshipping",
                                search: '?id=' + projectId
                            }} className="card col-lg-5 m-lg-4 col-md-12 m-md-0 p-5" tag="a"
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
                                pathname: "/locations",
                                search: '?id=' + projectId
                            }} className="card col-lg-5 m-lg-4 col-md-12 m-md-0 p-5" tag="a"
                        >
                            <div className="card-body">
                                <div className="text-center">
                                    <FontAwesomeIcon 
                                        icon="map-marked-alt" //inventory map-marked-alt
                                        className="fa-5x mb-3" 
                                        name="inventory"
                                    />
                                    <h3>Locations</h3>
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
    const { accesses, alert, selection, sidemenu } = state;
    const { loadingAccesses } = accesses;
    const { loadingSelection } = selection;

    return {
        accesses,
        alert,
        loadingAccesses,
        loadingSelection,
        selection,
        sidemenu
    };
}

const connectedWarehouse = connect(mapStateToProps)(Warehouse);
export { connectedWarehouse as Warehouse };