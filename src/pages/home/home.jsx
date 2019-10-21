import React from 'react';
import { connect } from 'react-redux';
import { accessActions, projectActions, supplierActions } from '../../_actions';
import { history } from '../../_helpers';
import Layout from '../../_components/layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import HeaderInput from '../../_components/project-table/header-input';
// import './home.css';

function projectSorted(project) {
    if (project.items) {
        const newArray = project.items
        newArray.sort(function(a,b){
            if (a.number < b.number) {
                return -1;
            }
            if (a.number > b.number) {
                return 1;
            }
            return 0;
        });
        return newArray;
    }
}

function doesMatch(search, array, type) {
    if (!search) {
        return true;
    } else if (!array) {
        return true;
    } else {
        switch(type) {
            case 'String':
                search = search.replace(/([()[{*+.$^\\|?])/g, "");
                return !!array.match(new RegExp(search, "i"));
            case 'Number': 
                return array == Number(search);
            default: return true;
        }
    }
}

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            number: '',
            name: '',
            opco:'',
            erp: '',
            loaded: false,
        };
        this.handleOnclick = this.handleOnclick.bind(this);
        this.filterName = this.filterName.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.gotoProject = this.gotoProject.bind(this);
        this.withoutProjectMaster = this.withoutProjectMaster.bind(this);
    }

    componentDidMount() {
        const { dispatch } = this.props
        // Clear Selection
        dispatch(accessActions.clear());
        dispatch(projectActions.clearSelection());
        dispatch(supplierActions.clear());
        // Get Projects
        dispatch(projectActions.getAll());
    }

    handleOnclick(event, project) {
        event.preventDefault();
        history.push({
            pathname:'/dashboard',
            search: '?id=' + project._id
        });
    }

    handleChange(event) {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    }

    filterName(projects){
        const { number, name, opco, erp } = this.state
        if (projects.items) {
            return projectSorted(projects).filter(function (project) {
                return (doesMatch(number, project.number, 'Number') 
                && doesMatch(name, project.name, 'String') 
                && doesMatch(opco, project.opco.name, 'String') 
                && doesMatch(erp, project.erp.name, 'String'));
            });
        }
    }

    gotoProject(event) {
        event.preventDefault()
        history.push({pathname:'/project'})
    }

    withoutProjectMaster(projects){
        return this.filterName(projects).filter(function (project){
            return (!doesMatch('999999', project.number, 'Number'));
        });
    }

    render() {
        const { number, name, opco, erp, tblWidth, tblHeight  } = this.state;
        const { alert, projects } = this.props;
        return (
            <Layout alert={this.props.alert}>
                {alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div>}
                <h2>Overview</h2>
                <hr />
                <div id="overview" className="full-height">
                    <div className="action-row row ml-1 mb-3 mr-1" style={{height: '34px'}}>
                        <div className="ml-auto pull-right">
                            <button
                                className="btn btn-leeuwen-blue btn-lg"
                                onClick={this.gotoProject}
                                style={{height: '34px'}}
                            >
                                <span><FontAwesomeIcon icon="plus" className="fa-lg mr-2"/>Create Project</span>
                            </button>
                        </div>
                    </div>
                    <div className="" style={{height: 'calc(100% - 44px)'}}>   
                        <div className="row ml-1 mr-1 full-height" style={{borderStyle: 'solid', borderWidth: '1px', borderColor: '#ddd'}}>
                            <div className="table-responsive custom-table-container" >
                                <table className="table table-hover table-bordered table-sm">
                                    <thead>
                                        <tr>
                                            <HeaderInput
                                                type="number"
                                                title="Nr"
                                                name="number"
                                                value={number}
                                                onChange={this.handleChange}
                                                width="10%"
                                                
                                            />
                                            <HeaderInput
                                                type="text"
                                                title="Project"
                                                name="name"
                                                value={name}
                                                onChange={this.handleChange}
                                                width="40%"
                                            />
                                            <HeaderInput
                                                type="text"
                                                title="Opco"
                                                name="opco"
                                                value={opco}
                                                onChange={this.handleChange}
                                                width="40%"
                                            />
                                            <HeaderInput
                                                type="text"
                                                title="ERP"
                                                name="erp"
                                                value={erp}
                                                onChange={this.handleChange}
                                                width="10%"
                                            />
                                        </tr>
                                    </thead>
                                    <tbody className="full-height">
                                        {projects.items && this.withoutProjectMaster(projects).map((project) =>
                                            <tr key={project._id} style={{cursor: 'pointer'}} onClick={(event) => this.handleOnclick(event, project)}>
                                                <td>{project.number}</td>
                                                <td>{project.name}</td>
                                                <td>{project.opco.name}</td>
                                                <td>{project.erp.name}</td>
                                            </tr>
                                        )}
                                    </tbody>
                                    
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }
}

function mapStateToProps(state) {
    const { alert, projects } = state; //opcos
    const { projectLoading } = state.projects;
    return {
        alert,
        // opcos,
        projects,
        projectLoading,
    };
}

const connectedHome = connect(mapStateToProps)(Home);
export { connectedHome as Home };
