import React from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';
import config from 'config';
import { saveAs } from 'file-saver';
import { authHeader } from '../../../_helpers';
import { 
    accessActions, 
    alertActions, 
    docdefActions, 
    fieldnameActions,
    fieldActions,
    poActions, 
    projectActions 
} from '../../../_actions';
import Layout from '../../../_components/layout';
import ProjectTable from '../../../_components/project-table/project-table';
import ProjectTableNew from '../../../_components/project-table/project-table-new';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import HeaderInput from '../../../_components/project-table/header-input';
import _ from 'lodash';

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

function docConf(array) {
    const tpeOf = [
        '5d1927121424114e3884ac7e', //ESR01 Expediting status report
        // '5d1927131424114e3884ac80', //PL01 Packing List
        // '5d1927141424114e3884ac84', //SM01 Shipping Mark
        // '5d1927131424114e3884ac81', //PN01 Packing Note
        // '5d1927141424114e3884ac83' //SI01 Shipping Invoice
        // '5d1927131424114e3884ac7f' //NFI1 Notification for Inspection
    ];
    return array.filter(function (element) {
        return tpeOf.includes(element.doctypeId);
    });
}

function findObj(array, search) {
    if (!_.isEmpty(array) && search) {
        return array.find((function(element) {
            return _.isEqual(element._id, search);
        }));
    } else {
        return {};
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

function generateScreenHeader(fieldnames, screenId) {
    if (!_.isUndefined(fieldnames) && fieldnames.hasOwnProperty('items') && !_.isEmpty(fieldnames.items)) {
        return fieldnames.items.filter(function(element) {
            return (_.isEqual(element.screenId, screenId) && !!element.forShow); 
        });
    } else {
        return [];
    }
}

function generateScreenBody(screenId, fieldnames, pos){
    // const { screenId, unlocked } = this.state;
    let arrayBody = [];
    let arrayRow = [];
    let objectRow = {};
    let hasPackitems = getScreenTbls(fieldnames).includes('packitem');
    let hasCertificates = getScreenTbls(fieldnames).includes('certificate');
    let screenHeaders = arraySorted(generateScreenHeader(fieldnames, screenId), 'forShow');
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

class Overview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            projectId:'',
            screenId: '5cd2b642fd333616dc360b63',
            unlocked: false,
            screen: 'expediting',
            selectedTemplate: '0',
            selectedField: '',
            updateValue:'',
            alert: {
                type:'',
                message:''
            }

        };
        this.handleClearAlert = this.handleClearAlert.bind(this);
        this.handleSelectionReload=this.handleSelectionReload.bind(this);
        this.toggleUnlock = this.toggleUnlock.bind(this);
        // this.testBodys = this.testBodys.bind(this);
        this.handleChange=this.handleChange.bind(this);
        this.handleGenerateFile = this.handleGenerateFile.bind(this);
        this.handleUpdateValue = this.handleUpdateValue.bind(this);
        this.handleSplitLine = this.handleSplitLine.bind(this);
    }



    componentDidMount() {
        const { 
            dispatch,
            loadingAccesses,
            loadingDocdefs,
            loadingFieldnames,
            loadingFields,
            loadingPos,
            loadingSelection,
            location 
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
            loadingDocdefs,
            loadingFieldnames,
            loadingFields,
            loadingPos,
            loadingSelection,
            location 
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

    handleChange(event) {
        event.preventDefault();
        const name =  event.target.name;
        const value =  event.target.value;
        this.setState({
            [name]: value
        });
    }

    handleGenerateFile(event) {
        event.preventDefault();
        const { docdefs } = this.props;
        const { selectedTemplate } = this.state;
        if (selectedTemplate != "0") {
            let obj = findObj(docdefs.items, selectedTemplate);
             if (obj) {
                const requestOptions = {
                    method: 'GET',
                    headers: { ...authHeader(), 'Content-Type': 'application/json'},
                };
                return fetch(`${config.apiUrl}/template/generate?docDef=${selectedTemplate}`, requestOptions)
                    .then(res => res.blob()).then(blob => saveAs(blob, obj.field));
             }
        }
    }

    selectedFieldOptions(fieldnames, fields, screenId) {
        if (fieldnames.items && fields.items) {
            let screenHeaders = generateScreenHeader(fieldnames, screenId);
            let fieldIds = screenHeaders.reduce(function (accumulator, currentValue) {
                if (accumulator.indexOf(currentValue.fieldId) === -1 ) {
                    accumulator.push(currentValue.fieldId);
                }
                return accumulator;
            }, []);
            let fieldsFromHeader = fields.items.reduce(function (accumulator, currentValue) {
                if (fieldIds.indexOf(currentValue._id) !== -1) {
                    accumulator.push({ 
                        value: currentValue._id,
                        name: currentValue.custom
                    });
                }
                return accumulator;
            }, []);
            return arraySorted(fieldsFromHeader, 'name').map(field => {
                return (
                    <option 
                        key={field.value}
                        value={field.value}>{field.name}
                    </option>                
                );
            });
        }
    }

    handleUpdateValue(event) {
        event.preventDefault();
    }

    handleSplitLine(event) {
        event.preventDefault();
    }

    render() {
        const { 
            projectId, 
            screen, 
            screenId, 
            unlocked, 
            selectedTemplate, 
            selectedField, 
            updateValue,
        }= this.state;

        const { accesses, docdefs, fieldnames, fields, pos, selection } = this.props;
        const alert = this.state.alert ? this.state.alert : this.props.alert;

        return (
            <Layout alert={alert} accesses={accesses}>
                {alert.message && 
                    <div className={`alert ${alert.type}`}>{alert.message}
                        <button className="close" onClick={(event) => this.handleClearAlert(event)}>
                            <span aria-hidden="true"><FontAwesomeIcon icon="times"/></span>
                        </button>
                    </div>
                }
                <h2>Overview : {selection.project ? selection.project.name : <FontAwesomeIcon icon="spinner" className="fa-pulse fa-1x fa-fw" />}</h2>
                <hr />
                <div id="overview" className="full-height">
                    <div className="action-row row ml-1 mb-2 mr-1" style={{height: '34px'}}> {/*, marginBottom: '10px' */}
                        <button className="btn btn-leeuwen btn-lg mr-2" style={{height: '34px'}} onClick={event => this.handleSplitLine(event)}>
                            <span><FontAwesomeIcon icon="page-break" className="fa-lg mr-2"/>Split line</span>
                        </button>
                        <div
                            className="col"
                            style={{marginLeft:'0px', marginRight: '0px', paddingLeft: '0px', paddingRight: '0px'}}
                        >
                            <div className="input-group">
                                    <select className="form-control" name="selectedField" value={selectedField} placeholder="Select field..." onChange={this.handleChange}>
                                        <option key="0" value="0">Select field...</option>
                                        {this.selectedFieldOptions(fieldnames, fields, screenId)}
                                    </select>
                                <input className="form-control" name="updateValue" value={updateValue} onChange={this.handleChange}/>
                                <div className="input-group-append mr-2">
                                    <button className="btn btn-outline-leeuwen-blue btn-lg" onClick={event => this.handleUpdateValue(event)}>  {/* onClick={(event) => this.handleOnclick(event, selectedTemplate)} */}
                                        <span><FontAwesomeIcon icon="edit" className="fa-lg mr-2"/>Update</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div
                            className="col"
                            style={{marginLeft:'0px', marginRight: '0px', paddingLeft: '0px', paddingRight: '0px'}}
                        >
                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" style={{width: '95px'}}>Select Document</span>
                                </div>
                                <select className="form-control" name="selectedTemplate" value={selectedTemplate} placeholder="Select document..." onChange={this.handleChange}>
                                    <option key="0" value="0">Select document...</option>
                                {
                                    docdefs.items && arraySorted(docConf(docdefs.items), "name").map((p) =>  {        
                                        return (
                                            <option 
                                                key={p._id}
                                                value={p._id}>{p.name}
                                            </option>
                                        );
                                    })
                                }
                                </select>
                                <div className="input-group-append">
                                    <button className="btn btn-outline-leeuwen-blue btn-lg" onClick={event => this.handleGenerateFile(event)}>  {/* onClick={(event) => this.handleOnclick(event, selectedTemplate)} */}
                                        <span><FontAwesomeIcon icon="file-excel" className="fa-lg mr-2"/>Generate</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="" style={{height: 'calc(100% - 44px)'}}>
                        {fieldnames.items && 
                            <ProjectTable
                                screenHeaders={arraySorted(generateScreenHeader(fieldnames, screenId), "forShow")}
                                screenBodys={generateScreenBody(screenId, fieldnames, pos)}
                                screenId={screenId}
                                projectId={projectId}
                                handleSelectionReload={this.handleSelectionReload}
                                toggleUnlock={this.toggleUnlock}
                                unlocked={unlocked}
                                screen={screen}
                                fieldnames={fieldnames}
                            />
                        }
                    </div>
                </div>
            </Layout>
        );
    }
}

function mapStateToProps(state) {
    const { accesses, alert, docdefs, fieldnames, fields, pos, selection } = state;
    const { loadingAccesses } = accesses;
    const { loadingDocdefs } = docdefs;
    const { loadingFieldnames } = fieldnames;
    const { loadingFields } = fields;
    const { loadingPos } = pos;
    const { loadingSelection } = selection;
    return {
        accesses,
        alert,
        docdefs,
        fieldnames,
        fields,
        loadingAccesses,
        loadingDocdefs,
        loadingFields,
        loadingFieldnames,
        loadingPos,
        loadingSelection,
        pos,
        selection
    };
}

const connectedOverview = connect(mapStateToProps)(Overview);
export { connectedOverview as Overview };