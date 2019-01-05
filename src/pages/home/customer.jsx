import React from 'react';
import { connect } from 'react-redux';
import { customerActions } from '../../_actions';
import config from 'config';
import { authHeader } from '../../_helpers';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

//Components
import CheckBox from'../../_components/check-box';
import Input from '../../_components/input';
import Layout from '../../_components/layout';


class Customer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            customer:{
                code: '',
                name: '',
                address: '',
                zip: '',
                city: '',
                country: '',
                phone: '',
                email: '',
                invoiceName: '',
                invoiceAddress: '',
                invoiceZip: '',
                invoiceCity: '',
                invoiceCountry: '',
                invoicePhone: '',
                invoiceEmail: ''
            },
            copyAddress: true,
            submitted: false,
            loading:false
        };
        this.handleCheck = this.handleCheck.bind(this);
        this.handleCopyAddress = this.handleCopyAddress.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDeleteCustomer = this.handleDeleteCustomer.bind(this);
        this.create = this.create.bind(this);
        this.handleResponse = this.handleResponse.bind(this)
        
    }
    handleCheck(){
        this.setState({
            copyAddress: !this.state.copyAddress,
        });
        this.handleCopyAddress();
    }
    handleCopyAddress(){
        this.setState({
            customer:{
                ...this.state.customer,
                invoiceName: this.state.customer.name,
                invoiceAddress: this.state.customer.address,
                invoiceZip: this.state.customer.zip,
                invoiceCity: this.state.customer.city,
                invoicecountry: this.state.customer.country,
                invoicePhone: this.state.customer.phone,
                invoiceEmail: this.state.customer.email
            }
        });
        
    }

    handleChange(event) {
        const {name, value} = event.target;
        this.setState({
            customer:{
                ...this.state.customer,
                [name]: value
            }

        });
    }
    handleSubmit(event) {
        event.preventDefault();
        this.state.copyAddress && this.handleCopyAddress();
        this.setState({ submitted: true });
        if (this.state.customer.code && this.state.customer.name) {
            this.props.dispatch(customerActions.create(this.state.customer))
            //this.create(this.state.customer);
        }
    }
    create(customer) {
        const requestOptions = {
            method: 'POST',
            headers: { ...authHeader(), 'Content-Type': 'application/json' },
            body: JSON.stringify(customer)
        };
        return fetch(`${config.apiUrl}/customer/create`, requestOptions).then(this.handleResponse);
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
    // componentDidMount() {
    //     this.getCustomer();
    // }
    handleDeleteCustomer(id) {
        return (event) => this.props.dispatch(customerActions.delete(id));
    }
    render() {
        const { alert, loading } = this.props;
        const { copyAddress, customer, submitted } = this.state;
        return (
            <Layout>
                <h2>Add or Edit Customer</h2>
                <hr/>
                <form onSubmit={this.handleSubmit} className="row">
                    <div className="col-md-6">
                    <h3>Address</h3>
                        <Input
                            title="Code"
                            name="code" 
                            type="text"
                            value={customer.code}
                            onChange={this.handleChange}
                            submitted={submitted}
                            inline={true}
                            required={true}
                        />
                        <Input
                            title="Name"
                            name="name"
                            type="text"
                            value={customer.name}
                            onChange={this.handleChange}
                            submitted={submitted}
                            inline={true}
                            required={true}
                        />
                        <Input
                            title="Address"
                            name="address"
                            type="text"
                            value={customer.address}
                            onChange={this.handleChange}
                            submitted={submitted}
                            inline={true}
                            required={false}
                        />
                        <Input
                            title="ZIP"
                            name="zip"
                            type="text"
                            value={customer.zip}
                            onChange={this.handleChange}
                            submitted={submitted}
                            inline={true}
                            required={false}
                        />
                        <Input
                            title="City"
                            name="city"
                            type="text"
                            value={customer.city}
                            onChange={this.handleChange}
                            submitted={submitted}
                            inline={true}
                            required={false}
                        />
                        <Input
                            title="Country"
                            name="country"
                            type="text"
                            value={customer.country}
                            onChange={this.handleChange}
                            submitted={submitted}
                            inline={true}
                            required={false}
                        />
                        <Input
                            title="Phone"
                            name="phone"
                            type="tel"
                            value={customer.phone}
                            onChange={this.handleChange}
                            submitted={submitted}
                            inline={true}
                            required={false}
                        />
                        <Input
                            title="Email"
                            name="email"
                            type="email"
                            value={customer.email}
                            onChange={this.handleChange}
                            submitted={submitted}
                            inline={true}
                            required={false}
                        />
                        <div className="text-right">
                            <button type="submit" className="btn btn-lg btn-outline-leeuwen" onClick={this.handleSubmit}>
                                {loading ? <FontAwesomeIcon icon="spinner" className="fa-pulse fa-1x fa-fw" /> : ''}
                                Save Customer
                            </button>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <h3>Invoice Address</h3>
                        <CheckBox
                            title="Use the same address for invoices."
                            id="copyAddress"
                            name="copyAddress"
                            checked={copyAddress}
                            onChange={this.handleCheck}
                        />
                        {!copyAddress &&
                        <div>
                            <Input
                                title="Name"
                                name="invoiceName"
                                type="text"
                                value={customer.invoiceName}
                                onChange={this.handleChange}
                                submitted={submitted}
                                inline={true}
                                required={false}
                            />
                            <Input
                                title="Address"
                                name="invoiceAddress"
                                type="text"
                                value={customer.invoiceAddress}
                                onChange={this.handleChange}
                                submitted={submitted}
                                inline={true}
                                required={false}
                            />
                            <Input
                                title="ZIP"
                                name="invoiceZip"
                                type="text"
                                value={customer.invoiceZip}
                                onChange={this.handleChange}
                                submitted={submitted}
                                inline={true}
                                required={false}
                            />
                            <Input
                                title="City"
                                name="invoiceCity"
                                type="text"
                                value={customer.invoiceCity}
                                onChange={this.handleChange}
                                submitted={submitted}
                                inline={true}
                                required={false}
                            />
                            <Input
                                title="Country"
                                name="invoiceCountry"
                                type="text"
                                value={customer.invoicecountry}
                                onChange={this.handleChange}
                                submitted={submitted}
                                inline={true}
                                required={false}
                            />
                            <Input
                                title="Phone"
                                name="invoicePhone"
                                type="tel"
                                value={customer.invoicePhone}
                                onChange={this.handleChange}
                                submitted={submitted}
                                inline={true}
                                required={false}
                            />
                            <Input
                                title="Email"
                                name="invoiceEmail"
                                type="email"
                                value={customer.invoiceEmail}
                                onChange={this.handleChange}
                                submitted={submitted}
                                inline={true}
                                required={false}
                            />
                        </div>   
                        }
                    </div>
                    {alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div>}
                </form>
            </Layout>
        );
    }
}

function mapStateToProps(state) {
    const { alert } = state
    const { loading } = state.customers;
    return {
        alert,
        loading
    };
}

const connectedCustomer = connect(mapStateToProps)(Customer);
export { connectedCustomer as Customer };