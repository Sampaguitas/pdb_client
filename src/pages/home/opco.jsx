import React from 'react';
import { connect } from 'react-redux';
import { opcoActions } from '../../_actions';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

//Components
import CheckBox from '../../_components/check-box';
import Input from '../../_components/input';
import Layout from '../../_components/layout';


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
                email: ''
            },
            submitted: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleCheck = this.handleCheck.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleCheck(event) {
        const target = event.target;
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({
            [name]: value
        });
    }
    handleChange(event) {
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

        this.setState({ submitted: true });
        const { opco } = this.state;
        const { dispatch } = this.props;
        if (
            opco.name &&
            opco.address &&
            opco.city &&
            opco.country
        ) {
            dispatch(opcoActions.create(opco));
            this.setState({
                opco: {
                    name: '',
                    address: '',
                    zip: '',
                    city: '',
                    country: '',
                    phone: '',
                    fax: '',
                    email: ''
                },
                submitted: false   
            })
        }
    }
    handleDeletOpco(id) {
        return (event) => this.props.dispatch(opcoActions.delete(id));
    }
    render() {
        const { alert, loading } = this.props;
        const { opco, submitted } = this.state;
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
                        onChange={this.handleChange}
                        submitted={submitted}
                        inline={true}
                        required={true}
                    />
                    <Input
                        title="Address"
                        name="address"
                        type="text"
                        value={opco.address}
                        onChange={this.handleChange}
                        submitted={submitted}
                        inline={true}
                        required={true}
                    />
                    <Input
                        title="ZIP"
                        name="zip"
                        type="text"
                        value={opco.zip}
                        onChange={this.handleChange}
                        submitted={submitted}
                        inline={true}
                        required={true}
                    />
                    <Input
                        title="City"
                        name="city"
                        type="text"
                        value={opco.city}
                        onChange={this.handleChange}
                        submitted={submitted}
                        inline={true}
                        required={true}
                    />
                    <Input
                        title="Country"
                        name="country"
                        type="text"
                        value={opco.country}
                        onChange={this.handleChange}
                        submitted={submitted}
                        inline={true}
                        required={true}
                    />
                    <Input
                        title="Phone"
                        name="phone"
                        type="tel"
                        value={opco.phone}
                        onChange={this.handleChange}
                        submitted={submitted}
                        inline={true}
                        required={false}
                    />
                    <Input
                        title="Fax"
                        name="fax"
                        type="tel"
                        value={opco.fax}
                        onChange={this.handleChange}
                        submitted={submitted}
                        inline={true}
                        required={false}
                    />
                    <Input
                        title="Email"
                        name="email"
                        type="email"
                        value={opco.email}
                        onChange={this.handleChange}
                        submitted={submitted}
                        inline={true}
                        required={false}
                    />
                    <div className="text-right">
                        <button type="submit" className="btn btn-lg btn-outline-leeuwen">
                        {loading ? <FontAwesomeIcon icon="spinner" className="fa-pulse fa-1x fa-fw" /> : ''}
                        Save OPCO
                        </button>
                    </div>
                </form>
            </Layout>
        );
    }
}

function mapStateToProps(state) {
    const { alert } = state;
    const { loading } = state.opcos;
    return {
        alert,
        loading
    };
}

const connectedOpco = connect(mapStateToProps)(Opco);
export { connectedOpco as Opco };