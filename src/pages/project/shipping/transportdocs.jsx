import React from 'react';
import { connect } from 'react-redux';
import Layout from '../../../_components/layout';
import queryString from 'query-string';
import { authHeader } from '../../../_helpers';
import config from 'config';
import { projectActions } from '../../../_actions';
import ProjectTable from '../../../_components/project-table/project-table'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function arrayRemove(arr, value) {

    return arr.filter(function(ele){
        return ele != value;
    });
 
 }

function resolve(path, obj) {
    return path.split('.').reduce(function(prev, curr) {
        return prev ? prev[curr] : null
    }, obj || self)
}

function arraySorted(array, fieldOne, fieldTwo, fieldThree) {
    if (array) {
        const newArray = array
        newArray.sort(function(a,b){
            if (resolve(fieldOne, a) < resolve(fieldOne, b)) {
                return -1;
            } else if (resolve(fieldOne, a) > resolve(fieldOne, b)) {
                return 1;
            } else if (fieldTwo && resolve(fieldTwo, a) < resolve(fieldTwo, b)) {
                return -1;
            } else if (fieldTwo && resolve(fieldTwo, a) > resolve(fieldTwo, b)) {
                return 1;
            } else if (fieldThree && resolve(fieldThree, a) < resolve(fieldThree, b)) {
                return -1;
            } else if (fieldThree && resolve(fieldThree, a) > resolve(fieldThree, b)) {
                return 1;
            } else {
                return 0;
            }
        });
        return newArray;             
    }
}

function returnScreenHeaders(selection, screenId) {
    if (selection.project) {
        return selection.project.fieldnames.filter(function(element) {
            return (_.isEqual(element.screenId, screenId) && !!element.forShow); 
        });
    } else {
        return [];
    }
}


