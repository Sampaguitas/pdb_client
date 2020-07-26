import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { history } from '../../_helpers';
import { 
    accessActions,
    collitypeActions,
    docdefActions,
    docfieldActions,
    fieldActions,
    fieldnameActions,
    poActions,
    projectActions,
    sidemenuActions,
    supplierActions,
} from '../../_actions';
import {
    doesMatch,
    copyObject
} from '../../_functions';
import {
    HeaderInput
} from '../../_components/project-table';
import {
    Layout
} from '../../_components';
import _ from 'lodash';

function projectSorted(array, sort) {
    let tempArray = array.slice(0);
    switch(sort.name) {
        case 'number':
            if (sort.isAscending) {
                return tempArray.sort(function (a, b) {
                    let valueA = a.number || 0;
                    let valueB = b.number || 0;
                    return valueA - valueB;
                });
            } else {
                return tempArray.sort(function (a, b){
                    let valueA = a.number || 0;
                    let valueB = b.number || 0;
                    return valueB - valueA
                });
            }
        case 'name':
            if (sort.isAscending) {
                return tempArray.sort(function (a, b) {
                    let nameA = !_.isUndefined(a.name) && !_.isNull(a.name) ? a.name.toUpperCase() : '';
                    let nameB = !_.isUndefined(b.name) && !_.isNull(b.name) ? b.name.toUpperCase() : '';
                    if (nameA < nameB) {
                        return -1;
                    } else if (nameA > nameB) {
                        return 1;
                    } else {
                        return 0;
                    }
                });
            } else {
                return tempArray.sort(function (a, b) {
                    let nameA = !_.isUndefined(a.name) && !_.isNull(a.name) ? a.name.toUpperCase() : '';
                    let nameB = !_.isUndefined(b.name) && !_.isNull(b.name) ? b.name.toUpperCase() : '';
                    if (nameA > nameB) {
                        return -1;
                    } else if (nameA < nameB) {
                        return 1;
                    } else {
                        return 0;
                    }
                });
            }
        case 'opco':
            if (sort.isAscending) {
                return tempArray.sort(function (a, b) {
                    let opcoA = !_.isUndefined(a.opco.name) && !_.isNull(a.opco.name) ? a.opco.name.toUpperCase() : '';
                    let opcoB = !_.isUndefined(b.opco.name) && !_.isNull(b.opco.name) ? b.opco.name.toUpperCase() : '';
                    if (opcoA < opcoB) {
                        return -1;
                    } else if (opcoA > opcoB) {
                        return 1;
                    } else {
                        return 0;
                    }
                });
            } else {
                return tempArray.sort(function (a, b) {
                    let opcoA = !_.isUndefined(a.opco.name) && !_.isNull(a.opco.name) ? a.opco.name.toUpperCase() : '';
                    let opcoB = !_.isUndefined(b.opco.name) && !_.isNull(b.opco.name) ? b.opco.name.toUpperCase() : '';
                    if (opcoA > opcoB) {
                        return -1;
                    } else if (opcoA < opcoB) {
                        return 1;
                    } else {
                        return 0;
                    }
                });
            }
        case 'erp':
            if (sort.isAscending) {
                return tempArray.sort(function (a, b) {
                    let erpA = !_.isUndefined(a.erp.name) && !_.isNull(a.erp.name) ? a.erp.name.toUpperCase() : '';
                    let erpB = !_.isUndefined(b.erp.name) && !_.isNull(b.erp.name) ? b.erp.name.toUpperCase() : '';
                    if (erpA < erpB) {
                        return -1;
                    } else if (erpA > erpB) {
                        return 1;
                    } else {
                        return 0;
                    }
                });
            } else {
                return tempArray.sort(function (a, b) {
                    let erpA = !_.isUndefined(a.erp.name) && !_.isNull(a.erp.name) ? a.erp.name.toUpperCase() : '';
                    let erpB = !_.isUndefined(b.erp.name) && !_.isNull(b.erp.name) ? b.erp.name.toUpperCase() : '';
                    if (erpA > erpB) {
                        return -1;
                    } else if (erpA < erpB) {
                        return 1;
                    } else {
                        return 0;
                    }
                });
            }
        default: return array; 
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
            sort: {
                name: '',
                isAscending: true,
            },
            loaded: false,
            menuItem: 'Home',
            settingsColWidth: {}
        };
        this.handleClearAlert = this.handleClearAlert.bind(this);
        this.toggleSort = this.toggleSort.bind(this);
        this.handleOnclick = this.handleOnclick.bind(this);
        this.filterName = this.filterName.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.gotoProject = this.gotoProject.bind(this);
        this.withoutProjectMaster = this.withoutProjectMaster.bind(this);
        this.toggleCollapse = this.toggleCollapse.bind(this);
        this.colDoubleClick = this.colDoubleClick.bind(this);
        this.setColWidth = this.setColWidth.bind(this);
    }

    componentDidMount() {
        const { dispatch } = this.props
        const { menuItem } = this.state;
        // Clear Selection
        dispatch(accessActions.clear());
        dispatch(collitypeActions.clear());
        dispatch(docdefActions.clear());
        dispatch(docfieldActions.clear());
        dispatch(fieldActions.clear());
        dispatch(fieldnameActions.clear());
        dispatch(poActions.clear());
        dispatch(projectActions.clearSelection());
        dispatch(supplierActions.clear());
        // Get Projects
        dispatch(projectActions.getAll());
        dispatch(sidemenuActions.select(menuItem));
    }

    handleClearAlert(event){
        event.preventDefault;
        const { dispatch } = this.props;
        dispatch(alertActions.clear());
    }

    toggleSort(event, name) {
        event.preventDefault();
        const { sort } = this.state;
        if (sort.name != name) {
            this.setState({
                sort: {
                    name: name,
                    isAscending: true
                }
            });
        } else if (!!sort.isAscending) {
            this.setState({
                sort: {
                    name: name,
                    isAscending: false
                }
            });
        } else {
            this.setState({
                sort: {
                    name: '',
                    isAscending: true
                }
            });
        }
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

    filterName(array){
        const { number, name, opco, erp, sort } = this.state
        if (array) {
            return projectSorted(array, sort).filter(function (object) {
                return (doesMatch(number, object.number, 'Number', false) 
                && doesMatch(name, object.name, 'String', false) 
                && doesMatch(opco, object.opco.name, 'String', false) 
                && doesMatch(erp, object.erp.name, 'String', false));
            });
        }
    }

    gotoProject(event) {
        event.preventDefault()
        history.push({pathname:'/project'})
    }

    withoutProjectMaster(projects){
        return this.filterName(projects).filter(function (project){
            // return true;
            return (!doesMatch('999999', project.number, 'Number', false));
        });
    }

    toggleCollapse() {
        const { dispatch } = this.props;
        dispatch(sidemenuActions.toggle());
    }

    colDoubleClick(event, index) {
        event.preventDefault();
        const { settingsColWidth } = this.state;
        if (settingsColWidth.hasOwnProperty(index)) {
            let tempArray = copyObject(settingsColWidth);
            delete tempArray[index];
            this.setState({ settingsColWidth: tempArray });
        } else {
            this.setState({
                settingsColWidth: {
                    ...settingsColWidth,
                    [index]: 10
                }
            });
        }
    }

    setColWidth(index, width) {
        const { settingsColWidth } = this.state;
        this.setState({
            settingsColWidth: {
                ...settingsColWidth,
                [index]: width
            }
        });
    }

    render() {
        const { menuItem, number, name, opco, erp, sort, settingsColWidth } = this.state;
        const { alert, projects, sidemenu } = this.props;
        return (
            <Layout sidemenu={sidemenu} toggleCollapse={this.toggleCollapse} menuItem={menuItem}>
                {alert.message && 
                    <div className={`alert ${alert.type}`}>{alert.message}
                        <button className="close" onClick={(event) => this.handleClearAlert(event)}>
                            <span aria-hidden="true"><FontAwesomeIcon icon="times"/></span>
                        </button>
                    </div>
                }
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item active" aria-current="page">Home</li>
                    </ol>
                </nav>
                <div id="overview" className={alert.message ? "main-section-alert" : "main-section"}> 
                    <div className="action-row row"> 
                            <button title="Create Project" className="btn btn-leeuwen-blue btn-lg" onClick={this.gotoProject}> {/* action: 30px, */}
                                <span><FontAwesomeIcon icon="plus" className="fa mr-2"/>Create Project</span>
                            </button>
                    </div>
                    <div className="body-section">   
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
                                                sort={sort}
                                                toggleSort={this.toggleSort}
                                                index="0"
                                                colDoubleClick={this.colDoubleClick}
                                                setColWidth={this.setColWidth}
                                                settingsColWidth={settingsColWidth}
                                                
                                            />
                                            <HeaderInput
                                                type="text"
                                                title="Project"
                                                name="name"
                                                value={name}
                                                onChange={this.handleChange}
                                                width="40%"
                                                sort={sort}
                                                toggleSort={this.toggleSort}
                                                index="1"
                                                colDoubleClick={this.colDoubleClick}
                                                setColWidth={this.setColWidth}
                                                settingsColWidth={settingsColWidth}
                                            />
                                            <HeaderInput
                                                type="text"
                                                title="Opco"
                                                name="opco"
                                                value={opco}
                                                onChange={this.handleChange}
                                                width="40%"
                                                sort={sort}
                                                toggleSort={this.toggleSort}
                                                index="2"
                                                colDoubleClick={this.colDoubleClick}
                                                setColWidth={this.setColWidth}
                                                settingsColWidth={settingsColWidth}
                                            />
                                            <HeaderInput
                                                type="text"
                                                title="ERP"
                                                name="erp"
                                                value={erp}
                                                onChange={this.handleChange}
                                                width="10%"
                                                sort={sort}
                                                toggleSort={this.toggleSort}
                                                index="3"
                                                colDoubleClick={this.colDoubleClick}
                                                setColWidth={this.setColWidth}
                                                settingsColWidth={settingsColWidth}
                                            />
                                        </tr>
                                    </thead>
                                    <tbody className="full-height">
                                        {projects.items && this.withoutProjectMaster(projects.items).map((project) =>
                                            <tr key={project._id} style={{cursor: 'pointer'}} onClick={(event) => this.handleOnclick(event, project)}>
                                                <td className="no-select">{project.number}</td>
                                                <td className="no-select">{project.name}</td>
                                                <td className="no-select">{project.opco.name}</td>
                                                <td className="no-select">{project.erp.name}</td>
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
    const { alert, projects, sidemenu } = state;
    const { projectLoading } = state.projects;
    return {
        alert,
        projects,
        sidemenu,
        projectLoading,
    };
}

const connectedHome = connect(mapStateToProps)(Home);
export { connectedHome as Home };
