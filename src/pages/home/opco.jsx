import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    alertActions,
    accessActions,
    collitypeActions,
    docdefActions,
    docfieldActions,
    fieldActions,
    fieldnameActions,
    localeActions,
    opcoActions,
    poActions,
    projectActions,
    regionActions,
    sidemenuActions,
    supplierActions,
} from '../../_actions';
import { arraySorted, doesMatch, copyObject } from '../../_functions';
import HeaderInput from '../../_components/project-table/header-input';
import { Input, Layout, Modal, Select } from '../../_components';
import _ from 'lodash';


function opcoSorted(array, sort) {
    let tempArray = array.slice(0);
    switch(sort.name) {
        case 'code':
        case 'name':
        case 'city':
        case 'country':
            if (sort.isAscending) {
                return tempArray.sort(function (a, b) {
                    let nameA = !_.isUndefined(a[sort.name]) && !_.isNull(a[sort.name]) ? String(a[sort.name]).toUpperCase() : '';
                    let nameB = !_.isUndefined(b[sort.name]) && !_.isNull(b[sort.name]) ? String(b[sort.name]).toUpperCase() : '';
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
                    let nameA = !_.isUndefined(a[sort.name]) && !_.isNull(a[sort.name]) ? String(a[sort.name]).toUpperCase() : '';
                    let nameB = !_.isUndefined(b[sort.name]) && !_.isNull(b[sort.name]) ? String(b[sort.name]).toUpperCase() : '';
                    if (nameA > nameB) {
                        return -1;
                    } else if (nameA < nameB) {
                        return 1;
                    } else {
                        return 0;
                    }
                });
            }
        case 'region':
            if (sort.isAscending) {
                return tempArray.sort(function (a, b) {
                    let nameA = !_.isUndefined(a.region.name) && !_.isNull(a.region.name) ? String(a.region.name).toUpperCase() : '';
                    let nameB = !_.isUndefined(b.region.name) && !_.isNull(b.region.name) ? String(b.region.name).toUpperCase() : '';
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
                    let nameA = !_.isUndefined(a.region.name) && !_.isNull(a.region.name) ? String(a.region.name).toUpperCase() : '';
                    let nameB = !_.isUndefined(b.region.name) && !_.isNull(b.region.name) ? String(b.region.name).toUpperCase() : '';
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

class Opco extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            opco: {},
            code: '',
            name: '',
            city: '',
            country: '',
            region: '',
            sort: {
                name: '',
                isAscending: true,
            },
            submitted: false,
            show: false,
            menuItem: 'Add operation company',
            settingsColWidth: {}
        };
        this.handleClearAlert = this.handleClearAlert.bind(this);
        this.toggleSort = this.toggleSort.bind(this);
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.handleChangeOpco = this.handleChangeOpco.bind(this);
        this.handleChangeHeader = this.handleChangeHeader.bind(this);
        this.filterName = this.filterName.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleOnclick = this.handleOnclick.bind(this);
        this.handleDeletOpco = this.handleDeletOpco.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
        this.toggleCollapse = this.toggleCollapse.bind(this);
        this.colDoubleClick = this.colDoubleClick.bind(this);
        this.setColWidth = this.setColWidth.bind(this);
    }

    componentDidMount() {
        const { dispatch } = this.props;
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
        //Get opcos, locales, regions
        dispatch(opcoActions.getAll());
        dispatch(localeActions.getAll());
        dispatch(regionActions.getAll());
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

    showModal() {
        this.setState({
          opco: {
            code: "",
            name: "",
            address: "",
            city: "",
            zip: "",
            country: "",
            localeId: "",
            regionId: "",
          },
          show: true
        });
      }
    
      hideModal() {
        this.setState({
          opco: {
            code: "",
            name: "",
            address: "",
            city: "",
            zip: "",
            country: "",
            localeId: "",
            regionId: "",
          },
          submitted: false,
          show: false
        });
      }

    handleChangeOpco(event) {
        const target = event.target;
        const { opco } = this.state
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({
            opco: {
                ...opco,
                [name]: value
            }
        });
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

    filterName(array){
        const { code, name, city, country, region, sort } = this.state
        if (array) {
          return opcoSorted(array, sort).filter(function (object) {
            return (doesMatch(code, object.code, 'String', false) 
            && doesMatch(name, object.name, 'String', false) 
            && doesMatch(city, object.city, 'String', false)
            && doesMatch(country, object.country, 'String', false)
            && doesMatch(region, object.region.name, 'String', false));
          });
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        this.setState({ submitted: true });
        const { opco } = this.state;
        const { dispatch } = this.props;
        if (
            opco.id &&
            opco.code &&
            opco.name &&
            opco.address &&
            opco.city &&
            opco.country &&
            opco.localeId &&
            opco.regionId
        ) {
            dispatch(opcoActions.update(opco));
            this.hideModal();
            // this.setState({ submitted: false });
        } else if (
            opco.code &&
            opco.name &&
            opco.address &&
            opco.city &&
            opco.country &&
            opco.localeId &&
            opco.regionId
        ){
            dispatch(opcoActions.create(opco));
            this.hideModal();
            // this.setState({ submitted: false });
        }
    }

    handleOnclick(event, id) {
        const { opcos } = this.props
        let user = JSON.parse(localStorage.getItem('user'));
        if (event.target.type != 'checkbox' && opcos.items && user.isSuperAdmin) {
          let found = opcos.items.find(element => element.id === id);
          this.setState({
            opco: {
              id: id,
              code: found.code,
              name: found.name,
              address: found.address,
              city: found.city,
              zip: found.zip,
              country: found.country,
              localeId: found.localeId,
              regionId: found.regionId,
            },
            show: true
          })
        }
      }

    handleDeletOpco(event, id) {
        event.preventDefault();
        const { dispatch } = this.props
        dispatch(opcoActions.delete(id));
        this.hideModal();
        this.setState({ submitted: false });
    }

    onKeyPress(event) {
        if (event.which === 13 /* prevent form submit on key Enter */) {
            event.preventDefault();
        }
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
        const { alert, locales, opcoCreating, opcoUpdating, opcoDeleting, opcos , regions, sidemenu } = this.props;
        const { menuItem, opco, show, code, name, city, country, region, sort, submitted, settingsColWidth } = this.state;
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
                        <li className="breadcrumb-item">
                            <NavLink to={{ pathname: '/' }} tag="a">Home</NavLink>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">Add operation company</li>
                    </ol>
                </nav>
                <div id="opco" className={alert.message ? "main-section-alert" : "main-section"}>
                    <div className="action-row row">
                            <button title="Create Opco" className="btn btn-leeuwen-blue btn-lg" onClick={this.showModal}> {/* style={{height: '34px'}} */}
                                <span><FontAwesomeIcon icon="plus" className="fa mr-2"/>Create Opco</span>
                            </button>
                    </div>
                    <div className="body-section">
                        <div className="row ml-1 mr-1 full-height" style={{borderStyle: 'solid', borderWidth: '1px', borderColor: '#ddd'}}>
                            <div className="table-responsive custom-table-container" >
                                <table className="table table-hover table-bordered table-sm">
                                    <thead>
                                        <tr>
                                            <HeaderInput
                                                type="text"
                                                title="Code"
                                                name="code"
                                                value={code}
                                                onChange={this.handleChangeHeader}
                                                width="15%"
                                                sort={sort}
                                                toggleSort={this.toggleSort}
                                                index="0"
                                                colDoubleClick={this.colDoubleClick}
                                                setColWidth={this.setColWidth}
                                                settingsColWidth={settingsColWidth}
                                            />
                                            <HeaderInput
                                                type="text"
                                                title="Name"
                                                name="name"
                                                value={name}
                                                onChange={this.handleChangeHeader}
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
                                                title="City"
                                                name="city"
                                                value={city}
                                                onChange={this.handleChangeHeader}
                                                width="15%"
                                                sort={sort}
                                                toggleSort={this.toggleSort}
                                                index="2"
                                                colDoubleClick={this.colDoubleClick}
                                                setColWidth={this.setColWidth}
                                                settingsColWidth={settingsColWidth}
                                            />
                                            <HeaderInput
                                                type="text"
                                                title="Country"
                                                name="country"
                                                value={country}
                                                onChange={this.handleChangeHeader}
                                                width="15%"
                                                sort={sort}
                                                toggleSort={this.toggleSort}
                                                index="3"
                                                colDoubleClick={this.colDoubleClick}
                                                setColWidth={this.setColWidth}
                                                settingsColWidth={settingsColWidth}
                                            />
                                            <HeaderInput
                                                type="text"
                                                title="Region"
                                                name="region"
                                                value={region}
                                                onChange={this.handleChangeHeader}
                                                width="15%"
                                                sort={sort}
                                                toggleSort={this.toggleSort}
                                                index="4"
                                                colDoubleClick={this.colDoubleClick}
                                                setColWidth={this.setColWidth}
                                                settingsColWidth={settingsColWidth}
                                            />
                                        </tr>
                                    </thead>
                                    <tbody className="full-height">
                                        {opcos.items && this.filterName(opcos.items).map((o) =>
                                            <tr key={o._id} style={{cursor: 'pointer'}} onClick={(event) => this.handleOnclick(event, o._id)}>
                                                <td className="no-select">{o.code}</td>
                                                <td className="no-select">{o.name}</td>
                                                <td className="no-select">{o.city}</td>
                                                <td className="no-select">{o.country}</td>
                                                <td className="no-select">{o.region.name}</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>


                        <Modal
                            show={show}
                            hideModal={this.hideModal}
                            title={opco.id ? 'Update Opco' : 'Create Opco'}
                            // size="modal-xl"
                        >
                            <div className="col-12">
                                <form
                                    name="form"
                                    onKeyPress={this.onKeyPress}
                                    onSubmit={this.handleSubmit}
                                >
                                    <Input
                                        title="Code"
                                        name="code"
                                        type="text"
                                        value={opco.code}
                                        onChange={this.handleChangeOpco}
                                        submitted={submitted}
                                        inline={false}
                                        required={true}
                                    />
                                    <Input
                                        title="Name"
                                        name="name"
                                        type="text"
                                        value={opco.name}
                                        onChange={this.handleChangeOpco}
                                        submitted={submitted}
                                        inline={false}
                                        required={true}
                                    />
                                    <Input
                                        title="Address"
                                        name="address"
                                        type="text"
                                        value={opco.address}
                                        onChange={this.handleChangeOpco}
                                        submitted={submitted}
                                        inline={false}
                                        required={true}
                                    />
                                    <Input
                                        title="City"
                                        name="city"
                                        type="text"
                                        value={opco.city}
                                        onChange={this.handleChangeOpco}
                                        submitted={submitted}
                                        inline={false}
                                        required={true}
                                    />
                                    <Input
                                        title="Zip"
                                        name="zip"
                                        type="text"
                                        value={opco.zip}
                                        onChange={this.handleChangeOpco}
                                        submitted={submitted}
                                        inline={false}
                                        required={false}
                                    />
                                    <Input
                                        title="Country"
                                        name="country"
                                        type="text"
                                        value={opco.country}
                                        onChange={this.handleChangeOpco}
                                        submitted={submitted}
                                        inline={false}
                                        required={true}
                                    />
                                    <Select
                                        title="Region"
                                        name="regionId"
                                        options={arraySorted(regions.items, 'name')}
                                        value={opco.regionId}
                                        onChange={this.handleChangeOpco}
                                        placeholder=""
                                        submitted={submitted}
                                        inline={false}
                                        required={true}
                                    />
                                    <Select
                                        title="Locale"
                                        name="localeId"
                                        options={arraySorted(locales.items, 'name')}
                                        value={opco.localeId}
                                        onChange={this.handleChangeOpco}
                                        placeholder=""
                                        submitted={submitted}
                                        inline={false}
                                        required={true}
                                    />
                                    <div className="modal-footer">
                                    {opco.id ?
                                        <div className="row">
                                            <button className="btn btn-leeuwen btn-lg" onClick={(event) => {this.handleDeletOpco(event, opco.id)}}>
                                                <span><FontAwesomeIcon icon={opcoDeleting ? "spinner" : "trash-alt"} className={opcoDeleting ? "fa-pulse fa-fw fa mr-2" : "fa mr-2"}/>Delete</span>
                                            </button>
                                            <button type="submit" className="btn btn-leeuwen-blue btn-lg" >
                                                <span><FontAwesomeIcon icon={opcoUpdating ? "spinner" : "edit"} className={opcoUpdating ? "fa-pulse fa-fw fa mr-2" : "fa mr-2"}/>Update</span>
                                            </button>
                                        </div>
                                    :
                                        <button type="submit" className="btn btn-leeuwen-blue btn-lg btn-full" >
                                            <span><FontAwesomeIcon icon={opcoCreating ? "spinner" : "plus"} className={opcoCreating ? "fa-pulse fa-fw fa mr-2" : "fa mr-2"}/>Create</span>
                                        </button>
                                    }
                                    </div>
                                </form>
                            </div>
                        </Modal>
                    {/* </div> */}
                </div>
            </Layout>
        );
    }
}

function mapStateToProps(state) {
    const { alert, locales, opcos, regions, sidemenu } = state;
    const { opcoCreating, opcoUpdating, opcoDeleting } = state.opcos;
    return {
        alert,
        locales,
        opcos,
        opcoCreating,
        opcoUpdating,
        opcoDeleting,
        regions,
        sidemenu
    };
}

const connectedOpco = connect(mapStateToProps)(Opco);
export { connectedOpco as Opco };