class TransportDocuments extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            projectId:'',
            screenId: '5cd2b643fd333616dc360b66',
            unlocked: false,
            screen: 'inspection',
            screenBodys: [],
            loaded: false,             
        };
        this.handleSelectionReload=this.handleSelectionReload.bind(this);
        this.toggleUnlock = this.toggleUnlock.bind(this);
        this.testBodys = this.testBodys.bind(this);
    }

    componentDidMount() {
        const { dispatch, location } = this.props;
        var qs = queryString.parse(location.search);
        if (qs.id) {
            this.setState({projectId: qs.id}),
            dispatch(projectActions.getById(qs.id));
        }
        dispatch(projectActions.getAll()); 
    }

    handleSelectionReload(event){
        const { dispatch, location } = this.props;
        var qs = queryString.parse(location.search);
        if (qs.id) {
            this.setState({projectId: qs.id}),
            dispatch(projectActions.getById(qs.id));
        }
        dispatch(projectActions.getAll());    
    }

    toggleUnlock(event) {
        event.preventDefault()
        const { unlocked } = this.state;
        this.setState({
            unlocked: !unlocked
        }, () => {
        });
    }

    testBodys(){
        const { selection } = this.props;
        const { screenId } = this.state;
        let screenHeaders = arraySorted(returnScreenHeaders(selection, screenId), 'forShow')
        if (selection.project) {
            let arryBody =[];
            arraySorted(selection.project.pos, 'clPo', 'clPoRev', 'clPoItem').map(po => {
                if (po.subs) {
                    po.subs.map(sub => {
                        let arryRow = [];
                        screenHeaders.map(screenHeader => {
                            if (screenHeader.fields.fromTbl == 'po') {
                                switch (screenHeader.fields.type) {
                                    case "String":
                                        arryRow.push({
                                            collection: screenHeader.fields.fromTbl,
                                            objectId: po._id,
                                            fieldName: screenHeader.fields.name,
                                            fieldValue: po[screenHeader.fields.name],
                                            disabled: screenHeader.edit,
                                            align: screenHeader.align,
                                            fieldType: "text",
                                        });
                                        break;
                                    case "Number":
                                        arryRow.push({
                                            collection: screenHeader.fields.fromTbl,
                                            objectId: po._id,
                                            fieldName: screenHeader.fields.name,
                                            fieldValue: po[screenHeader.fields.name],
                                            disabled: screenHeader.edit,
                                            align: screenHeader.align,
                                            fieldType: "number",
                                        });
                                        break;
                                    case "Date":                                       
                                        arryRow.push({
                                            collection: screenHeader.fields.fromTbl,
                                            objectId: po._id,
                                            fieldName: screenHeader.fields.name,
                                            fieldValue: po[screenHeader.fields.name],
                                            disabled: screenHeader.edit,
                                            align: screenHeader.align,
                                            fieldType: "date",
                                        });
                                        break;
                                    default:
                                        arryRow.push({
                                            collection: screenHeader.fields.fromTbl,
                                            objectId: po._id,
                                            fieldName: screenHeader.fields.name,
                                            fieldValue: po[screenHeader.fields.name],
                                            disabled: screenHeader.edit,
                                            align: screenHeader.align,
                                            fieldType: "text",
                                        });
                                }
                            } else if (screenHeader.fields.fromTbl == 'sub'){
                                switch (screenHeader.fields.type) {
                                    case "String":
                                        arryRow.push({
                                            collection: screenHeader.fields.fromTbl,
                                            objectId: sub._id,
                                            fieldName: screenHeader.fields.name,
                                            fieldValue: sub[screenHeader.fields.name],
                                            disabled: screenHeader.edit,
                                            align: screenHeader.align,
                                            fieldType: "text",
                                        });
                                        break;
                                    case "Number":
                                        arryRow.push({
                                            collection: screenHeader.fields.fromTbl,
                                            objectId: sub._id,
                                            fieldName: screenHeader.fields.name,
                                            fieldValue: sub[screenHeader.fields.name],
                                            disabled: screenHeader.edit,
                                            align: screenHeader.align,
                                            fieldType: "number",
                                        });
                                        break;
                                    case "Date":                                       
                                        arryRow.push({
                                            collection: screenHeader.fields.fromTbl,
                                            objectId: sub._id,
                                            fieldName: screenHeader.fields.name,
                                            fieldValue: sub[screenHeader.fields.name],
                                            disabled: screenHeader.edit,
                                            align: screenHeader.align,
                                            fieldType: "date",
                                        });
                                        break;
                                    default:
                                        arryRow.push({
                                            collection: screenHeader.fields.fromTbl,
                                            objectId: sub._id,
                                            fieldName: screenHeader.fields.name,
                                            fieldValue: sub[screenHeader.fields.name],
                                            disabled: screenHeader.edit,
                                            align: screenHeader.align,
                                            fieldType: "text",
                                        });
                                }
                            // } else if (screenHeader.fields.fromTbl == 'certificate'){
                            //     switch (screenHeader.fields.type) {
                            //         case "String":
                            //             arryRow.push({
                            //                 collection: screenHeader.fields.fromTbl,
                            //                 objectId: certificate._id,
                            //                 fieldName: screenHeader.fields.name,
                            //                 fieldValue: certificate[screenHeader.fields.name],
                            //                 disabled: screenHeader.edit,
                            //                 align: screenHeader.align,
                            //                 fieldType: "text",
                            //             });
                            //             break;
                            //         case "Number":
                            //             arryRow.push({
                            //                 collection: screenHeader.fields.fromTbl,
                            //                 objectId: certificate._id,
                            //                 fieldName: screenHeader.fields.name,
                            //                 fieldValue: certificate[screenHeader.fields.name],
                            //                 disabled: screenHeader.edit,
                            //                 align: screenHeader.align,
                            //                 fieldType: "number",
                            //             });
                            //             break;
                            //         case "Date":                                       
                            //             arryRow.push({
                            //                 collection: screenHeader.fields.fromTbl,
                            //                 objectId: certificate._id,
                            //                 fieldName: screenHeader.fields.name,
                            //                 fieldValue: certificate[screenHeader.fields.name],
                            //                 disabled: screenHeader.edit,
                            //                 align: screenHeader.align,
                            //                 fieldType: "date",
                            //             });
                            //             break;
                            //         default:
                            //             arryRow.push({
                            //                 collection: screenHeader.fields.fromTbl,
                            //                 objectId: certificate._id,
                            //                 fieldName: screenHeader.fields.name,
                            //                 fieldValue: certificate[screenHeader.fields.name],
                            //                 disabled: screenHeader.edit,
                            //                 align: screenHeader.align,
                            //                 fieldType: "text",
                            //             });
                            //     }
                            // } else if (screenHeader.fields.fromTbl == 'packitem'){
                            //     switch (screenHeader.fields.type) {
                            //         case "String":
                            //             arryRow.push({
                            //                 collection: screenHeader.fields.fromTbl,
                            //                 objectId: packitem._id,
                            //                 fieldName: screenHeader.fields.name,
                            //                 fieldValue: packitem[screenHeader.fields.name],
                            //                 disabled: screenHeader.edit,
                            //                 align: screenHeader.align,
                            //                 fieldType: "text",
                            //             });
                            //             break;
                            //         case "Number":
                            //             arryRow.push({
                            //                 collection: screenHeader.fields.fromTbl,
                            //                 objectId: packitem._id,
                            //                 fieldName: screenHeader.fields.name,
                            //                 fieldValue: packitem[screenHeader.fields.name],
                            //                 disabled: screenHeader.edit,
                            //                 align: screenHeader.align,
                            //                 fieldType: "number",
                            //             });
                            //             break;
                            //         case "Date":                                       
                            //             arryRow.push({
                            //                 collection: screenHeader.fields.fromTbl,
                            //                 objectId: packitem._id,
                            //                 fieldName: screenHeader.fields.name,
                            //                 fieldValue: packitem[screenHeader.fields.name],
                            //                 disabled: screenHeader.edit,
                            //                 align: screenHeader.align,
                            //                 fieldType: "date",
                            //             });
                            //             break;
                            //         default:
                            //             arryRow.push({
                            //                 collection: screenHeader.fields.fromTbl,
                            //                 objectId: packitem._id,
                            //                 fieldName: screenHeader.fields.name,
                            //                 fieldValue: packitem[screenHeader.fields.name],
                            //                 disabled: screenHeader.edit,
                            //                 align: screenHeader.align,
                            //                 fieldType: "text",
                            //             });
                            //     }
                            // } else if (screenHeader.fields.fromTbl == 'collipack'){
                            //     switch (screenHeader.fields.type) {
                            //         case "String":
                            //             arryRow.push({
                            //                 collection: screenHeader.fields.fromTbl,
                            //                 objectId: collipack._id,
                            //                 fieldName: screenHeader.fields.name,
                            //                 fieldValue: collipack[screenHeader.fields.name],
                            //                 disabled: screenHeader.edit,
                            //                 align: screenHeader.align,
                            //                 fieldType: "text",
                            //             });
                            //             break;
                            //         case "Number":
                            //             arryRow.push({
                            //                 collection: screenHeader.fields.fromTbl,
                            //                 objectId: collipack._id,
                            //                 fieldName: screenHeader.fields.name,
                            //                 fieldValue: collipack[screenHeader.fields.name],
                            //                 disabled: screenHeader.edit,
                            //                 align: screenHeader.align,
                            //                 fieldType: "number",
                            //             });
                            //             break;
                            //         case "Date":                                       
                            //             arryRow.push({
                            //                 collection: screenHeader.fields.fromTbl,
                            //                 objectId: collipack._id,
                            //                 fieldName: screenHeader.fields.name,
                            //                 fieldValue: collipack[screenHeader.fields.name],
                            //                 disabled: screenHeader.edit,
                            //                 align: screenHeader.align,
                            //                 fieldType: "date",
                            //             });
                            //             break;
                            //         default:
                            //             arryRow.push({
                            //                 collection: screenHeader.fields.fromTbl,
                            //                 objectId: collipack._id,
                            //                 fieldName: screenHeader.fields.name,
                            //                 fieldValue: collipack[screenHeader.fields.name],
                            //                 disabled: screenHeader.edit,
                            //                 align: screenHeader.align,
                            //                 fieldType: "text",
                            //             });
                            //     }
                            } else {
                                arryRow.push({});
                            }
                        }); //packitem //collipack
                        let objectRow  = { _id: sub._id, fields: arryRow }
                        arryBody.push(objectRow);
                    });
                }
            });
            this.setState({
                screenBodys: arryBody,
                loaded: true
            });
        } else {
            this.setState({
                screenBodys: [],
                loaded: true
            });
        }
    }

    render() {
        const { screen, screenId, screenBodys, unlocked, loaded }= this.state;
        const { alert, selection } = this.props;
        { selection.project && loaded == false && this.testBodys()}
        return (
            <Layout alert={this.props.alert} accesses={selection.project && selection.project.accesses}>
                {alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div>}
                <h2>Shipping - Transport docs : {selection.project ? selection.project.name : <FontAwesomeIcon icon="spinner" className="fa-pulse fa-1x fa-fw" />}</h2>
                <hr />
                <div id="transportdocs" className="full-height">
                    {selection && selection.project && 
                        <ProjectTable
                            screenHeaders={arraySorted(returnScreenHeaders(selection, screenId), "forShow")}
                            screenBodys={screenBodys}
                            screenId={screenId}
                            handleSelectionReload={this.handleSelectionReload}
                            toggleUnlock={this.toggleUnlock}
                            unlocked={unlocked}
                            screen={screen}
                            screenBodys={screenBodys}
                        />
                    }
                </div> 
            </Layout>
        );
    }
}

function mapStateToProps(state) {
    const { alert, selection } = state;
    return {
        alert,
        selection
    };
}

const connectedTransportDocuments = connect(mapStateToProps)(TransportDocuments);
export { connectedTransportDocuments as TransportDocuments };