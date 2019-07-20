import React from 'react';
import { connect } from 'react-redux';
import Layout from '../../../_components/layout';
import queryString from 'query-string';
import { authHeader } from '../../../_helpers';
import config from 'config';
import { projectActions } from '../../../_actions';
import ProjectTable from '../../../_components/project-table/project-table'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class TransportDocuments extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            projectId:'',
            screenId: '5cd2b643fd333616dc360b66'            
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
        const { screenId }= this.state;
        const { alert, selection } = this.props;
        return (
            <Layout alert={this.props.alert} accesses={selection.project && selection.project.accesses}>
                {alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div>}
                <h2>Shipping - Transport docs : {selection.project ? selection.project.name : <FontAwesomeIcon icon="spinner" className="fa-pulse fa-1x fa-fw" />}</h2>
                <hr />
                <div id="transportdocs" className="full-height">
                    {/* {selection && 
                        <ProjectTable
                            selection={selection}
                            screenId={screenId}
                            handleSelectionReload={this.handleSelectionReload}
                        />
                    } */}
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