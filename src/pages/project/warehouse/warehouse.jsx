import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import queryString from 'query-string';
import { accessActions, alertActions, projectActions } from '../../../_actions';
import Layout from '../../../_components/layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Warehouse extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            projectId:''
        };
        this.handleClearAlert = this.handleClearAlert.bind(this);
    }

    componentDidMount() {
        const { 
            dispatch,
            loadingAccesses,
            loadingSelection, 
            location 
        } = this.props;
        
        var qs = queryString.parse(location.search);
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

    render() {
        const { projectId } = this.state
        const { accesses, alert, selection } = this.props;
        return (
            <Layout alert={alert} accesses={accesses} selection={selection}>
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
                        <span className="ml-3 project-title">{selection.project ? selection.project.name : <FontAwesomeIcon icon="spinner" className="fa-pulse fa-1x fa-fw" />}</span>
                    </ol>
                </nav>
                <hr />
                <div id="warehouse">
                    <div className="row justify-content-center">
                    <NavLink to={{ 
                            pathname: "/goodsreceipt",
                            search: '?id=' + projectId
                        }} className="card col-lg-4 m-lg-5 col-md-12 m-md-0 p-5" tag="a"
                    >
                        <div className="card-body">
                            <div className="text-center">
                                <FontAwesomeIcon 
                                    icon="cubes" 
                                    className="fa-5x mb-3" 
                                    name="cubes"
                                />
                                <h3>Goods receipt</h3>
                            </div>
                        </div>
                    </NavLink>
                    <NavLink to={{ 
                            pathname: "/stockmanagement",
                            search: '?id=' + projectId
                        }} className="card col-lg-4 m-lg-5 col-md-12 m-md-0 p-5" tag="a"
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
                            pathname: "/callofforder",
                            search: '?id=' + projectId
                        }} className="card col-lg-4 m-lg-5 col-md-12 m-md-0 p-5" tag="a"
                    >
                        <div className="card-body">
                            <div className="text-center">
                                <FontAwesomeIcon 
                                    icon="phone-square" 
                                    className="fa-5x mb-3" 
                                    name="phone-square"
                                />
                                <h3>Call-off order</h3>
                            </div>
                        </div>
                    </NavLink>
                    <NavLink to={{ 
                            pathname: "/pickinglists",
                            search: '?id=' + projectId
                        }} className="card col-lg-4 m-lg-5 col-md-12 m-md-0 p-5" tag="a"
                    >
                        <div className="card-body">
                            <div className="text-center">
                                <FontAwesomeIcon 
                                    icon="clipboard-list" 
                                    className="fa-5x mb-3" 
                                    name="clipboard-list"
                                />
                                <h3>Picking lists</h3>
                            </div>
                        </div>
                    </NavLink>
                    <NavLink to={{ 
                            pathname: "/outgoingshipments",
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
                                <h3>Outgoing shipments</h3>
                            </div>
                        </div>
                    </NavLink>
                    <NavLink to={{ 
                            pathname: "/locations",
                            search: '?id=' + projectId
                        }} className="card col-lg-4 m-lg-5 col-md-12 m-md-0 p-5" tag="a"
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
    const { accesses, alert, selection } = state;
    const { loadingAccesses } = accesses;
    const { loadingSelection } = selection;

    return {
        accesses,
        alert,
        loadingAccesses,
        loadingSelection,
        selection
    };
}

const connectedWarehouse = connect(mapStateToProps)(Warehouse);
export { connectedWarehouse as Warehouse };