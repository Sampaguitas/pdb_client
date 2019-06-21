import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//Components
import Modal from "../../../../_components/modal/modal.js"
import CheckBox from '../../../../_components/check-box';
import Input from '../../../../_components/input';
import Select from '../../../../_components/select';
import SupplierRow from '../../../../_components/project-table/supplier-row.js';

function arraySorted(array, field) {
    if (array) {
        const newArray = array
        newArray.sort(function(a,b){
            if (a[field] < b[field]) {
                return -1;
            }
            if (a[field] > b[field]) {
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
    } else if (!array && search) {
        return false;
    } else {
        switch(type) {
            case 'String':
                search = search.replace(/([()[{*+.$^\\|?])/g, "");
                return !!array.match(new RegExp(search, "i"));
            case 'Number': 
                return array == Number(search);
            case 'Boolean':
                if (Number(search) == 1) {
                return true; //any
                } else if (Number(search) == 2) {
                return !!array == 1; //true
                } else if (Number(search) == 3) {
                return !!array == 0; //false
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
        }
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.handleChangeSupplier = this.handleChangeSupplier.bind(this);
        this.handleChangeHeader = this.handleChangeHeader.bind(this);
        this.filterName = this.filterName.bind(this);
        this.handleOnclick = this.handleOnclick.bind(this);
    };

    showModal() {
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
          show: true
        });
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
          show: false
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
            && doesMatch(tel, supplier.tel, 'String')
            && doesMatch(fax, supplier.fax, 'String')
            && doesMatch(mail, supplier.mail, 'String')
            && doesMatch(address, supplier.address, 'String')
            && doesMatch(city, supplier.city, 'String')
            && doesMatch(country, supplier.country, 'String'));
          });
        } else {
            return [];
        }
    }

    handleOnclick(event, id) {
        const { project } = this.props.selection
        // let user = JSON.parse(localStorage.getItem('user'));
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
            show: true
          })
        }
      }

    render() {

        const { 
            handleSubmitSupplier,
            handleDeleteSupplier,
            SupplierUpdating,
            SupplierCreating,
            SupplierDeleting,
            submittedSupplier,
            selection,                  
            tab,
            // currentUser
        } = this.props

        const { 
            supplier, 
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
            show
        } = this.state;
        
        return (
            <div className="tab-pane fade show full-height" id={tab.id} role="tabpanel">
                <div className="row full-height">
                    <div className="col-12 full-height">
                        <div className="card full-height">
                            <div className="card-header">
                                <div className="row">
                                    <div className="col-8">
                                        <h5>Add or Update supplier information</h5>
                                    </div>
                                    <div className="col-4 text-right">
                                        <div className="modal-link" >
                                            <FontAwesomeIcon icon="plus" className="red" name="plus" onClick={this.showModal}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                             <div className="card-body" style={{display: 'block', overflow: 'scroll', height: '100%'}}> {/*style={{display: 'block', overflow: 'scroll', height: '100%'}} */}
                                <table className="table table-hover table-bordered" > {/*table-bordered*/}
                                    <thead>
                                        <tr>
                                            <th className="text-nowrap" style={{minWidth: '100px'}}>Name<br />
                                                <input className="form-control" name="name" value={name} onChange={this.handleChangeHeader} />
                                            </th>
                                            <th className="text-nowrap" style={{minWidth: '100px'}}>Registered Name<br />
                                                <input className="form-control" name="registeredName" value={registeredName} onChange={this.handleChangeHeader} />                                            
                                            </th>
                                            <th className="text-nowrap" style={{minWidth: '100px'}}>Contact<br />
                                                <input className="form-control" name="contact" value={contact} onChange={this.handleChangeHeader} />
                                            </th>
                                            <th className="text-nowrap" style={{minWidth: '100px'}}>Position<br />
                                                <input className="form-control" name="position" value={position} onChange={this.handleChangeHeader} />
                                            </th>
                                            <th className="text-nowrap" style={{minWidth: '100px'}}>Tel<br />
                                                <input className="form-control" name="tel" value={tel} onChange={this.handleChangeHeader} />
                                            </th>
                                            <th className="text-nowrap" style={{minWidth: '100px'}}>Fax<br />
                                                <input className="form-control" name="fax" value={fax} onChange={this.handleChangeHeader} />
                                            </th>
                                            <th className="text-nowrap" style={{minWidth: '100px'}}>Mail<br />
                                                <input className="form-control" name="mail" value={mail} onChange={this.handleChangeHeader} />
                                            </th>
                                            <th className="text-nowrap" style={{minWidth: '100px'}}>Address<br />
                                                <input className="form-control" name="address" value={address} onChange={this.handleChangeHeader} />
                                            </th>
                                            <th className="text-nowrap" style={{minWidth: '100px'}}>City<br />
                                                <input className="form-control" name="city" value={city} onChange={this.handleChangeHeader} />
                                            </th>
                                            <th className="text-nowrap" style={{minWidth: '100px'}}>Country<br />
                                                <input className="form-control" name="country" value={country} onChange={this.handleChangeHeader} />
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selection && selection.project && this.filterName(selection).map((s) =>
                                            <tr key={s._id} onClick={(event) => this.handleOnclick(event, s._id)}>
                                                <td className="text-nowrap" style={{minWidth: '100px'}}>{s.name}</td>
                                                <td className="text-nowrap" style={{minWidth: '100px'}}>{s.registeredName}</td>
                                                <td className="text-nowrap" style={{minWidth: '100px'}}>{s.contact}</td>
                                                <td className="text-nowrap" style={{minWidth: '100px'}}>{s.position}</td>
                                                <td className="text-nowrap" style={{minWidth: '100px'}}>{s.tel}</td>
                                                <td className="text-nowrap" style={{minWidth: '100px'}}>{s.fax}</td>
                                                <td className="text-nowrap" style={{minWidth: '100px'}}>{s.mail}</td>
                                                <td className="text-nowrap" style={{minWidth: '100px'}}>{s.address}</td>
                                                <td className="text-nowrap" style={{minWidth: '100px'}}>{s.city}</td>
                                                <td className="text-nowrap" style={{minWidth: '100px'}}>{s.country}</td>
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
                                        <form name="form">
                                            <Input
                                                title="Name"
                                                name="name"
                                                type="text"
                                                value={supplier.name}
                                                onChange={this.handleChangeSupplier}
                                                submitted={submittedSupplier}
                                                inline={false}
                                                required={true}
                                            />
                                            <Input
                                                title="Registered Name"
                                                name="registeredName"
                                                type="text"
                                                value={supplier.registeredName}
                                                onChange={this.handleChangeSupplier}
                                                submitted={submittedSupplier}
                                                inline={false}
                                                required={true}
                                            />
                                            <Input
                                                title="Contact"
                                                name="contact"
                                                type="text"
                                                value={supplier.contact}
                                                onChange={this.handleChangeSupplier}
                                                submitted={submittedSupplier}
                                                inline={false}
                                                required={true}
                                            />
                                            <Input
                                                title="Position"
                                                name="position"
                                                type="text"
                                                value={supplier.position}
                                                onChange={this.handleChangeSupplier}
                                                submitted={submittedSupplier}
                                                inline={false}
                                                required={true}
                                            />
                                            <Input
                                                title="Tel"
                                                name="tel"
                                                type="text"
                                                value={supplier.tel}
                                                onChange={this.handleChangeSupplier}
                                                submitted={submittedSupplier}
                                                inline={false}
                                                required={true}
                                            />
                                            <Input
                                                title="Fax"
                                                name="fax"
                                                type="text"
                                                value={supplier.fax}
                                                onChange={this.handleChangeSupplier}
                                                submitted={submittedSupplier}
                                                inline={false}
                                                required={true}
                                            />
                                            <Input
                                                title="Mail"
                                                name="mail"
                                                type="text"
                                                value={supplier.mail}
                                                onChange={this.handleChangeSupplier}
                                                submitted={submittedSupplier}
                                                inline={false}
                                                required={true}
                                            />
                                            <Input
                                                title="Address"
                                                name="address"
                                                type="text"
                                                value={supplier.address}
                                                onChange={this.handleChangeSupplier}
                                                submitted={submittedSupplier}
                                                inline={false}
                                                required={true}
                                            />
                                            <Input
                                                title="City"
                                                name="city"
                                                type="text"
                                                value={supplier.city}
                                                onChange={this.handleChangeSupplier}
                                                submitted={submittedSupplier}
                                                inline={false}
                                                required={true}
                                            />
                                            <Input
                                                title="Country"
                                                name="country"
                                                type="text"
                                                value={supplier.country}
                                                onChange={this.handleChangeSupplier}
                                                submitted={submittedSupplier}
                                                inline={false}
                                                required={true}
                                            />
                                            <div className="modal-footer">
                                                {supplier.id ?
                                                    <div className="row">
                                                        <div className="col-6">
                                                            <button
                                                                type="submit"
                                                                className="btn btn-outline-dark btn-lg"
                                                                onClick={(event) => {handleDeleteSupplier(event, supplier.id)}}
                                                            >
                                                                {SupplierDeleting && (
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
                                                                className="btn btn-outline-leeuwen btn-lg" //handleSubmitSupplier
                                                                onClick={(event) => {handleSubmitSupplier(event, supplier)}}
                                                            >
                                                                {SupplierUpdating && (
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
                                                        className="btn btn-outline-leeuwen btn-lg btn-full"
                                                        onClick={(event) => {handleSubmitSupplier(event, supplier)}}
                                                    >
                                                        {SupplierCreating && (
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
            </div>
        );
    }
}

export default Suppliers;
