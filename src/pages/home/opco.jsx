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
        const { alert, loading, deleting, locales } = this.props;
        const { opco, submitted } = this.state;
        return (
            <Layout>
                {alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div>}
                <br />
                <h2>Add or Edit Operating Company:</h2>
                <hr />
                <form onSubmit={this.handleSubmit}>
                    <Input
                        title="Code"
                        name="code"
                        type="text"
                        value={opco.code}
                        onChange={this.handleChangeOpco}
                        submitted={submitted}
                        inline={true}
                        required={true}
                    />
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
                        title="Zip"
                        name="zip"
                        type="text"
                        value={opco.zip}
                        onChange={this.handleChangeOpco}
                        submitted={submitted}
                        inline={true}
                        required={true}
                    />
                    <Input
                        title="Country"
                        name="country"
                        type="tel"
                        value={opco.country}
                        onChange={this.handleChangeOpco}
                        submitted={submitted}
                        inline={true}
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
                        inline={true}
                        required={true}
                    />
                    <div className="text-right">
                        {opco.id &&
                        <button type="submit" className="btn btn-outline-dark btn-lg" onClick={this.handleDelete} style={{ marginRight: 10 }} >
                            {deleting ? <FontAwesomeIcon icon="spinner" className="fa-pulse fa-1x fa-fw" /> : '' }
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
    const { loading, deleting } = state.opcos;
    const { alert, locales } = state;
    return {
        alert,
        loading,
        deleting,
        locales
    };
}

const connectedOpco = connect(mapStateToProps)(Opco);
export { connectedOpco as Opco };