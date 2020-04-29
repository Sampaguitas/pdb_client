// import React from 'react';
// import { NavLink } from 'react-router-dom';
// import { connect } from 'react-redux';
// import queryString from 'query-string';
// import { accessActions, alertActions, projectActions } from '../../../_actions';
// import Layout from '../../../_components/layout';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// class GoodsReceipt extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             projectId: '',
//             screenId: '5cd2b642fd333616dc360b63', //Expediting
//         };
//         this.handleClearAlert = this.handleClearAlert.bind(this);
//     }

//     componentDidMount() {
//         const { 
//             dispatch,
//             loadingAccesses,
//             loadingSelection, 
//             location 
//         } = this.props;

//         var qs = queryString.parse(location.search);
//         if (qs.id) {
//             //State items with projectId
//             this.setState({projectId: qs.id});
//             if (!loadingAccesses) {
//                 dispatch(accessActions.getAll(qs.id));
//             }
//             if (!loadingSelection) {
//                 dispatch(projectActions.getById(qs.id));
//             }
//         }
//     }

//     handleClearAlert(event){
//         event.preventDefault;
//         const { dispatch } = this.props;
//         dispatch(alertActions.clear());
//     }

//     render() {
//         const { accesses, alert, selection } = this.props;
//         const { projectId } = this.state;
//         return (
//             <Layout alert={alert} accesses={accesses} selection={selection}>
//                 {alert.message && 
//                     <div className={`alert ${alert.type}`}>{alert.message}
//                         <button className="close" onClick={(event) => this.handleClearAlert(event)}>
//                             <span aria-hidden="true"><FontAwesomeIcon icon="times"/></span>
//                         </button>
//                     </div>
//                 }
//                 <nav aria-label="breadcrumb">
//                     <ol className="breadcrumb">
//                         <li className="breadcrumb-item">
//                             <NavLink to={{ pathname: '/dashboard', search: '?id=' + projectId }} tag="a">Dashboard</NavLink>
//                         </li>
//                         <li className="breadcrumb-item">
//                             <NavLink to={{ pathname: '/warehouse', search: '?id=' + projectId }} tag="a">Warehouse</NavLink>
//                         </li>
//                         <li className="breadcrumb-item active" aria-current="page">Goods receipt:</li>
//                         <span className="ml-3 project-title">{selection.project ? selection.project.name : <FontAwesomeIcon icon="spinner" className="fa-pulse fa-1x fa-fw" />}</span>
//                     </ol>
//                 </nav>
//                 <hr />
//                 <div id="availableStock" className="full-height">
//                     <div className="action-row row ml-1 mb-2 mr-1" style={{height: '34px'}}>
//                     </div>
//                     <div className="" style={{height: 'calc(100% - 44px)'}}>
//                         {/* {fieldnames.items && 
//                             <ProjectTable
//                                 screenHeaders={headersForShow}
//                                 screenBodys={bodysForShow}
//                                 projectId={projectId}
//                                 screenId={screenId}
//                                 selectedIds={selectedIds}
//                                 updateSelectedIds = {this.updateSelectedIds}
//                                 toggleUnlock={this.toggleUnlock}
//                                 downloadTable={this.downloadTable}
//                                 unlocked={unlocked}
//                                 screen={screen}
//                                 fieldnames={fieldnames}
//                                 fields={fields}
//                                 toggleSettings={this.toggleSettings}
//                                 refreshStore={this.refreshStore}
//                                 handleDeleteRows = {this.handleDeleteRows}
//                                 settingsFilter = {settingsFilter}
//                             />
//                         } */}
//                     </div>
//                 </div>
//             </Layout>
//         );
//     }
// }

// function mapStateToProps(state) {
//     const { accesses, alert, fieldnames, fields, pos, selection, settings } = state;
//     const { loadingAccesses } = accesses;
//     const { loadingFieldnames } = fieldnames;
//     const { loadingFields } = fields;
//     const { loadingPos } = pos;
//     const { loadingSelection } = selection;
//     const { loadingSettings } = settings;
    
//     return {
//         accesses,
//         alert,
//         fieldnames,
//         fields,
//         loadingAccesses,
//         loadingDocdefs,
//         loadingFieldnames,
//         loadingFields,
//         loadingPos,
//         loadingSelection,
//         loadingSettings,
//         pos,
//         selection,
//         settings
//     };
// }

// const connectedGoodsReceipt = connect(mapStateToProps)(GoodsReceipt);
// export { connectedGoodsReceipt as GoodsReceipt };