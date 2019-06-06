import React from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import config from 'config';
import { opcoActions, localeActions, regionActions } from '../../_actions';
import { authHeader } from '../../_helpers';
import CheckBox from '../../_components/check-box';
import Modal from "../../_components/modal/modal.js"
import Input from '../../_components/input';
import Layout from '../../_components/layout';
import Select from '../../_components/select';
import { users } from '../../_reducers/users.reducer';
import OpcoRow from '../../_components/project-table/opco-row.js';

function opcosSorted(opco) {
    if (opco.items) {
        const newArray = opco.items
        newArray.sort(function(a,b){
            if (a.name < b.name) {
                return -1;
            }
            if (a.name > b.name) {
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
            case 'Boolean':
              if (Number(search) == 1) {
                return true;
              } else if (Number(search) == 2) {
                return !!array == 1;
              } else if (Number(search) == 3) {
                return !!array == 0;
              }
            default: return true;
        }
    }
  }


class Opco extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            opco: {},
            code: "",
            name: "",
            city: "",
            country: "",
            region: "",
            locale: "",
            submitted: false,
            show: false,
        };
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.handleChangeOpco = this.handleChangeOpco.bind(this);
        this.handleChangeHeader = this.handleChangeHeader.bind(this);
        this.filterName = this.filterName.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleOnclick = this.handleOnclick.bind(this);
        // this.handleDelete = this.handleDelete.bind(this);
        // this.getById = this.getById.bind(this);
        // this.handleResponse = this.handleResponse.bind(this);
    }

    componentDidMount() {
        const { location, users } = this.props;
        this.props.dispatch(opcoActions.getAll());
        this.props.dispatch(localeActions.getAll());
        this.props.dispatch(regionActions.getAll());
        var qs = queryString.parse(location.search);
        // if (qs.id) {
        //     this.getById(qs.id);
        // }
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

    filterName(opcos){
        const { code, name, city, country, locale, region } = this.state
        if (opcos.items) {
          return opcosSorted(opcos).filter(function (opco) {
            return (doesMatch(code, opco.code, 'String') 
            && doesMatch(name, opco.name, 'String') 
            && doesMatch(city, opco.city, 'String')
            && doesMatch(country, opco.country, 'String')
            && doesMatch(locale, opco.locale.name, 'String')
            && doesMatch(region, opco.region.name, 'String'));
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
            opco.name &&
            opco.address &&
            opco.city &&
            opco.country &&
            opco.localeId &&
            opco.regionId
        ) {
            dispatch(opcoActions.update(opco));
            this.hideModal();
            this.setState({ submitted: false });
        } else if (
            opco.name &&
            opco.address &&
            opco.city &&
            opco.country &&
            opco.localeId &&
            opco.regionId
        ){
            dispatch(opcoActions.create(opco));
            this.hideModal();
            this.setState({ submitted: false });
        }
    }

    handleOnclick(event, id) {
        let user = JSON.parse(localStorage.getItem('user'));
        if (event.target.type != 'checkbox' && this.props.opcos.items && user.isSuperAdmin) {
          let found = this.props.opcos.items.find(element => element.id === id);
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

    // getById(id) {
    //     const requestOptions = {
    //         method: 'GET',
    //         headers: authHeader()
    //     };

    //     return fetch(`${config.apiUrl}/opco/findOne/?id=${id}`, requestOptions)
    //         .then(this.handleResponse)
    //         .then(data => this.setState({
    //             opco: data
    //         }));
    // }

    // handleDelete(event) {
    //     event.preventDefault();
    //     const { dispatch } = this.props;
    //     const { opco } = this.state;
    //     dispatch(opcoActions.delete(opco.id));
    // }

    // handleResponse(response) {
    //     return response.text().then(text => {
    //         const data = text && JSON.parse(text);
    //         if (!response.ok) {
    //             if (response.status === 401) {
    //                 // auto logout if 401 response returned from api
    //                 logout();
    //                 location.reload(true);
    //             }
    //             const error = (data && data.message) || response.statusText;
    //             return Promise.reject(error);
    //         }
    //         return data;
    //     });
    // }

    render() {
        const { alert, loading, deleting, locales, regions, opcos } = this.props;
        const { opco, code, name, address, city, zip, country, locale, region, submitted } = this.state;
        return (
            <Layout>
                {alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div>}
                <br />
                <h2>Add operation company</h2>
                <hr />
                <div id="Opco">
                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header">
                                    <div className="row">
                                        <div className="col-8">
                                            <h5>Operation companies</h5>
                                        </div>
                                        <div className="col-4 text-right">
                                            <div className="modal-link" >
                                                <FontAwesomeIcon icon="plus" className="red" name="plus" onClick={this.showModal}/>
                                            </div> 
                                        </div>
                                    </div>  
                                </div>
                                <div className="card-body table-responsive">
                                    <table className="table table-hover">
                                        <thead>
                                            <tr>
                                                <th>Code<br />
                                                    <input className="form-control" name="code" value={code} onChange={this.handleChangeHeader} />
                                                </th>
                                                <th>Name<br />
                                                    <input className="form-control" name="name" value={name} onChange={this.handleChangeHeader} />
                                                </th>
                                                <th>city<br />
                                                    <input className="form-control" name="city" value={city} onChange={this.handleChangeHeader} />
                                                </th>
                                                <th>Country<br />
                                                    <input className="form-control" name="country" value={country} onChange={this.handleChangeHeader} />
                                                </th>
                                                <th>Region<br />
                                                    <input className="form-control" name="region" value={region} onChange={this.handleChangeHeader} />
                                                </th>
                                                <th>Locale<br />
                                                    <input className="form-control" name="locale" value={locale} onChange={this.handleChangeHeader} />
                                                </th>
                                            </tr>
                                        </thead>
                                            <tbody>
                                                {this.props.opcos.items && this.filterName(this.props.opcos).map((opco) =>
                                                    <OpcoRow 
                                                    opco={opco}
                                                    handleOnclick={this.handleOnclick}
                                                    key={opco._id} 
                                                    />
                                                )}
                                            </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <Modal
                            show={this.state.show}
                            hideModal={this.hideModal}
                            title={this.state.opco.id ? 'Update opco' : 'Add opco'}
                        >
                            <div className="col-12">
                                <form name="form" onSubmit={this.handleSubmit}>
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
                                        required={false}
                                    />
                                    <Select
                                        title="Region"
                                        name="regionId"
                                        options={regions.items}
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
                                        options={locales.items}
                                        value={opco.localeId}
                                        onChange={this.handleChangeOpco}
                                        placeholder=""
                                        submitted={submitted}
                                        inline={false}
                                        required={true}
                                    />
                                    <div className="modal-footer">
                                        <button
                                            type="submit"
                                            className="btn btn-leeuwen btn-full btn-lg mb-3"
                                        >
                                            {loading && (
                                                <FontAwesomeIcon
                                                    icon="spinner"
                                                    className="fa-pulse fa-1x fa-fw" 
                                                />
                                            )}
                                            {this.state.opco.id ? 'Update' : 'Create'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </Modal>
                    </div>
                </div>
            </Layout>
        );
    }
}

function mapStateToProps(state) {
    const { loading, deleting } = state.opcos;
    const { opcos, alert, regions, locales } = state;
    return {
        alert,
        loading,
        deleting,
        regions,
        locales,
        opcos
    };
}

const connectedOpco = connect(mapStateToProps)(Opco);
export { connectedOpco as Opco };