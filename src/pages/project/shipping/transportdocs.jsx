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

const locale = Intl.DateTimeFormat().resolvedOptions().locale;
const options = Intl.DateTimeFormat(locale, {'year': 'numeric', 'month': '2-digit', day: '2-digit'})
const myLocale = Intl.DateTimeFormat(locale, options);

function getDateFormat(myLocale) {
    let tempDateFormat = ''
    myLocale.formatToParts().map(function (element) {
        switch(element.type) {
            case 'month': 
                tempDateFormat = tempDateFormat + 'MM';
                break;
            case 'literal': 
                tempDateFormat = tempDateFormat + element.value;
                break;
            case 'day': 
                tempDateFormat = tempDateFormat + 'DD';
                break;
            case 'year': 
                tempDateFormat = tempDateFormat + 'YYYY';
                break;
        }
    });
    return tempDateFormat;
}

function TypeToString (fieldValue, fieldType, myDateFormat) {
    if (fieldValue) {
        switch (fieldType) {
            case 'Date': return String(moment(fieldValue).format(myDateFormat));
            case 'Number': return String(new Intl.NumberFormat().format(fieldValue)); 
            default: return fieldValue;
        }
    } else {
        return '';
    }
}

function DateToString (fieldValue, fieldType, myDateFormat) {
    if (fieldValue) {
        switch (fieldType) {
            case 'date': return String(moment(fieldValue).format(myDateFormat)); 
            default: return fieldValue;
        }
    } else {
        return '';
    }
}

function StringToDate (fieldValue, fieldType, myDateFormat) {
    if (fieldValue) {
        switch (fieldType) {
            case 'date': return moment(fieldValue, myDateFormat).toDate();
            default: return fieldValue;
        }
    } else {
        return '';
    }
}

function isValidFormat (fieldValue, fieldType, myDateFormat) {
    if (fieldValue) {
        switch (fieldType) {
            case 'date': return moment(fieldValue, myDateFormat, true).isValid();
            default: return true;
        }
    } else {
        return true;
    }
    
}

function getObjectIds(collection, selectedIds) {
    if (!_.isEmpty(selectedIds)) {
        switch(collection) {
            case 'po': return selectedIds.reduce(function(acc, curr) {
                if(!acc.includes(curr.poId)) {
                    acc.push(curr.poId);
                }
                return acc;
            }, []);
            case 'sub': return selectedIds.reduce(function(acc, curr) {
                if(!acc.includes(curr.subId)) {
                    acc.push(curr.subId);
                }
                return acc;
            }, []);
            case 'certificate': return selectedIds.reduce(function(acc, curr) {
                if(!acc.includes(curr.certificateId)) {
                    acc.push(curr.certificateId);
                }
                return acc;
            }, []);
            case 'packitem': return selectedIds.reduce(function(acc, curr) {
                if(!acc.includes(curr.packItemId)) {
                    acc.push(curr.packItemId);
                }
                return acc;
            }, []);
            case 'collipack': return selectedIds.reduce(function(acc, curr) {
                if(!acc.includes(curr.colliPackId)) {
                    acc.push(curr.colliPackId);
                }
                return acc;
            }, []);
            default: return [];
        }
    } else {
        return [];
    }
}


// function arrayRemove(arr, value) {

//     return arr.filter(function(ele){
//         return ele != value;
//     });
 
//  }

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

function getInputType(dbFieldType) {
    switch(dbFieldType) {
        case 'Number': return 'number';
        case 'Date': return 'date';
        default: return 'text'
    }
}

