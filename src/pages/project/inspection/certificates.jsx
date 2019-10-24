import React from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';
import { 
    accessActions, 
    alertActions,
    fieldnameActions,
    fieldActions,
    poActions,
    projectActions 
} from '../../../_actions';
import Layout from '../../../_components/layout';
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

function returnScreenHeaders(fieldnames, screenId) {
    if (fieldnames.items) {
        return fieldnames.items.filter(function(element) {
            return (_.isEqual(element.screenId, screenId) && !!element.forShow); 
        });
    } else {
        return [];
    }
}


class Certificates extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            projectId:'',
            screenId: '5cd2b642fd333616dc360b65',
            unlocked: false,
            screen: 'certificates',
            screenBodys: [],
            loaded: false,  
        };
        this.handleClearAlert = this.handleClearAlert.bind(this);
        this.handleSelectionReload=this.handleSelectionReload.bind(this);
        this.toggleUnlock = this.toggleUnlock.bind(this);
        this.testBodys = this.testBodys.bind(this);
    }

    componentDidMount() {
        const { 
            dispatch,
            loadingAccesses,
            loadingFieldnames,
            loadingFields,
            loadingPos,
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
            if (!loadingFieldnames) {
                dispatch(fieldnameActions.getAll(qs.id));
            }
            if (!loadingFields) {
                dispatch(fieldActions.getAll(qs.id));
            }
            if (!loadingPos) {
                dispatch(poActions.getAll(qs.id));
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

    handleSelectionReload(event){
        const { 
            dispatch,
            loadingAccesses,
            loadingFieldnames,
            loadingFields,
            loadingPos,
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
            if (!loadingFieldnames) {
                dispatch(fieldnameActions.getAll(qs.id));
            }
            if (!loadingFields) {
                dispatch(fieldActions.getAll(qs.id));
            }
            if (!loadingPos) {
                dispatch(poActions.getAll(qs.id));
            }
            if (!loadingSelection) {
                dispatch(projectActions.getById(qs.id));
            }
        }
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
        const { pos, fieldnames } = this.props;
        const { screenId } = this.state;
        let screenHeaders = arraySorted(returnScreenHeaders(fieldnames, screenId), 'forShow')
        if (pos.items) {
            let arryBody =[];
            arraySorted(pos.items, 'clPo', 'clPoRev', 'clPoItem').map(po => {
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
        const { projectId, screen, screenId, screenBodys, unlocked, loaded }= this.state;
        
        const { accesses, alert, fieldnames, fields, pos, selection } = this.props;

        {pos.items && fieldnames.items && loaded == false && this.testBodys()}
        return (
            <Layout alert={alert} accesses={accesses}>
                {alert.message && 
                    <div className={`alert ${alert.type}`}>{alert.message}
                        <button className="close" onClick={(event) => this.handleClearAlert(event)}>
                            <span aria-hidden="true"><FontAwesomeIcon icon="times"/></span>
                        </button>
                    </div>
                }
                <h2>Inspection - Certificates : {selection.project ? selection.project.name : <FontAwesomeIcon icon="spinner" className="fa-pulse fa-1x fa-fw" />}</h2>
                <hr />
                <div id="certificates" className="full-height">
                    {selection && selection.project && 
                        <ProjectTable
                            screenHeaders={arraySorted(returnScreenHeaders(fieldnames, screenId), "forShow")}
                            screenBodys={screenBodys}
                            projectId={projectId}
                            screenId={screenId}
                            handleSelectionReload={this.handleSelectionReload}
                            toggleUnlock={this.toggleUnlock}
                            unlocked={unlocked}
                            screen={screen}
                            screenBodys={screenBodys}
                            fieldnames={fieldnames}
                            fields={fields}
                        />
                    }
                </div> 
            </Layout>
        );
    }
}

function mapStateToProps(state) {
    const { accesses, alert, fieldnames, fields, pos, selection } = state;
    const { loadingAccesses } = accesses;
    const { loadingFieldnames } = fieldnames;
    const { loadingFields } = fields;
    const { loadingPos } = pos;
    const { loadingSelection } = selection;
    return {
        accesses,
        alert,
        fieldnames,
        fields,
        loadingAccesses,
        loadingFieldnames,
        loadingFields,
        loadingPos,
        loadingSelection,
        pos,
        selection
    };
}

const connectedCertificates = connect(mapStateToProps)(Certificates);
export { connectedCertificates as Certificates };