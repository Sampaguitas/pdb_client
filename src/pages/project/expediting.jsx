import React from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';
import { projectActions } from '../../_actions';
import Layout from '../../_components/layout';
import ProjectTable from '../../_components/project-table/project-table'
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

function arraySorted(array, field) {
    if (array) {
        const newArray = array
        newArray.sort(function(a,b){
            if (resolve(field, a) < resolve(field, b)) {
                return -1;
            } else if ((resolve(field, a) > resolve(field, b))) {
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

function returnScreenBodys(selection, fromTbl) {
    if (selection.project) {
        return selection.project.pos
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
            fromTbl: 'pos',
            
        };
        this.handleSelectionReload=this.handleSelectionReload.bind(this);
    }

    componentDidMount() {
        const { dispatch, location } = this.props
        var qs = queryString.parse(location.search);
        if (qs.id) {
            this.setState({projectId: qs.id}),
            dispatch(projectActions.getById(qs.id));
        }
        dispatch(projectActions.getAll()); 
    }

    handleSelectionReload(event){
        const { dispatch, location } = this.props
        var qs = queryString.parse(location.search);
        if (qs.id) {
            this.setState({projectId: qs.id}),
            dispatch(projectActions.getById(qs.id));
            console.log('stateReload');
        }
        dispatch(projectActions.getAll());    
    }

    render() {
        const { screenId, fromTbl }= this.state;
        const { alert, selection } = this.props;
        return (
            <Layout accesses={selection.project && selection.project.accesses}>
                {alert.message ? <div className={`alert ${alert.type}`}>{alert.message}</div>: <br />}
                <h2>Expediting : {selection.project ? selection.project.name : <FontAwesomeIcon icon="spinner" className="fa-pulse fa-1x fa-fw" />}</h2>
                <hr />
                <div id="expediting" className="full-height">
                    {selection && selection.project && 
                        <ProjectTable
                            screenHeaders={arraySorted(returnScreenHeaders(selection, screenId), "forShow")}
                            screenBodys={selection.project.pos}
                            selection={selection}
                            screenId={screenId}
                            handleSelectionReload={this.handleSelectionReload}
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

const connectedExpediting = connect(mapStateToProps)(Expediting);
export { connectedExpediting as Expediting };


        // const testScreenHeader = [
        //     {
        //         align: "center",
        //         daveId: 4606,
        //         edit: false,
        //         fieldId: "5cd15ac5b81c9a31121737da",
        //         fields: {
        //             custom: "Contr Del Condition",
        //             daveId: 2650,
        //             fromTbl: "po",
        //             name: "vlDelCondition",
        //             projectId: "5cc98cf2ab2a306e44a8fe7f",
        //             type: "String",
        //             __v: 0,
        //             _id: "5cd15ac5b81c9a31121737da",

        //         },
        //         forShow: 150,
        //         id: "5cd2f6dad1c62721cd12c065",
        //         projectId: "5cc98cf2ab2a306e44a8fe7f",
        //         screenId: "5cd2b642fd333616dc360b63",
        //         __v: 0,
        //         _id: "5cd2f6dad1c62721cd12c065",
        //     },
        //     {
        //         align: "center",
        //         daveId: 4614,
        //         edit: false,
        //         fieldId: "5cd15ac5b81c9a31121737dc",
        //         fields: {
        //             custom: "Description Client",
        //             daveId: 2652,
        //             fromTbl: "po",
        //             name: "clDescription",
        //             projectId: "5cc98cf2ab2a306e44a8fe7f",
        //             type: "String",
        //             __v: 0,
        //             _id: "5cd15ac5b81c9a31121737dc"
        //         },
        //         forSelect: 520,
        //         forShow: 520,
        //         id: "5cd2f6dbd1c62721cd12c06d",
        //         projectId: "5cc98cf2ab2a306e44a8fe7f",
        //         screenId: "5cd2b642fd333616dc360b63",
        //         __v: 0,
        //         _id: "5cd2f6dbd1c62721cd12c06d",
        //     },
        //     {
        //         align: "center",
        //         daveId: 4618,
        //         edit: false,
        //         fieldId: "5cd15ac5b81c9a31121737dd",
        //         fields: {
        //             custom: "Remarks / Deviation / Altern",
        //             daveId: 2653,
        //             fromTbl: "po",
        //             name: "devRemarks",
        //             projectId: "5cc98cf2ab2a306e44a8fe7f",
        //             type: "String",
        //             __v: 0,
        //             _id: "5cd15ac5b81c9a31121737dd"
        //         },
        //         forSelect: 110,
        //         forShow: 110,
        //         id: "5cd2f6dcd1c62721cd12c071",
        //         projectId: "5cc98cf2ab2a306e44a8fe7f",
        //         screenId: "5cd2b642fd333616dc360b63",
        //         __v: 0,
        //         _id: "5cd2f6dcd1c62721cd12c071",
        //     }

        // ]