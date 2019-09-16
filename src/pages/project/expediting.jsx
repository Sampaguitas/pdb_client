import React from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';
import { projectActions } from '../../_actions';
import Layout from '../../_components/layout';
import config from 'config';
import { saveAs } from 'file-saver';
import { authHeader } from '../../_helpers';
import ProjectTable from '../../_components/project-table/project-table';
import ProjectTableNew from '../../_components/project-table/project-table-new';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import HeaderInput from '../../_components/project-table/header-input';

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

function returnScreenHeaders(selection, screenId) {
    if (selection.project) {
        return selection.project.fieldnames.filter(function(element) {
            return (_.isEqual(element.screenId, screenId) && !!element.forShow); 
        });
    } else {
        return [];
    }
}

class Expediting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            projectId:'',
            screenId: '5cd2b642fd333616dc360b63',
            unlocked: false,
            screen: 'expediting',
            screenBodys: [],
            loaded: false,
            selectedTemplate: '0',
            selectedField: '',
            updateValue:'',

        };
        this.handleSelectionReload=this.handleSelectionReload.bind(this);
        this.toggleUnlock = this.toggleUnlock.bind(this);
        this.testBodys = this.testBodys.bind(this);
        this.handleChange=this.handleChange.bind(this);
        this.handleGenerateFile = this.handleGenerateFile.bind(this);
        this.handleUpdateValue = this.handleUpdateValue.bind(this);
        this.handleSplitLine = this.handleSplitLine.bind(this);
    }



    componentDidMount() {
        const { dispatch, location } = this.props;
        var qs = queryString.parse(location.search);
        if (qs.id) {
            this.setState({projectId: qs.id}),
            dispatch(projectActions.getById(qs.id));
        } 
    }

    handleSelectionReload(event){
        const { dispatch, location } = this.props;
        var qs = queryString.parse(location.search);
        if (qs.id) {
            this.setState({projectId: qs.id}),
            dispatch(projectActions.getById(qs.id));
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
        const { selection } = this.props;
        const { screenId, unlocked } = this.state;
        let screenHeaders = arraySorted(returnScreenHeaders(selection, screenId), 'forShow')
        if (selection.project) {
            let arrayBody =[];
            arraySorted(selection.project.pos, 'clPo', 'clPoRev', 'clPoItem').map(po => {
                if (po.subs) {
                    po.subs.map(sub => {
                        let arrayRow = [];
                        screenHeaders.map(screenHeader => {
                            if (screenHeader.fields.fromTbl == 'po') {
                                switch (screenHeader.fields.type) {
                                    case "String":
                                        arrayRow.push({
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
                                        arrayRow.push({
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
                                        arrayRow.push({
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
                                        arrayRow.push({
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
                                        arrayRow.push({
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
                                        arrayRow.push({
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
                                        arrayRow.push({
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
                                        arrayRow.push({
                                            collection: screenHeader.fields.fromTbl,
                                            objectId: sub._id,
                                            fieldName: screenHeader.fields.name,
                                            fieldValue: sub[screenHeader.fields.name],
                                            disabled: screenHeader.edit,
                                            align: screenHeader.align,
                                            fieldType: "text",
                                        });
                                }
                            } else {
                                arrayRow.push({});
                            }
                        });
                        let objectRow  = { _id: sub._id, fields: arrayRow }
                        arrayBody.push(objectRow);
                    });
                }
            });
            this.setState({
                screenBodys: arrayBody,
                loaded: true
            });
        } else {
            this.setState({
                screenBodys: [],
                loaded: true
            });
        }
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
        const { selection } = this.props;
        const { selectedTemplate } = this.state;
        console.log('selectedTemplate:',selectedTemplate);
        if (selectedTemplate != "0") {
            let obj = findObj(selection.project.docdefs,selectedTemplate);
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

    selectedFieldOptions(selection, screenId) {
        if (selection.project) {
            let screenHeaders = returnScreenHeaders(selection, screenId);
            let fieldIds = screenHeaders.reduce(function (accumulator, currentValue) {
                if (accumulator.indexOf(currentValue.fieldId) === -1 ) {
                    accumulator.push(currentValue.fieldId);
                }
                return accumulator;
            }, []);
            let fields = selection.project.fields.reduce(function (accumulator, currentValue) {
                if (fieldIds.indexOf(currentValue._id) !== -1) {
                    accumulator.push({ 
                        value: currentValue._id,
                        name: currentValue.custom
                    });
                }
                return accumulator;
            }, []);
            return arraySorted(fields, 'name').map(field => {
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
        const { screen, screenId, screenBodys, unlocked, loaded, selectedTemplate, selectedField, updateValue }= this.state;
        const { alert, selection } = this.props;
        { selection.project && loaded == false && this.testBodys()}
        return (
            <Layout alert={this.props.alert} accesses={selection.project && selection.project.accesses}>
                {alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div>}
                <h2>Expediting : {selection.project ? selection.project.name : <FontAwesomeIcon icon="spinner" className="fa-pulse fa-1x fa-fw" />}</h2>
                <hr />
                <div id="expediting" className="full-height">
                    <div className="action-row row ml-1 mb-2" style={{height: '34px', marginRight: '56px'}}> {/*, marginBottom: '10px' */}
                        <button className="btn btn-leeuwen btn-lg mr-2" style={{height: '34px'}} onClick={event => this.handleSplitLine(event)}>
                            <span><FontAwesomeIcon icon="page-break" className="fa-lg mr-2"/>Split line</span>
                        </button>
                        <div
                            className="col"
                            style={{marginLeft:'0px', marginRight: '0px', paddingLeft: '0px', paddingRight: '0px'}}
                        >
                            <div className="input-group">
                                    <select className="form-control" name="selectedField" value={selectedField} defaultValue="0" placeholder="Select field..." onChange={this.handleChange}>
                                        <option key="0" value="0">Select field...</option>
                                        {this.selectedFieldOptions(selection, screenId)}
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
                                <select className="form-control" name="selectedTemplate" value={selectedTemplate} defaultValue="0" placeholder="Select document..." onChange={this.handleChange}>
                                    <option key="0" value="0">Select document...</option>
                                {
                                    selection.project && arraySorted(docConf(selection.project.docdefs), "name").map((p) =>  {        
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
                        {selection && selection.project && 
                            <ProjectTable
                                screenHeaders={arraySorted(returnScreenHeaders(selection, screenId), "forShow")}
                                screenBodys={screenBodys}
                                screenId={screenId}
                                handleSelectionReload={this.handleSelectionReload}
                                toggleUnlock={this.toggleUnlock}
                                unlocked={unlocked}
                                screen={screen}
                            />
                        }
                    </div>
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

const connectedExpediting = connect(mapStateToProps)(Expediting);
export { connectedExpediting as Expediting };