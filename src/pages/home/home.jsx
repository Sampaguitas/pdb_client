import React from 'react';
import { connect } from 'react-redux';
import { opcoActions, projectActions } from '../../_actions';
import { history } from '../../_helpers';
import Layout from '../../_components/layout';
import Input from '../../_components/input';
import ProjectRow from '../../_components/project-table/project-row.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './home.css';

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
            // projects: [],
            loaded: false
        };
        this.filterName = this.filterName.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.gotoProject = this.gotoProject.bind(this);
        this.withoutProjectMaster = this.withoutProjectMaster.bind(this);
    }

    componentDidMount() {
        const { dispatch } = this.props
        dispatch(opcoActions.getAll());
        dispatch(projectActions.getAll());
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
        const { number, name, opco, erp } = this.state;
        const { alert, projects } = this.props;
        return (
            <Layout>
                {alert.message ? <div className={`alert ${alert.type}`}>{alert.message}</div>: <br />}
                <h2>Overview</h2>
                <hr />
                <div id="overview" className="full-height">
                    <div className="row full-height">
                        <div className="col-12 full-height">
                            <div className="card full-height">
                                <div className="card-header">
                                    <div className="row">
                                        <div className="col-8">
                                            <h5>Select your project</h5>
                                        </div>
                                        <div className="col-4 text-right">
                                            <div className="modal-link" >
                                                <FontAwesomeIcon icon="plus" className="red" name="plus" onClick={this.gotoProject}/>
                                            </div>
                                        </div>
                                    </div>    
                                </div>
                                <div className="card-body table-responsive">
                                    <table className="table table-hover table-bordered">
                                        <thead>
                                            <tr>
                                                <th scope="col" style={{width: '15%'}}>Nr<br />
                                                <input className="form-control" name="number" value={number} onChange={this.handleChange} />
                                                </th>
                                                <th scope="col">Project<br />
                                                <input className="form-control" name="name" value={name} onChange={this.handleChange} />
                                                </th>
                                                <th scope="col">Opco<br />
                                                <input className="form-control" name="opco" value={opco} onChange={this.handleChange} />
                                                </th>
                                                <th scope="col" style={{width: '15%'}}>ERP<br />
                                                <input className="form-control" name="erp" value={erp} onChange={this.handleChange} />
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {projects.items && this.withoutProjectMaster(projects).map((project) => <ProjectRow project={project} key={project._id} />)}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }
}

function mapStateToProps(state) {
    const { alert, opcos, projects } = state;
    const { projectLoading } = state.projects;
    return {
        alert,
        opcos,
        projects,
        projectLoading,
    };
}

const connectedHome = connect(mapStateToProps)(Home);
export { connectedHome as Home };
