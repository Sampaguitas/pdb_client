import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import queryString from 'query-string';
import { accessActions, alertActions, projectActions } from '../../../_actions';
import Layout from '../../../_components/layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


function generateGoodsReceiptButton(selection) {
    if (!!selection.project && !!selection.project.enableShipping) {
        return (
            <button className="btn btn-leeuwen-blue btn-lg mr-2" style={{height: '34px'}} title="Goods Receipt with PL">
                <span><FontAwesomeIcon icon="cubes" className="fa-lg mr-2"/>Goods Receipt</span>
            </button>
        );
    } else if (!!selection.project && !!selection.project.enableInspection) {
        return (
            <button className="btn btn-leeuwen-blue btn-lg mr-2" style={{height: '34px'}} title="Goods Receipt with NFI">
                <span><FontAwesomeIcon icon="cubes" className="fa-lg mr-2"/>Goods Receipt</span>
            </button>
        );
    } else {
        return (
            <button className="btn btn-leeuwen-blue btn-lg mr-2" style={{height: '34px'}} title="Goods Receipt with DUF">
                <span><FontAwesomeIcon icon="cubes" className="fa-lg mr-2"/>Goods Receipt</span>
            </button>
        );
    }
}


class StockManagement extends React.Component {
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
        const { accesses, alert, selection } = this.props;
        const { projectId } = this.state;
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
                        <li className="breadcrumb-item">
                        <NavLink to={{ pathname: '/warehouse', search: '?id=' + projectId }} tag="a">Warehouse</NavLink>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">Stock management:</li>
                        <span className="ml-3 project-title">{selection.project ? selection.project.name : <FontAwesomeIcon icon="spinner" className="fa-pulse fa-1x fa-fw" />}</span>
                    </ol>
                </nav>
                <hr />
                <div id="overview" className="full-height">
                    <div className="action-row row ml-1 mb-2 mr-1" style={{height: '34px'}}>
                        {generateGoodsReceiptButton(selection)}
                    </div>
                    <div className="" style={{height: 'calc(100% - 44px)'}}>
                        {/* {fieldnames.items && 
                            <ProjectTable
                                screenHeaders={headersForShow}
                                screenBodys={bodysForShow}
                                projectId={projectId}
                                screenId={screenId}
                                selectedIds={selectedIds}
                                updateSelectedIds = {this.updateSelectedIds}
                                toggleUnlock={this.toggleUnlock}
                                downloadTable={this.downloadTable}
                                unlocked={unlocked}
                                screen={screen}
                                fieldnames={fieldnames}
                                fields={fields}
                                toggleSettings={this.toggleSettings}
                                refreshStore={this.refreshStore}
                                handleDeleteRows = {this.handleDeleteRows}
                                settingsFilter = {settingsFilter}
                            />
                        } */}
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

const connectedStockManagement = connect(mapStateToProps)(StockManagement);
export { connectedStockManagement as StockManagement };