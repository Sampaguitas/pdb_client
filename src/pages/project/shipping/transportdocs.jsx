import React from 'react';
import { connect } from 'react-redux';
import Layout from '../../../_components/layout';
import queryString from 'query-string';
import { authHeader } from '../../../_helpers';
import config from 'config';
import { 
    accessActions, 
    alertActions,
    fieldnameActions,
    fieldActions,
    poActions,
    projectActions 
} from '../../../_actions';
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
    if (!_.isUndefined(fieldnames) && fieldnames.hasOwnProperty('items') && !_.isEmpty(fieldnames.items)) {
        return fieldnames.items.filter(function(element) {
            return (_.isEqual(element.screenId, screenId) && !!element.forShow); 
        });
    } else {
        return [];
    }
}

function getScreenTbls (fieldnames) {
    if (!_.isUndefined(fieldnames) && fieldnames.hasOwnProperty('items') && !_.isEmpty(fieldnames.items)) {
        return fieldnames.items.reduce(function (accumulator, currentValue) {
            if(!accumulator.includes(currentValue.fields.fromTbl)) {
                accumulator.push(currentValue.fields.fromTbl)
            }
            return accumulator;
        },[]);
    } else {
        return [];
    }
    
}

function getInputType(dbFieldType) {
    switch(dbFieldType) {
        case 'Number': return 'number';
        case 'Date': return 'date';
        default: return 'text'
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
            // screenBodys: [],
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

    testBodys(fieldnames, pos){
        const { screenId, unlocked } = this.state;
        let arrayBody = [];
        let arrayRow = [];
        let objectRow = {};
        let hasPackitems = getScreenTbls(fieldnames).includes('packitem');
        let hasCertificates = getScreenTbls(fieldnames).includes('certificate');
        let screenHeaders = arraySorted(returnScreenHeaders(fieldnames, screenId), 'forShow');
        let i = 1;
        if (!_.isUndefined(pos) && pos.hasOwnProperty('items') && !_.isEmpty(pos.items)) {
            pos.items.map(po => {
                if (po.subs) {
                    po.subs.map(sub => {
                        if (!_.isEmpty(sub.packitems) && hasPackitems) {
                            sub.packitems.map(packitem => {
                                arrayRow = [];
                                screenHeaders.map(screenHeader => {
                                    switch(screenHeader.fields.fromTbl) {
                                        case 'po':
                                            arrayRow.push({
                                                collection: 'po',
                                                objectId: po._id,
                                                fieldName: screenHeader.fields.name,
                                                fieldValue: po[screenHeader.fields.name],
                                                disabled: screenHeader.edit,
                                                align: screenHeader.align,
                                                fieldType: getInputType(screenHeader.fields.type),
                                            });
                                            break;
                                        case 'sub':
                                            arrayRow.push({
                                                collection: 'sub',
                                                objectId: sub._id,
                                                fieldName: screenHeader.fields.name,
                                                fieldValue: sub[screenHeader.fields.name],
                                                disabled: screenHeader.edit,
                                                align: screenHeader.align,
                                                fieldType: getInputType(screenHeader.fields.type),
                                            });
                                            break;
                                        case 'packitem':
                                            arrayRow.push({
                                                collection: 'packitem',
                                                objectId: packitem._id,
                                                fieldName: screenHeader.fields.name,
                                                fieldValue: packitem[screenHeader.fields.name],
                                                disabled: screenHeader.edit,
                                                align: screenHeader.align,
                                                fieldType: getInputType(screenHeader.fields.type),
                                            });
                                            break;
                                        default: arrayRow.push({}); 
                                    }
                                });
                                objectRow  = { _id: i, fields: arrayRow }
                                arrayBody.push(objectRow);
                                i++;
                            })
                        } else if (!_.isEmpty(sub.certificates) && hasCertificates){
                            sub.certificates.map(certificate => {
                                arrayRow = [];
                                screenHeaders.map(screenHeader => {
                                    switch(screenHeader.fields.fromTbl) {
                                        case 'po':
                                            arrayRow.push({
                                                collection: 'po',
                                                objectId: po._id,
                                                fieldName: screenHeader.fields.name,
                                                fieldValue: po[screenHeader.fields.name],
                                                disabled: screenHeader.edit,
                                                align: screenHeader.align,
                                                fieldType: getInputType(screenHeader.fields.type),
                                            });
                                            break;
                                        case 'sub':
                                            arrayRow.push({
                                                collection: 'sub',
                                                objectId: sub._id,
                                                fieldName: screenHeader.fields.name,
                                                fieldValue: sub[screenHeader.fields.name],
                                                disabled: screenHeader.edit,
                                                align: screenHeader.align,
                                                fieldType: getInputType(screenHeader.fields.type),
                                            });
                                            break;
                                        case 'certificate':
                                            arrayRow.push({
                                                collection: 'certificate',
                                                objectId: certificate._id,
                                                fieldName: screenHeader.fields.name,
                                                fieldValue: certificate[screenHeader.fields.name],
                                                disabled: screenHeader.edit,
                                                align: screenHeader.align,
                                                fieldType: getInputType(screenHeader.fields.type),
                                            });
                                            break;
                                        default: arrayRow.push({}); 
                                    }
                                });
                                objectRow  = { _id: i, fields: arrayRow }
                                arrayBody.push(objectRow);
                                i++;
                            });
                        } else {
                            arrayRow = [];
                            screenHeaders.map(screenHeader => {
                                switch(screenHeader.fields.fromTbl) {
                                    case 'po':
                                        arrayRow.push({
                                            collection: 'po',
                                            objectId: po._id,
                                            fieldName: screenHeader.fields.name,
                                            fieldValue: po[screenHeader.fields.name],
                                            disabled: screenHeader.edit,
                                            align: screenHeader.align,
                                            fieldType: getInputType(screenHeader.fields.type),
                                        });
                                        break;
                                    case 'sub':
                                        arrayRow.push({
                                            collection: 'sub',
                                            objectId: sub._id,
                                            fieldName: screenHeader.fields.name,
                                            fieldValue: sub[screenHeader.fields.name],
                                            disabled: screenHeader.edit,
                                            align: screenHeader.align,
                                            fieldType: getInputType(screenHeader.fields.type),
                                        });
                                        break;
                                    default: arrayRow.push({}); 
                                }
                            });
                            objectRow  = { _id: i, fields: arrayRow }
                            arrayBody.push(objectRow);
                            i++;
                        }
                    })
                }
            });
            return arrayBody;
        } else {
            return [];
        }
        
    }

    render() {
        const { 
            projectId, 
            screen, 
            screenId, 
            // screenBodys, 
            unlocked, 
            loaded 
        }= this.state;
        const { accesses, alert, fieldnames, fields, pos, selection } = this.props;
        // {pos.items && fieldnames.items && loaded == false && this.testBodys()}
        return (
            <Layout alert={alert} accesses={accesses}>
                {alert.message && 
                    <div className={`alert ${alert.type}`}>{alert.message}
                        <button className="close" onClick={(event) => this.handleClearAlert(event)}>
                            <span aria-hidden="true"><FontAwesomeIcon icon="times"/></span>
                        </button>
                    </div>
                }
                <h2>Shipping - Transport docs : {selection.project ? selection.project.name : <FontAwesomeIcon icon="spinner" className="fa-pulse fa-1x fa-fw" />}</h2>
                <hr />
                <div id="transportdocs" className="full-height">
                    {selection && selection.project && 
                        <ProjectTable
                            screenHeaders={arraySorted(returnScreenHeaders(fieldnames, screenId), "forShow")}
                            screenBodys={this.testBodys(fieldnames, pos)}
                            // screenBodys={screenBodys}
                            projectId={projectId}
                            screenId={screenId}
                            handleSelectionReload={this.handleSelectionReload}
                            toggleUnlock={this.toggleUnlock}
                            unlocked={unlocked}
                            screen={screen}
                            // screenBodys={screenBodys}
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
        loadingFields,
        loadingPos,
        loadingSelection,
        pos,
        selection
    };
}

const connectedTransportDocuments = connect(mapStateToProps)(TransportDocuments);
export { connectedTransportDocuments as TransportDocuments };