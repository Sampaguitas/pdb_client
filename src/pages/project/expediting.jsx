import React from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';
import { projectActions } from '../../_actions';
import Layout from '../../_components/layout';
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
                            } else {
                                arryRow.push({});
                            }
                        });
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
                <h2>Expediting : {selection.project ? selection.project.name : <FontAwesomeIcon icon="spinner" className="fa-pulse fa-1x fa-fw" />}</h2>
                <hr />
                <div id="expediting" className="full-height">
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
                    {/* <ProjectTableNew /> */}
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