import React from 'react';
import config from 'config';
import { authHeader } from '../../../../_helpers';
import Modal from "../../../../_components/modal";
import HeaderInput from '../../../../_components/project-table/header-input';
import Input from '../../../../_components/input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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

function doesMatch(search, array, type) {
    if (!search) {
        return true;
    } else if (!array && search != 'any' && search != 'false') {
        return false;
    } else {
        switch(type) {
            case 'Id':
                return _.isEqual(search, array);
            case 'String':
                search = search.replace(/([()[{*+.$^\\|?])/g, "");
                return !!array.match(new RegExp(search, "i"));
            case 'Number':
                search = String(search).replace(/([()[{*+.$^\\|?])/g, "");
                return !!String(array).match(new RegExp(search, "i"));
            case 'Boolean':
                if(search == 'any') {
                    return true; //any or equal
                } else if (search == 'true' && !!array) {
                    return true; //true
                } else if (search == 'false' && !array) {
                    return true; //true
                } else {
                    return false;
                }                
            case 'Select':
                if(search == 'any' || _.isEqual(search, array)) {
                    return true; //any or equal
                } else {
                    return false;
                }
            default: return true;
        }
    }
}
class Suppliers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            supplier: {},
            name: '',
            registeredName: '',
            contact: '',
            position: '',
            tel: '',
            fax: '',
            mail: '',
            address: '',
            city: '',
            country: '',
            loaded: false,
            show: false,
            submitted: false,
            loading: false,
            deleting: false
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.handleChangeSupplier = this.handleChangeSupplier.bind(this);
        this.handleChangeHeader = this.handleChangeHeader.bind(this);
        this.filterName = this.filterName.bind(this);
        this.handleOnclick = this.handleOnclick.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
    };    

    handleSubmit(event) {
        event.preventDefault();
        const { supplier } = this.state;
        const { handleSelectionReload } = this.props
        this.setState({ submitted: true }, () => {
            if (supplier.id && supplier.name && supplier.projectId) {
                this.setState({loading: true}, () => {
                    const requestOptions = {
                        method: 'PUT',
                        headers: { ...authHeader(), 'Content-Type': 'application/json' }, //, 'Content-Type': 'application/json'
                        body: JSON.stringify(supplier)
                    }
                    return fetch(`${config.apiUrl}/supplier/update?id=${supplier.id}`, requestOptions)
                    .then( () => {
                        this.setState({submitted: false, loading: false},
                            ()=> {
                                this.hideModal(event),
                                handleSelectionReload();
                            });
                    })
                    .catch( err => {
                        this.setState({submitted: false, loading: false},
                            ()=> {
                                this.hideModal(event),
                                handleSelectionReload();
                            });
                    });
                });
            } else if (supplier.name && supplier.projectId){
                this.setState({loading: true}, () => {
                    const requestOptions = {
                        method: 'POST',
                        headers: { ...authHeader(), 'Content-Type': 'application/json' }, //, 'Content-Type': 'application/json'
                        body: JSON.stringify(supplier)
                    }
                    return fetch(`${config.apiUrl}/supplier/create`, requestOptions)
                    .then( () => {
                        this.setState({submitted: false, loading: false},
                            ()=> {
                                this.hideModal(event),
                                handleSelectionReload();
                            })
                    })
                    .catch( err => {
                        this.setState({submitted: false, loading: false},
                            ()=> {
                                this.hideModal(event),
                                handleSelectionReload();
                            });
                    });
                });
            } else {
                console.log('supplier name or Id is missing')
            }
        });
    }

    handleDelete(event, id) {
        event.preventDefault();
        const { handleSelectionReload } = this.props;
        if (id) {
            this.setState({ submitted: true, deleting: true }, () => {
                const requestOptions = {
                    method: 'DELETE',
                    headers: authHeader()
                };
                return fetch(`${config.apiUrl}/supplier/delete?id=${id}`, requestOptions)
                .then( () => {
                    this.setState({submitted: false, deleting: false},
                        ()=> {
                            this.hideModal(event),
                            handleSelectionReload();
                        });
                })
                .catch( err => {
                    this.setState({submitted: false, deleting: false},
                        ()=> {
                            this.hideModal(event),
                            handleSelectionReload();
                        });
                });
            });          
        }

    }

    showModal() {
        const { projectId } = this.props
        if (projectId) {
            this.setState({
                supplier: {
                    name: "",
                    registeredName: "",
                    contact: "",
                    position: "",
                    tel: "",
                    fax: "",
                    mail: "",
                    address: "",
                    city: "",
                    country: "",
                    udfSpX1: "",
                    udfSpX2: "",
                    udfSpX3: "",
                    udfSpX4: "",
                    udfSpX5: "",
                    udfSpX6: "",
                    udfSpX7: "",
                    udfSpX8: "",
                    udfSpX9: "",
                    udfSpX10: "",
                    udfSp91: "",
                    udfSp92: "",
                    udfSp93: "",
                    udfSp94: "",
                    udfSp95: "",
                    udfSp96: "",
                    udfSp97: "",
                    udfSp98: "",
                    udfSp99: "",
                    udfSp910: "",
                    udfSpD1: "",
                    udfSpD2: "",
                    udfSpD3: "",
                    udfSpD4: "",
                    udfSpD5: "",
                    udfSpD6: "",
                    udfSpD7: "",
                    udfSpD8: "",
                    udfSpD9: "",
                    udfSpD10: "",
                    projectId: projectId,
                    daveId: ""
            },
            show: true,
            submitted: false,
            });
        }
      }
    
      hideModal() {
        this.setState({
            supplier: {
                name: "",
                registeredName: "",
                contact: "",
                position: "",
                tel: "",
                fax: "",
                mail: "",
                address: "",
                city: "",
                country: "",
                udfSpX1: "",
                udfSpX2: "",
                udfSpX3: "",
                udfSpX4: "",
                udfSpX5: "",
                udfSpX6: "",
                udfSpX7: "",
                udfSpX8: "",
                udfSpX9: "",
                udfSpX10: "",
                udfSp91: "",
                udfSp92: "",
                udfSp93: "",
                udfSp94: "",
                udfSp95: "",
                udfSp96: "",
                udfSp97: "",
                udfSp98: "",
                udfSp99: "",
                udfSp910: "",
                udfSpD1: "",
                udfSpD2: "",
                udfSpD3: "",
                udfSpD4: "",
                udfSpD5: "",
                udfSpD6: "",
                udfSpD7: "",
                udfSpD8: "",
                udfSpD9: "",
                udfSpD10: "",
                projectId: "",
                daveId: ""
          },
          show: false,
          submitted: false,
        });
      }

    handleChangeSupplier(event) {
        const target = event.target;
        const { supplier } = this.state
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({
            supplier: {
                ...supplier,
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

    filterName(selection){
        
        const { 
            name,
            registeredName,
            contact,
            position,
            tel,
            fax,
            mail,
            address,
            city,
            country,
        } = this.state;

        if (selection.project.suppliers) {
          return arraySorted(selection.project.suppliers, 'name').filter(function (supplier) {
            return (doesMatch(name, supplier.name, 'String') 
            && doesMatch(registeredName, supplier.registeredName, 'String') 
            && doesMatch(contact, supplier.contact, 'String')
            && doesMatch(position, supplier.position, 'String')
            && doesMatch(city, supplier.city, 'String')
            && doesMatch(country, supplier.country, 'String'));
          });
        } else {
            return [];
        }
    }

    handleOnclick(event, id) {
        const { project } = this.props.selection
        if (event.target.type != 'checkbox' && project.suppliers) {
          let found = project.suppliers.find(element => element._id === id);
          this.setState({
            supplier: {
              id: id,
              name: found.name,
              registeredName: found.registeredName,
              contact: found.contact,
              position: found.position,
              tel: found.tel,
              fax: found.fax,
              mail: found.mail,
              address: found.address,
              city: found.city,
              country: found.country,
              udfSpX1: found.udfSpX1,
              udfSpX2: found.udfSpX2,
              udfSpX3: found.udfSpX3,
              udfSpX4: found.udfSpX4,
              udfSpX5: found.udfSpX5,
              udfSpX6: found.udfSpX6,
              udfSpX7: found.udfSpX7,
              udfSpX8: found.udfSpX8,
              udfSpX9: found.udfSpX9,
              udfSpX10: found.udfSpX10,
              udfSp91: found.udfSp91,
              udfSp92: found.udfSp92,
              udfSp93: found.udfSp93,
              udfSp94: found.udfSp94,
              udfSp95: found.udfSp95,
              udfSp96: found.udfSp96,
              udfSp97: found.udfSp97,
              udfSp98: found.udfSp98,
              udfSp99: found.udfSp99,
              udfSp910: found.udfSp910,
              udfSpD1: found.udfSpD1,
              udfSpD2: found.udfSpD2,
              udfSpD3: found.udfSpD3,
              udfSpD4: found.udfSpD4,
              udfSpD5: found.udfSpD5,
              udfSpD6: found.udfSpD6,
              udfSpD7: found.udfSpD7,
              udfSpD8: found.udfSpD8,
              udfSpD9: found.udfSpD9,
              udfSpD10: found.udfSpD10,
              projectId: found.projectId,
              daveId: found.daveId
            },
            show: true,
            submitted: false,
          });
        }
    }

    onKeyPress(event) {
        if (event.which === 13 /* prevent form submit on key Enter */) {
            event.preventDefault();
        }
    } 

    render() {

        const { 
            tab,
            selection,                  
        } = this.props

        const { 
            supplier, 
            name, 
            registeredName, 
            contact, 
            position,
            city,
            country,
            show,
            submitted,
            loading,
            deleting,     
        } = this.state;

        return (
            <div className="tab-pane fade show full-height" id={tab.id} role="tabpanel">
                <div className="action-row row ml-1 mb-3 mr-1" style={{height: '34px'}}>
                    <div className="ml-auto pull-right">
                        <button
                            className="btn btn-leeuwen-blue btn-lg"
                            onClick={this.showModal}
                            style={{height: '34px'}}
                        >
                            <span><FontAwesomeIcon icon="plus" className="fa-lg mr-2"/>Create Supplier</span>
                        </button>
                    </div>
                </div>
                <div className="" style={{height: 'calc(100% - 44px)'}}>
                    <div className="row ml-1 mr-1 full-height" style={{borderStyle: 'solid', borderWidth: '1px', borderColor: '#ddd'}}>
                        <div className="table-responsive custom-table-container">
                            <table className="table table-hover table-bordered table-sm">
                                <thead>
                                    <tr>
                                        <HeaderInput
                                            type="text"
                                            title="Name"
                                            name="name"
                                            value={name}
                                            onChange={this.handleChangeHeader}
                                            // width="16.6667%"
                                        />                                            
                                        <HeaderInput
                                            type="text"
                                            title="Registered Name"
                                            name="registeredName"
                                            value={registeredName}
                                            onChange={this.handleChangeHeader}
                                            // width="16.6667%"
                                        />
                                        <HeaderInput
                                            type="text"
                                            title="Contact"
                                            name="contact"
                                            value={contact}
                                            onChange={this.handleChangeHeader}
                                            // width="16.6667%"
                                        />                                            
                                        <HeaderInput
                                            type="text"
                                            title="Position"
                                            name="position"
                                            value={position}
                                            onChange={this.handleChangeHeader}
                                            // width="16.6667%"
                                        />                                            
                                        <HeaderInput
                                            type="text"
                                            title="City"
                                            name="city"
                                            value={city}
                                            onChange={this.handleChangeHeader}
                                            // width="16.6667%"
                                        />                                            
                                        <HeaderInput
                                            type="text"
                                            title="Country"
                                            name="country"
                                            value={country}
                                            onChange={this.handleChangeHeader}
                                            // width="16.6667%"
                                        />
                                    </tr>
                                </thead>
                                <tbody className="full-height">
                                    {selection && selection.project && this.filterName(selection).map((s) =>
                                        <tr key={s._id} style={{cursor: 'pointer'}} onClick={(event) => this.handleOnclick(event, s._id)}>
                                            <td>{s.name}</td>
                                            <td>{s.registeredName}</td>
                                            <td>{s.contact}</td>
                                            <td>{s.position}</td>
                                            <td>{s.city}</td>
                                            <td>{s.country}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            <Modal
                                show={show}
                                hideModal={this.hideModal}
                                title={supplier.id ? 'Update supplier' : 'Add supplier'}
                            >
                                <div className="col-12">
                                    <form
                                        name="form"
                                        onKeyPress={this.onKeyPress}
                                    >
                                        <Input
                                            title="Name"
                                            name="name"
                                            type="text"
                                            value={supplier.name}
                                            onChange={this.handleChangeSupplier}
                                            submitted={submitted}
                                            inline={false}
                                            required={true}
                                        />
                                        <Input
                                            title="Registered Name"
                                            name="registeredName"
                                            type="text"
                                            value={supplier.registeredName}
                                            onChange={this.handleChangeSupplier}
                                            submitted={submitted}
                                            inline={false}
                                            required={false}
                                        />
                                        <Input
                                            title="Contact"
                                            name="contact"
                                            type="text"
                                            value={supplier.contact}
                                            onChange={this.handleChangeSupplier}
                                            submitted={submitted}
                                            inline={false}
                                            required={false}
                                        />
                                        <Input
                                            title="Position"
                                            name="position"
                                            type="text"
                                            value={supplier.position}
                                            onChange={this.handleChangeSupplier}
                                            submitted={submitted}
                                            inline={false}
                                            required={false}
                                        />
                                        <Input
                                            title="Tel"
                                            name="tel"
                                            type="text"
                                            value={supplier.tel}
                                            onChange={this.handleChangeSupplier}
                                            submitted={submitted}
                                            inline={false}
                                            required={false}
                                        />
                                        <Input
                                            title="Fax"
                                            name="fax"
                                            type="text"
                                            value={supplier.fax}
                                            onChange={this.handleChangeSupplier}
                                            submitted={submitted}
                                            inline={false}
                                            required={false}
                                        />
                                        <Input
                                            title="Mail"
                                            name="mail"
                                            type="text"
                                            value={supplier.mail}
                                            onChange={this.handleChangeSupplier}
                                            submitted={submitted}
                                            inline={false}
                                            required={false}
                                        />
                                        <Input
                                            title="Address"
                                            name="address"
                                            type="text"
                                            value={supplier.address}
                                            onChange={this.handleChangeSupplier}
                                            submitted={submitted}
                                            inline={false}
                                            required={false}
                                        />
                                        <Input
                                            title="City"
                                            name="city"
                                            type="text"
                                            value={supplier.city}
                                            onChange={this.handleChangeSupplier}
                                            submitted={submitted}
                                            inline={false}
                                            required={false}
                                        />
                                        <Input
                                            title="Country"
                                            name="country"
                                            type="text"
                                            value={supplier.country}
                                            onChange={this.handleChangeSupplier}
                                            submitted={submitted}
                                            inline={false}
                                            required={false}
                                        />
                                        <div className="modal-footer">
                                            {supplier.id ?
                                                <div className="row">
                                                    <div className="col-6">
                                                        <button
                                                            type="submit"
                                                            className="btn btn-leeuwen btn-lg"
                                                            onClick={(event) => this.handleDelete(event, supplier.id)}
                                                        >
                                                            {deleting && (
                                                                <FontAwesomeIcon
                                                                    icon="spinner"
                                                                    className="fa-pulse fa-1x fa-fw" 
                                                                />
                                                            )}
                                                            Delete
                                                        </button>
                                                    </div>
                                                    <div className="col-6">
                                                        <button
                                                            type="submit"
                                                            className="btn btn-leeuwen-blue btn-lg" //handleSubmitSupplier
                                                            onClick={(event) => this.handleSubmit(event, supplier)}
                                                        >
                                                            {loading && (
                                                                <FontAwesomeIcon
                                                                    icon="spinner"
                                                                    className="fa-pulse fa-1x fa-fw" 
                                                                />
                                                            )}
                                                            Update
                                                        </button>
                                                    </div>
                                                </div>
                                            :
                                                <button
                                                    type="submit"
                                                    className="btn btn-leeuwen-blue btn-lg btn-full"
                                                    onClick={(event) => this.handleSubmit(event, supplier)}
                                                >
                                                    {loading && (
                                                        <FontAwesomeIcon
                                                            icon="spinner"
                                                            className="fa-pulse fa-1x fa-fw" 
                                                        />
                                                    )}
                                                    Create
                                                </button>
                                            }
                                        </div>
                                    </form>
                                </div>
                            </Modal>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Suppliers;
