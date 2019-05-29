//React
import React from 'react';
//Redux
import { connect } from 'react-redux';
import { opcoActions, projectActions } from '../../_actions';
//Components
import Layout from '../../_components/layout';
import Input from '../../_components/input';
import ProjectRow from '../../_components/project-table/project-row.js';
// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//Styles
import './home.css';

function projectSorted(project) {
    const newArray = project
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

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            number: '',
            name: '',
            erp: '',
            projects: [],
            loaded: false
        };
        this.filterName = this.filterName.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.stateReload = this.stateReload.bind(this);
    }

    componentDidMount() {
        this.props.dispatch(opcoActions.getAll());
        this.props.dispatch(projectActions.getAll());
    }
    stateReload(){
        if (this.props.projects.items) {
            const sorted = projectSorted(this.props.projects.items)
            this.setState({
                projects: sorted,
                loaded: true,
            });
        };
    }

    handleChange(event) {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        }, () => {
            this.filterName(this.state.number, this.state.name, this.state.erp);
        });
    }

    filterName(number, name, erp){
        if (!number && !name && !erp) {
            this.setState({
                projects: projectSorted(this.props.projects.items)
            });
        } else {
            name = name.replace(/([()[{*+.$^\\|?])/g, ""); 
            erp = erp.replace(/([()[{*+.$^\\|?])/g, "");
            this.setState({
                projects: projectSorted(this.props.projects.items).filter(function (project) {
                    if(number && name && erp) {
                        return project.number == Number(number) && !!project.name.match(new RegExp(name, "i")) && !!project.erp.name.match(new RegExp(erp, "i"))
                    } else if(number && name) {
                        return project.number == Number(number) && !!project.name.match(new RegExp(name, "i"))
                    } else if (number && erp) {
                        return project.number == Number(number) && !!project.erp.name.match(new RegExp(erp, "i"))
                    } else if(name && erp){
                        return !!project.name.match(new RegExp(name, "i")) && !!project.erp.name.match(new RegExp(erp, "i"))
                    } else if (number) {
                        return project.number == Number(number)
                    } else if (name) {
                        return !!project.name.match(new RegExp(name, "i"))
                    } else {
                        return !!project.erp.name.match(new RegExp(erp, "i"))
                    }
                })
            });
        }
    }



    render() {
        const { number, name, erp } = this.state;
        const { alert, loading } = this.props;
        {this.props.projects.items && this.state.loaded === false && this.stateReload()}
        return (
            <Layout>
                {alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div>}
                <br />
                <h2>Overview</h2>
                <hr />
                <div id="overview">
                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5>Select your project</h5>
                                </div>
                                <div className="card-body table-responsive">
                                    <table className="table table-hover">
                                        <thead>
                                            <tr>
                                                <th scope="col" style={{width:'15%'}}>Project No<br />
                                                <input className="form-control" name="number" value={number} onChange={this.handleChange} />
                                                </th>
                                                <th scope="col" style={{width:'70%'}}>Project<br />
                                                <input className="form-control" name="name" value={name} onChange={this.handleChange} />
                                                </th>
                                                <th scope="col" style={{width:'15%'}}>ERP<br />
                                                <input className="form-control" name="erp" value={erp} onChange={this.handleChange} />
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            { this.props.projects.items &&  !this.state.loaded ?
                                                this.props.projects.items && this.props.projects.items.map((project) => <ProjectRow project={project} key={project._id} />)
                                            :
                                                this.state.projects && this.state.projects.map((project) => <ProjectRow project={project} key={project._id} />)
                                            }
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
    const { loading } = state.projects;
    return {
        alert,
        opcos,
        projects,
        loading,
    };
}

const connectedHome = connect(mapStateToProps)(Home);
export { connectedHome as Home };
