import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import queryString from 'query-string';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    accessActions,
    alertActions,
    projectActions,
    warehouseActions
} from '../../../_actions';
import Layout from '../../../_components/layout';
import HeaderInput from '../../../_components/project-table/header-input';
import HeaderCheckBox from '../../../_components/project-table/header-check-box';
import HeaderSelect from '../../../_components/project-table/header-select';
import TableInput from '../../../_components/project-table/table-input';
import TableSelect from '../../../_components/project-table/table-select';
import TableCheckBox from '../../../_components/project-table/table-check-box';
import TableSelectionRow from '../../../_components/project-table/table-selection-row';
import TableSelectionAllRow from '../../../_components/project-table/table-selection-all-row';
import Modal from '../../../_components/modal';
import Warehouse from '../../../_components/split-line/warhouse';

function locationSorted(array, sort) {
    let tempArray = array.slice(0);
    switch(sort.name) {
        case 'warehouse':
            if (sort.isAscending) {
                return tempArray.sort(function (a, b) {
                    let nameA = !_.isUndefined(a.name) && !_.isNull(a.name) ? String(a.name).toUpperCase() : '';
                    let nameB = !_.isUndefined(b.name) && !_.isNull(b.name) ? String(b.name).toUpperCase() : '';
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
                    let nameA = !_.isUndefined(a.name) && !_.isNull(a.name) ? String(a.name).toUpperCase() : '';
                    let nameB = !_.isUndefined(b.name) && !_.isNull(b.name) ? String(b.name).toUpperCase() : '';
                    if (nameA > nameB) {
                        return -1;
                    } else if (nameA < nameB) {
                        return 1;
                    } else {
                        return 0;
                    }
                });
            }
        case 'area':
            if (sort.isAscending) {
                return tempArray.sort(function (a, b) {
                    let nameA = !_.isUndefined(a.area.name) && !_.isNull(a.area.name) ? String(a.area.name).toUpperCase() : '';
                    let nameB = !_.isUndefined(b.area.name) && !_.isNull(b.area.name) ? String(b.area.name).toUpperCase() : '';
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
                    let nameA = !_.isUndefined(a.area.name) && !_.isNull(a.area.name) ? String(a.area.name).toUpperCase() : '';
                    let nameB = !_.isUndefined(b.area.name) && !_.isNull(b.area.name) ? String(b.area.name).toUpperCase() : '';
                    if (nameA > nameB) {
                        return -1;
                    } else if (nameA < nameB) {
                        return 1;
                    } else {
                        return 0;
                    }
                });
            }
        case 'location':
        case 'hall':
        case 'row':
        case 'col':
        case 'height':
        case 'tc':
        case 'type':
            if (sort.isAscending) {
                return tempArray.sort(function (a, b) {
                    let nameA = !_.isUndefined(a.area.location[sort.name]) && !_.isNull(a.area.location[sort.name]) ? String(a.area.location[sort.name]).toUpperCase() : '';
                    let nameB = !_.isUndefined(b.area.location[sort.name]) && !_.isNull(b.area.location[sort.name]) ? String(b.area.location[sort.name]).toUpperCase() : '';
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
                    let nameA = !_.isUndefined(a.area.location[sort.name]) && !_.isNull(a.area.location[sort.name]) ? String(a.area.location[sort.name]).toUpperCase() : '';
                    let nameB = !_.isUndefined(b.area.location[sort.name]) && !_.isNull(b.area.location[sort.name]) ? String(b.area.location[sort.name]).toUpperCase() : '';
                    if (nameA > nameB) {
                        return -1;
                    } else if (nameA < nameB) {
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


class Locations extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            projectId:'',
            selectedRows: [],
            selectAllRows: false,
            warehouse: '',
            location: '',
            area: '',
            hall: '',
            row: '',
            col: '',
            height: '',
            type: '',
            tc: '',
            sort: {
                name: '',
                isAscending: true,
            },
        };
        this.handleClearAlert = this.handleClearAlert.bind(this);
        this.refreshStore = this.refreshStore.bind(this);
        this.toggleSort = this.toggleSort.bind(this);
        this.handleChangeHeader = this.handleChangeHeader.bind(this);
        this.toggleSelectAllRow = this.toggleSelectAllRow.bind(this);
        this.toggleWarehouse = this.toggleWarehouse.bind(this);
        this.filterName = this.filterName.bind(this);
    }

    componentDidMount() {
        const { 
            dispatch,
            loadingAccesses,
            loadingSelection,
            loadingWarehouses, 
            location 
        } = this.props;

        var qs = queryString.parse(location.search);
        if (qs.id) {
            //State items with projectId
            this.setState({projectId: qs.id});
            if (!loadingAccesses) {
                dispatch(accessActions.getAll(qs.id));
            }
            if (!loadingSelection) {
                dispatch(projectActions.getById(qs.id));
            }
            if (!loadingWarehouses) {
                dispatch(warehouseActions.getAll(qs.id));
            }
        }
    }

    refreshStore() {
        const { dispatch } = this.props;
        const { projectId } = this.state;
        if (projectId) {
            dispatch(warehouseActions.getAll(projectId));
        }
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

    handleChangeHeader(event) {
        const target = event.target;
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({
            ...this.state,
            [name]: value
        });
    }

    toggleSelectAllRow() {
        const { selectAllRows } = this.state;
        const { fieldnames } = this.props;
        if (fieldnames.items) {
            if (selectAllRows) {
                this.setState({
                    ...this.state,
                    selectedRows: [],
                    selectAllRows: false
                });
            } else {
                this.setState({
                    ...this.state,
                    selectedRows: this.filterName(warehouses.items).map(s => s._id),
                    selectAllRows: true
                });
            }         
        }
    }

    toggleWarehouse(event) {
        event.preventDefault();
        const { showWarehouse } = this.state;
        this.setState({ showWarehouse: !showWarehouse });
    }
    
    filterName(array){
        const { warehouse, location, area, hall, row, col, height, tc, type, sort } = this.state
        if (array) {
            return locationSorted(array, sort).filter(function (object) {
                return (doesMatch(warehouse, object.name, 'String', false) 
                && doesMatch(location, object.area.location.name, 'String', false) 
                && doesMatch(area, object.area.area, 'String', false) 
                && doesMatch(hall, object.area.location.hall, 'String', false)
                && doesMatch(row, object.area.location.row, 'String', false)
                && doesMatch(col, object.area.location.col, 'String', false)
                && doesMatch(height, object.area.location.height, 'String', false)
                && doesMatch(tc, object.area.location.tc, 'Select', false)
                && doesMatch(type, object.area.location.type, 'String', false));
            });
        }
    }

    render() {
        const { accesses, alert, selection, warehouses } = this.props;

        const {
            projectId,
            selectedRows,
            selectAllRows,
            warehouse,
            location,
            area,
            hall,
            row,
            col,
            height,
            type,
            tc,
            sort,
            //show modals
            showWarehouse
        } = this.state;

        const arrTc = [
            { _id: 'T', name: 'T' },
            { _id: 'C', name: 'C' },
        ]

        return (
            <Layout alert={alert} accesses={accesses}>
                {alert.message && 
                    <div className={`alert ${alert.type}`}>{alert.message}
                        <button className="close" onClick={(event) => this.handleClearAlert(event)}>
                            <span aria-hidden="true"><FontAwesomeIcon icon="times"/></span>
                        </button>
                    </div>
                }
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <NavLink to={{ pathname: '/dashboard', search: '?id=' + projectId }} tag="a">Dashboard</NavLink>
                        </li>
                        <li className="breadcrumb-item">
                            <NavLink to={{ pathname: '/warehouse', search: '?id=' + projectId }} tag="a">Warehouse</NavLink>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">Locations:</li>
                        <span className="ml-3 project-title">{selection.project ? selection.project.name : <FontAwesomeIcon icon="spinner" className="fa-pulse fa-1x fa-fw" />}</span>
                    </ol>
                </nav>
                <hr />
                <div id="locations" className="full-height">
                    <div className="action-row row ml-1 mb-3 mr-1" style={{height: '34px'}}>
                        <button className="btn btn-leeuwen-blue btn-lg mr-2" style={{height: '34px'}} title="Show Warehouses" onClick={this.toggleWarehouse}>
                            <span><FontAwesomeIcon icon="warehouse" className="fa-lg mr-2"/>Warehouses</span>
                        </button>
                        <button className="btn btn-leeuwen-blue btn-lg mr-2" style={{height: '34px'}} title="DUF File"> {/* onClick={event => this.toggleWarhouses(event)} */}
                            <span><FontAwesomeIcon icon="upload" className="fa-lg mr-2"/>DUF File</span>
                        </button>
                        <button className="btn btn-leeuwen-blue btn-lg mr-2" style={{height: '34px'}} title="Add Location"> {/* onClick={event => this.toggleGenerate(event)} */}
                            <span><FontAwesomeIcon icon="plus" className="fa-lg mr-2"/>Add Location</span>
                        </button>
                        <button className="btn btn-leeuwen btn-lg mr-2" style={{height: '34px'}} title="Delete Location"> {/* onClick={event => this.toggleGenerate(event)} */}
                            <span><FontAwesomeIcon icon="trash-alt" className="fa-lg mr-2"/>Delete Location(s)</span>
                        </button>
                    </div>
                    <div className="" style={{height: 'calc(100% - 44px)'}}>
                        <div className="row ml-1 mr-1 full-height" style={{borderStyle: 'solid', borderWidth: '1px', borderColor: '#ddd'}}>
                            <div className="table-responsive custom-table-container custom-table-container__fixed-row">
                                <table className="table table-bordered table-sm text-nowrap table-striped" id="locationsTable">
                                    <thead>
                                        <tr>
                                            <TableSelectionAllRow
                                                checked={selectAllRows}
                                                onChange={this.toggleSelectAllRow}
                                            />
                                            <HeaderInput
                                                type="text"
                                                title="Location"
                                                name="location"
                                                value={location}
                                                onChange={this.handleChangeHeader}
                                                sort={sort}
                                                toggleSort={this.toggleSort}
                                            />
                                            <HeaderInput
                                                type="text"
                                                title="Warehouse"
                                                name="warehouse"
                                                value={warehouse}
                                                onChange={this.handleChangeHeader}
                                                sort={sort}
                                                toggleSort={this.toggleSort}
                                            />
                                            <HeaderInput
                                                type="text"
                                                title="Area"
                                                name="area"
                                                value={area}
                                                onChange={this.handleChangeHeader}
                                                sort={sort}
                                                toggleSort={this.toggleSort}
                                            />
                                            <HeaderInput
                                                type="text"
                                                title="Hall"
                                                name="hall"
                                                value={hall}
                                                onChange={this.handleChangeHeader}
                                                maxLength={1}
                                                sort={sort}
                                                toggleSort={this.toggleSort}
                                            />
                                            <HeaderInput
                                                type="text"
                                                title="Row"
                                                name="row"
                                                value={row}
                                                onChange={this.handleChangeHeader}
                                                maxLength={1}
                                                sort={sort}
                                                toggleSort={this.toggleSort}
                                            />
                                            <HeaderInput
                                                type="text"
                                                title="Col"
                                                name="col"
                                                value={col}
                                                onChange={this.handleChangeHeader}
                                                maxLength={3}
                                                sort={sort}
                                                toggleSort={this.toggleSort}
                                            />
                                            <HeaderInput
                                                type="text"
                                                title="Height"
                                                name="height"
                                                value={height}
                                                onChange={this.handleChangeHeader}
                                                maxLength={1}
                                                sort={sort}
                                                toggleSort={this.toggleSort}
                                            />
                                            <HeaderSelect
                                                title="TC"
                                                name="tc"
                                                value={tc}
                                                options={arrTc}
                                                optionText="name"
                                                onChange={this.handleChangeHeader}
                                                sort={sort}
                                                toggleSort={this.toggleSort}
                                            /> 
                                            <HeaderInput
                                                type="text"
                                                title="Type"
                                                name="type"
                                                value={type}
                                                onChange={this.handleChangeHeader}
                                                sort={sort}
                                                toggleSort={this.toggleSort}
                                            />
                                        </tr>
                                    </thead>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <Modal
                    show={showWarehouse}
                    hideModal={this.toggleWarehouse}
                    title="Warehouses"
                    size="modal-lg"
                >
                    <Warehouse 
                        alert={alert}
                        projectId={projectId}
                        warehouses={warehouses}
                        handleClearAlert={this.handleClearAlert}
                        refreshStore={this.refreshStore}
                        toggleWarehouse={this.toggleWarehouse}
                    />
                </Modal>
                
            </Layout>
        );
    }
}

function mapStateToProps(state) {
    const { accesses, alert, selection, warehouses } = state;
    const { loadingAccesses } = accesses;
    const { loadingSelection } = selection;
    const { loadingWarehouses } = warehouses;
    
    return {
        accesses,
        alert,
        loadingAccesses,
        loadingSelection,
        loadingWarehouses,
        selection,
        warehouses
    };
}

const connectedLocations = connect(mapStateToProps)(Locations);
export { connectedLocations as Locations };