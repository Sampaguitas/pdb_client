import React from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import config from 'config';
import { opcoActions, userActions } from '../../_actions';
import { authHeader } from '../../_helpers';
import CheckBox from '../../_components/check-box';
import Input from '../../_components/input';
import Layout from '../../_components/layout';
import Select from '../../_components/select';
import { users } from '../../_reducers/users.reducer';


class Opco extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            opco: {
                name: '',
                address: '',
                zip: '',
                city: '',
                country: '',
                phone: '',
                fax:'',
                email: '',
                projectAdmins:[]
            },
            submitted: false,
            selectedUser:''
        };
        this.handleChangeOpco = this.handleChangeOpco.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.addProjectAdmin = this.addProjectAdmin.bind(this);
        this.removeProjectAdmin = this.removeProjectAdmin.bind(this);
        this.getById = this.getById.bind(this);
        this.handleResponse = this.handleResponse.bind(this);
    }

    componentDidMount() {
        const { location, users } = this.props;
        this.props.dispatch(userActions.getAll());
        var qs = queryString.parse(location.search);
        if (qs.id) {
            this.getById(qs.id);
        }
    }

    handleChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({
            ...this.state,
            [name]: value
        });
    }

    handleChangeOpco(event) {
        const { name, value } = event.target;
        const { opco } = this.state;
        this.setState({
            opco: {
                ...opco,
                [name]: value
            }
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        const { opco } = this.state;
        const { dispatch } = this.props;
        this.setState({ submitted: true });
        if (opco.name && opco.address && opco.city && opco.country) {
            if(opco.id){
                dispatch(opcoActions.update(opco));
            } else {
                dispatch(opcoActions.create(opco));
            }
        }
    }

    getById(id) {
        const requestOptions = {
            method: 'GET',
            headers: authHeader()
        };

        return fetch(`${config.apiUrl}/opco/findOne/?id=${id}`, requestOptions)
            .then(this.handleResponse)
            .then(data => this.setState({
                opco: data
            }));
    }

    handleDelete(event) {
        event.preventDefault();
        const { dispatch } = this.props;
        const { opco } = this.state;
        dispatch(opcoActions.delete(opco.id));
    }

    addProjectAdmin(event){
        event.preventDefault();
        const { selectedUser, opco } = this.state;
        if (selectedUser && !opco.projectAdmins.includes(selectedUser)) {
            this.setState({ 
                opco: {
                    ...opco,
                    projectAdmins: [...opco.projectAdmins, selectedUser]
                }
            });
        }
    }

    removeProjectAdmin(projectAdmin){
        event.preventDefault();
        const { opco } = this.state;
        const array = [...opco.projectAdmins];
        const index = array.indexOf(projectAdmin);
        if (index !== -1) {
            array.splice(index, 1);
            this.setState({
                opco: {
                    ...opco,
                    projectAdmins: array
                }
            });
        }
    }

    handleResponse(response) {
        return response.text().then(text => {
            const data = text && JSON.parse(text);
            if (!response.ok) {
                if (response.status === 401) {
                    // auto logout if 401 response returned from api
                    logout();
                    location.reload(true);
                }
                const error = (data && data.message) || response.statusText;
                return Promise.reject(error);
            }
            return data;
        });
    }

    render() {
        const { alert, loading, users } = this.props;
        const { opco, submitted, selectedUser } = this.state;
        return (
            <Layout>
                {alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div>}
                <br />
                <h2>Add or Edit Operating Company:</h2>
                <hr />
                <form onSubmit={this.handleSubmit}>
                    <Input
                        title="Name"
                        name="name"
                        type="text"
                        value={opco.name}
                        onChange={this.handleChangeOpco}
                        submitted={submitted}
                        inline={true}
                        required={true}
                    />
                    <Input
                        title="Address"
                        name="address"
                        type="text"
                        value={opco.address}
                        onChange={this.handleChangeOpco}
                        submitted={submitted}
                        inline={true}
                        required={true}
                    />
                    <Input
                        title="ZIP"
                        name="zip"
                        type="text"
                        value={opco.zip}
                        onChange={this.handleChangeOpco}
                        submitted={submitted}
                        inline={true}
                        required={true}
                    />
                    <Input
                        title="City"
                        name="city"
                        type="text"
                        value={opco.city}
                        onChange={this.handleChangeOpco}
                        submitted={submitted}
                        inline={true}
                        required={true}
                    />
                    <Input
                        title="Country"
                        name="country"
                        type="text"
                        value={opco.country}
                        onChange={this.handleChangeOpco}
                        submitted={submitted}
                        inline={true}
                        required={true}
                    />
                    <Input
                        title="Phone"
                        name="phone"
                        type="tel"
                        value={opco.phone}
                        onChange={this.handleChangeOpco}
                        submitted={submitted}
                        inline={true}
                        required={false}
                    />
                    <Input
                        title="Fax"
                        name="fax"
                        type="tel"
                        value={opco.fax}
                        onChange={this.handleChangeOpco}
                        submitted={submitted}
                        inline={true}
                        required={false}
                    />
                    <Input
                        title="Email"
                        name="email"
                        type="email"
                        value={opco.email}
                        onChange={this.handleChangeOpco}
                        submitted={submitted}
                        inline={true}
                        required={false}
                    />
                    <div className="form-group row">
                        <label htmlFor="selectedUser" className="col-sm-2 col-form-label">Project Admins</label>
                        <div className="col-sm-10">
                            <div className="input-group">
                                <select className="form-control" type="text" id="selectedUser" name="selectedUser" value={selectedUser} onChange={this.handleChange} >
                                    <option defaultValue="" disabled hidden></option>
                                    {users.items && users.items.sort((a, b)=> a.name.toLowerCase().localeCompare(b.name.toLowerCase())).map(option => {
                                        return (
                                            <option key={option._id} value={option._id}>{option.name}</option>
                                        );
                                    })}
                                </select>
                                <div className="input-group-append">
                                    <button className="btn btn-leeuwen-blue" type="button" onClick={this.addProjectAdmin}>
                                        <FontAwesomeIcon icon="plus"/>
                                    </button>
                                </div>
                            </div>
                            <ul className="list-group mt-3">
                                {opco.projectAdmins && opco.projectAdmins.map(projectAdmin =>
                                    <li className="list-group-item" key={projectAdmin}>
                                        <span className="inline">{users.items && users.items.find(user => user.id === projectAdmin).name}</span>
                                        <span className="pull-right">
                                            <button className="btn btn-leeuwen btn-sm right inline" onClick={() => this.removeProjectAdmin(projectAdmin)} type="button">
                                                <FontAwesomeIcon icon="trash-alt" />
                                            </button>
                                        </span>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                    <div className="text-right">
                        {opco.id &&
                        <button type="submit" className="btn btn-outline-dark btn-lg" onClick={this.handleDelete} style={{ marginRight: 10 }} >
                            {loading ? <FontAwesomeIcon icon="spinner" className="fa-pulse fa-1x fa-fw" /> : '' }
                            Remove
                        </button>
                        }
                        <button type="submit" className="btn btn-lg btn-outline-leeuwen">
                        {loading ? <FontAwesomeIcon icon="spinner" className="fa-pulse fa-1x fa-fw" /> : ''}
                        {opco.id ? 'Update OPCO' : 'Save OPCO'}
                        </button>
                    </div>
                </form>
            </Layout>
        );
    }
}

function mapStateToProps(state) {
    const { loading } = state.opcos;
    const { users, alert } = state;
    return {
        alert,
        loading,
        users
    };
}

const connectedOpco = connect(mapStateToProps)(Opco);
export { connectedOpco as Opco };