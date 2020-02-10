import React from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';
import { 
    accessActions, 
    alertActions,
    collipackActions,
    fieldnameActions,
    fieldActions,
    poActions,
    projectActions,
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

function generateScreenBody(screenId, fieldnames, collipacks){
    let arrayBody = [];
    let arrayRow = [];
    let objectRow = {};
    // let hasPackitems = getScreenTbls(fieldnames).includes('packitem');
    // let hasCertificates = getScreenTbls(fieldnames).includes('certificate');
    let screenHeaders = arraySorted(generateScreenHeader(fieldnames, screenId), 'forShow');
    let i = 1;
    if (!_.isUndefined(collipacks) && collipacks.hasOwnProperty('items') && !_.isEmpty(collipacks.items)) {
        collipacks.items.map(collipack => {
            arrayRow = [];
            screenHeaders.map(screenHeader => {
                switch(screenHeader.fields.fromTbl) {
                    case 'collipack':
                        arrayRow.push({
                            collection: 'collipack',
                            objectId: collipack._id,
                            fieldName: screenHeader.fields.name,
                            fieldValue: collipack[screenHeader.fields.name],
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
                    poId: '',
                    subId: '',
                    certificateId: '',
                    packItemId: '',
                    colliPackId: collipack._id
                },
                fields: arrayRow
            }
            arrayBody.push(objectRow);
            i++;
        });
        return arrayBody;
    } else {
        return [];
    } 
}

class PackingDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            projectId:'',
            screenId: '5cd2b643fd333616dc360b67',
            unlocked: false,
            screen: 'certificates',
            selectedIds: [],
        };
        this.handleClearAlert = this.handleClearAlert.bind(this);
        this.handleSelectionReload=this.handleSelectionReload.bind(this);
        this.toggleUnlock = this.toggleUnlock.bind(this);
        this.refreshStore = this.refreshStore.bind(this);
        this.updateSelectedIds = this.updateSelectedIds.bind(this);
    }

    componentDidMount() {
        const { 
            dispatch,
            loadingAccesses,
            loadingCollipacks,
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
            if (!loadingCollipacks) {
                dispatch(collipackActions.getAll(qs.id));
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
            this.setState({projectId: qs.id});
            if (!loadingAccesses) {
                dispatch(accessActions.getAll(qs.id));
            }
            if (!loadingCollipacks) {
                dispatch(collipackActions.getById(qs.id));
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

    updateSelectedIds(selectedIds) {
        this.setState({
            ...this.state,
            selectedIds: selectedIds
        });
    }

    render() {
        const { 
            projectId, 
            screen, 
            screenId,
            selectedIds, 
            unlocked, 
        }= this.state;

        const { accesses, alert, fieldnames, fields, collipacks, selection } = this.props;
        
        return (
            <Layout alert={alert} accesses={accesses}>
                {alert.message && 
                    <div className={`alert ${alert.type}`}>{alert.message}
                        <button className="close" onClick={(event) => this.handleClearAlert(event)}>
                            <span aria-hidden="true"><FontAwesomeIcon icon="times"/></span>
                        </button>
                    </div>
                }
                <h2>Shipping | Complete packing details > {selection.project ? selection.project.name : <FontAwesomeIcon icon="spinner" className="fa-pulse fa-1x fa-fw" />}</h2>
                <hr />
                <div id="packingdetails" className="full-height">
                    {selection && selection.project && 
                        <ProjectTable
                            screenHeaders={arraySorted(generateScreenHeader(fieldnames, screenId), "forShow")}
                            screenBodys={generateScreenBody(screenId, fieldnames, collipacks)}
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
                        />
                    }
                </div>
            </Layout>
        );
    }
}

function mapStateToProps(state) {
    const { accesses, alert, collipacks, fieldnames, fields, pos, selection } = state;
    const { loadingAccesses } = accesses;
    const { loadingCollipacks } = collipacks;
    const { loadingFieldnames } = fieldnames;
    const { loadingFields } = fields;
    const { loadingPos } = pos;
    const { loadingSelection } = selection;
    return {
        accesses,
        collipacks,
        alert,
        fieldnames,
        fields,
        loadingAccesses,
        loadingCollipacks,
        loadingFieldnames,
        loadingFields,
        loadingPos,
        loadingSelection,
        pos,
        selection
    };
}

const connectedPackingDetails = connect(mapStateToProps)(PackingDetails);
export { connectedPackingDetails as PackingDetails };