function generateScreenBody(screenId, fieldnames, pos){
    let arrayBody = [];
    let arrayRow = [];
    let objectRow = {};
    let hasPackitems = getScreenTbls(fieldnames).includes('packitem');
    // let hasCertificates = getScreenTbls(fieldnames).includes('certificate');
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
                                    default: arrayRow.push({
                                        collection: 'virtual',
                                        objectId: '0',
                                        fieldName: screenHeader.fields.name,
                                        fieldValue: '',
                                        disabled: screenHeader.edit,
                                        align: screenHeader.align,
                                        fieldType: getInputType(screenHeader.fields.type),
                                    });
                                }
                            });
                            
                            objectRow  = {
                                _id: i, 
                                tablesId: { 
                                    poId: po._id,
                                    subId: sub._id,
                                    certificateId: '',
                                    packItemId: packitem._id,
                                    colliPackId: '' 
                                },
                                fields: arrayRow
                            };
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
                                default: arrayRow.push({
                                    collection: 'virtual',
                                    objectId: '0',
                                    fieldName: screenHeader.fields.name,
                                    fieldValue: '',
                                    disabled: screenHeader.edit,
                                    align: screenHeader.align,
                                    fieldType: getInputType(screenHeader.fields.type),
                                }); 
                            }
                        });
                        objectRow  = {
                            _id: i, 
                            tablesId: { 
                                poId: po._id,
                                subId: sub._id,
                                certificateId: '',
                                packItemId: '',
                                colliPackId: '' 
                            },
                            fields: arrayRow
                        };
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

