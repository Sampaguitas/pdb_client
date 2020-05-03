import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { 
    accessActions,
    collitypeActions,
    docdefActions,
    docfieldActions,
    fieldActions,
    fieldnameActions,
    poActions,
    projectActions, 
    supplierActions,
    screenActions,
} from '../../_actions';
import { history } from '../../_helpers';
import Layout from '../../_components/layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import HeaderInput from '../../_components/project-table/header-input';
import moment from 'moment';
import _ from 'lodash';

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
            case 'date': return String(moment(fieldValue).format(myDateFormat)); 
            default: return fieldValue;
        }
    } else {
        return '';
    }
}

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

function doesMatch(search, value, type, isEqual) {
    
    if (!search) {
        return true;
    } else if (!value && search != 'any' && search != 'false' && search != '-1' && String(search).toUpperCase() != '=BLANK') {
        return false;
    } else {
        switch(type) {
            case 'Id':
                return _.isEqual(search, value);
            case 'String':
                if (String(search).toUpperCase() === '=BLANK') {
                    return !value;
                } else if (String(search).toUpperCase() === '=NOTBLANK') {
                    return !!value;
                } else if (isEqual) {
                    return _.isEqual(String(value).toUpperCase(), String(search).toUpperCase());
                } else {
                    return String(value).toUpperCase().includes(String(search).toUpperCase());
                }
            case 'Date':
                if (String(search).toUpperCase() === '=BLANK') {
                    return !value;
                } else if (String(search).toUpperCase() === '=NOTBLANK') {
                    return !!value;
                } else if (isEqual) {
                    return _.isEqual(TypeToString(value, 'date', getDateFormat(myLocale)), search);
                } else {
                    return TypeToString(value, 'date', getDateFormat(myLocale)).includes(search);
                }
            case 'Number':
                if (search === '-1') {
                    return !value;
                } else if (search === '-2') {
                    return !!value;
                } else if (isEqual) {
                    return _.isEqual( Intl.NumberFormat().format(value).toString(), Intl.NumberFormat().format(search).toString());
                } else {
                    return Intl.NumberFormat().format(value).toString().includes(Intl.NumberFormat().format(search).toString());
                }
            case 'Boolean':
                if(search == 'any') {
                    return true; //any or equal
                } else if (search == 'true' && !!value) {
                    return true; //true
                } else if (search == 'false' && !value) {
                    return true; //true
                }else {
                    return false;
                }
            case 'Select':
                if(search == 'any' || _.isEqual(search, value)) {
                    return true; //any or equal
                } else {
                    return false;
                }
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
            sort: {
                name: '',
                isAscending: true,
            },
            loaded: false,
        };
        this.handleClearAlert = this.handleClearAlert.bind(this);
        this.toggleSort = this.toggleSort.bind(this);
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
            return (!doesMatch('999999', project.number, 'Number', false));
        });
    }

    render() {
        const { number, name, opco, erp, sort } = this.state;
        const { alert, projects } = this.props;
        return (
            <Layout alert={alert}>
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
                <hr />
                <div id="overview" className="full-height">
                    <div className="action-row row ml-1 mb-3 mr-1" style={{height: '34px'}}>
                        <div className="ml-auto pull-right">
                            <button title="Create Project" className="btn btn-leeuwen-blue btn-lg" onClick={this.gotoProject} style={{height: '34px'}}>
                                <span><FontAwesomeIcon icon="plus" className="fa-lg mr-2"/>Create</span>
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
                                                sort={sort}
                                                toggleSort={this.toggleSort}
                                                
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
    const { alert, projects } = state;
    const { projectLoading } = state.projects;
    return {
        alert,
        projects,
        projectLoading,
    };
}

const connectedHome = connect(mapStateToProps)(Home);
export { connectedHome as Home };
