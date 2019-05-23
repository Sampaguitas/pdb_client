import React from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import config from 'config';
import { opcoActions, localeActions } from '../../_actions';
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
                id:'',
                code: '',
                name: '',
                address: '',
                city: '',
                zip: '',
                country: '',
                localeId: ''
            },
            submitted: false,
        };
        this.handleChangeOpco = this.handleChangeOpco.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.getById = this.getById.bind(this);
        this.handleResponse = this.handleResponse.bind(this);
    }

    componentDidMount() {
        const { location, users } = this.props;
        this.props.dispatch(opcoActions.getAll());
        this.props.dispatch(localeActions.getAll());
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

    handleSubmit(event) {
        event.preventDefault();
        const { opco } = this.state;
        const { dispatch } = this.props;
        this.setState({ submitted: true });
        if (opco.name && opco.address && opco.city && opco.country && localeId) {
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
        const { alert, loading, deleting, locales, opcos } = this.props;
        const { opco, submitted } = this.state;
        return (
            <Layout>
                {alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div>}
                <br />
                <div id="Opco">
                <h2>Add Operation Company</h2>
                    <hr />
                    <div className="row">
                        <div className="col-md-8 col-sm-12 mb-sm-3">
                            <div className="card">
                                <div className="card-header">
                                    <h5>Operation Companies</h5>
                                </div>
                                <div className="card-body table-responsive">
                                    <table className="table table-hover">
                                        <thead>
                                            <tr>
                                                <th>Code</th>
                                                <th>Name</th>
                                                <th>Country</th>
                                                <th>Locale</th>
                                            </tr>
                                        </thead>
                                        {opcos.items && (
                                            <tbody>
                                                {opcos.items.map(o => (
                                                    <tr key={o._id}>
                                                        <td>{o.code}</td>
                                                        <td>{o.name}</td>
                                                        <td>{o.country}</td>
                                                        <td>{o.locale.name}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        )}
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5>General information</h5>
                                </div>
                                <div className="card-body">
                                <form onSubmit={this.handleSubmit}>
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
                                            required={true}
                                        />
                                        <Input
                                            title="Country"
                                            name="country"
                                            type="tel"
                                            value={opco.country}
                                            onChange={this.handleChangeOpco}
                                            submitted={submitted}
                                            inline={false}
                                            required={false}
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
                                        <div className="text-right">
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
                                                Save OPCO
                                            </button>
                                        </div>
                                    </form>
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
    const { loading, deleting } = state.opcos;
    const { opcos, alert, locales } = state;
    return {
        alert,
        loading,
        deleting,
        locales,
        opcos
    };
}

const connectedOpco = connect(mapStateToProps)(Opco);
export { connectedOpco as Opco };