class TransportDocuments extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            projectId:'',
            screenId: '5cd2b643fd333616dc360b66',
            unlocked: false,
            screen: 'inspection',
            selectedIds: [],
            // selectedTemplate: '0',
            selectedField: '',
            selectedType: 'text',
            updateValue:'',
            alert: {
                type:'',
                message:''
            }          
        };
        this.handleClearAlert = this.handleClearAlert.bind(this);
        this.handleSelectionReload=this.handleSelectionReload.bind(this);
        this.toggleUnlock = this.toggleUnlock.bind(this);
        this.handleChange = this.handleChange.bind(this);
        // this.handleGenerateFile = this.handleGenerateFile.bind(this);
        this.handleUpdateValue = this.handleUpdateValue.bind(this);
        // this.handleSplitLine = this.handleSplitLine.bind(this);
        this.refreshStore = this.refreshStore.bind(this);
        this.updateSelectedIds = this.updateSelectedIds.bind(this);
        this.handleDeleteRows = this.handleDeleteRows.bind(this);
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

    componentDidUpdate(prevProps, prevState) {
        const { selectedField } = this.state;
        const { fields } = this.props;
        if (selectedField != prevState.selectedField && selectedField != '0') {
            let found = fields.items.find(function (f) {
                return f._id === selectedField;
            });
            if (found) {
                this.setState({
                    ...this.state,
                    updateValue: '',
                    selectedType: getInputType(found.type),
                });
            }
        }
    }

    handleClearAlert(event){
        event.preventDefault;
        const { dispatch } = this.props;
        this.setState({ 
            alert: {
                type:'',
                message:'' 
            } 
        });
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

    refreshStore() {
        const { dispatch } = this.props;
        const { projectId } = this.state;
        if (projectId) {
            dispatch(poActions.getAll(projectId));
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

    updateSelectedIds(selectedIds) {
        this.setState({
            ...this.state,
            selectedIds: selectedIds
        });
    }

    handleUpdateValue(event) {
        event.preventDefault();
        const { dispatch, fieldnames } = this.props;
        const { selectedField, selectedType, selectedIds, projectId, unlocked, updateValue} = this.state;
        if (!selectedField) {
            this.setState({
                ...this.state,
                alert: {
                    type:'alert-danger',
                    message:'You have not selected the field to be updated.'
                }
            });
        } else if (_.isEmpty(selectedIds)) {
            this.setState({
                ...this.state,
                alert: {
                    type:'alert-danger',
                    message:'You have not selected rows to be updated.'
                }
            });
        } else if (_.isEmpty(fieldnames)){
            this.setState({
                ...this.state,
                alert: {
                    type:'alert-danger',
                    message:'An error occured'
                }
            });
            if (projectId) {
                dispatch(fieldActions.getAll(projectId));
            }
        } else {
            let found = fieldnames.items.find( function (f) {
                return f.fields._id === selectedField;
            });
            if (found.edit && !unlocked) {
                this.setState({
                    ...this.state,
                    alert: {
                        type:'alert-danger',
                        message:'The field selected is locked for editing, please click on the unlock button.'
                    }
                });
            } else {
                let collection = found.fields.fromTbl;
                let objectIds = getObjectIds(collection, selectedIds);
                let fieldName = found.fields.name;
                let fieldValue = updateValue;
                let fieldType = selectedType;
                if (!isValidFormat(fieldValue, fieldType, getDateFormat(myLocale))) {
                    this.setState({
                        ...this.state,
                        alert: {
                            type:'alert-danger',
                            message:'Wrong Date Format.'
                        }
                    });
                } else {
                    const requestOptions = {
                        method: 'PUT',
                        headers: { ...authHeader(), 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            collection: collection,
                            fieldName: fieldName,
                            fieldValue: encodeURI(StringToDate (fieldValue, fieldType, getDateFormat(myLocale))),
                            objectIds: objectIds
                        })
                    };
                    //?objectIds=${JSON.stringify(objectIds)}
                    return fetch(`${config.apiUrl}/extract/update`, requestOptions)
                    .then( () => {
                        this.setState({
                            ...this.state,
                            alert: {
                                type:'alert-success',
                                message:'Field sucessfully updated.'
                            }
                        });
                        this.refreshStore();
                    })
                    .catch( () => {
                        this.setState({
                            ...this.state,
                            alert: {
                                type:'alert-danger',
                                message:'this Field cannot be updated.'
                            }
                        });
                    });
                }
            }  
        }
    }

    handleDeleteRows(event) {
        event.preventDefault;
        const { dispatch } = this.props;
        const { selectedIds, projectId, unlocked } = this.state;
        if (_.isEmpty(selectedIds)) {
            this.setState({
                ...this.state,
                alert: {
                    type:'alert-danger',
                    message:'You have not selected rows to be deleted.'
                }
            });
        } else if (!unlocked) {
            this.setState({
                ...this.state,
                alert: {
                    type:'alert-danger',
                    message:'Unlock the table in order to delete the rows'
                }
            });
        } else {
            console.log(toto);
        }
    }

    render() {
        const { 
            projectId, 
            screen, 
            screenId,
            selectedIds, 
            unlocked,
            // selectedTemplate,
            selectedField,
            selectedType, 
            updateValue, 
        }= this.state;

        const { accesses, fieldnames, fields, pos, selection } = this.props;
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
                <h2>Shipping | Prepare transport docs > {selection.project ? selection.project.name : <FontAwesomeIcon icon="spinner" className="fa-pulse fa-1x fa-fw" />}</h2>
                <hr />
                <div id="transportdocs" className="full-height">
                    <div className="action-row row ml-1 mb-2 mr-1" style={{height: '34px'}}>
                        <div
                            className="col"
                            style={{marginLeft:'0px', marginRight: '0px', paddingLeft: '0px', paddingRight: '0px'}}
                        >
                            <div className="input-group">
                                    <select className="form-control" name="selectedField" value={selectedField} placeholder="Select field..." onChange={this.handleChange}>
                                        <option key="0" value="0">Select field...</option>
                                        {this.selectedFieldOptions(fieldnames, fields, screenId)}
                                    </select>
                                    <input
                                        className="form-control"
                                        type={selectedType === 'number' ? 'number' : 'text'}
                                        name="updateValue"
                                        value={updateValue}
                                        onChange={this.handleChange}
                                        placeholder={selectedType === 'date' ? getDateFormat(myLocale) : ''}
                                    />
                                    <div className="input-group-append mr-2">
                                        <button className="btn btn-outline-leeuwen-blue btn-lg" onClick={event => this.handleUpdateValue(event)}>
                                            <span><FontAwesomeIcon icon="edit" className="fa-lg mr-2"/>Update</span>
                                        </button>
                                    </div>
                            </div>
                        </div>
                    </div>
                    <div className="" style={{height: 'calc(100% - 44px)'}}>
                        {selection && selection.project && 
                            <ProjectTable
                                screenHeaders={arraySorted(generateScreenHeader(fieldnames, screenId), "forShow")}
                                screenBodys={generateScreenBody(screenId, fieldnames, pos)}
                                projectId={projectId}
                                screenId={screenId}
                                selectedIds={selectedIds}
                                updateSelectedIds = {this.updateSelectedIds}
                                handleSelectionReload={this.handleSelectionReload}
                                toggleUnlock={this.toggleUnlock}
                                unlocked={unlocked}
                                screen={screen}
                                fieldnames={fieldnames}
                                fields={fields}
                                refreshStore={this.refreshStore}
                                handleDeleteRows = {this.handleDeleteRows}
                            />
                        }
                    </div>
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