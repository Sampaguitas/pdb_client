import React from 'react';
import { connect } from 'react-redux';
import { customerActions } from '../../_actions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import config from 'config';
import { authHeader } from '../../_helpers';
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
        console.log(this.state);
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
        console.log(this.state);
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
        const { loading } = this.props;
        // const { customer, copyAddress, submitted } = this.state;
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
                            value={this.state.customer.code}
                            onChange={this.handleChange}
                            submitted={this.state.submitted}
                            inline={true}
                            required={true}
                        />
                        <Input
                            title="Name"
                            name="name"
                            type="text"
                            value={this.state.customer.name}
                            onChange={this.handleChange}
                            submitted={this.state.submitted}
                            inline={true}
                            required={true}
                        />
                        <Input
                            title="Address"
                            name="address"
                            type="text"
                            value={this.state.customer.address}
                            onChange={this.handleChange}
                            submitted={this.state.submitted}
                            inline={true}
                            required={false}
                        />
                        <Input
                            title="ZIP"
                            name="zip"
                            type="text"
                            value={this.state.customer.zip}
                            onChange={this.handleChange}
                            submitted={this.state.submitted}
                            inline={true}
                            required={false}
                        />
                        <Input
                            title="City"
                            name="city"
                            type="text"
                            value={this.state.customer.city}
                            onChange={this.handleChange}
                            submitted={this.state.submitted}
                            inline={true}
                            required={false}
                        />
                        <Input
                            title="Country"
                            name="country"
                            type="text"
                            value={this.state.customer.country}
                            onChange={this.handleChange}
                            submitted={this.state.submitted}
                            inline={true}
                            required={false}
                        />
                        <Input
                            title="Phone"
                            name="phone"
                            type="tel"
                            value={this.state.customer.phone}
                            onChange={this.handleChange}
                            submitted={this.state.submitted}
                            inline={true}
                            required={false}
                        />
                        <Input
                            title="Email"
                            name="email"
                            type="email"
                            value={this.state.customer.email}
                            onChange={this.handleChange}
                            submitted={this.state.submitted}
                            inline={true}
                            required={false}
                        />
                        <div className="text-right">
                            <button type="submit" className="btn btn-lg" onClick={this.handleSubmit}>
                                {this.props.loading ? <FontAwesomeIcon icon="spinner" className="fa-pulse fa-1x fa-fw" /> : ''}
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
                            checked={this.state.copyAddress}
                            onChange={this.handleCheck}
                        />
                        {!this.state.copyAddress &&
                        <div>
                            <Input
                                title="Name"
                                name="invoiceName"
                                type="text"
                                value={this.state.customer.invoiceName}
                                onChange={this.handleChange}
                                submitted={this.state.submitted}
                                inline={true}
                                required={false}
                            />
                            <Input
                                title="Address"
                                name="invoiceAddress"
                                type="text"
                                value={this.state.customer.invoiceAddress}
                                onChange={this.handleChange}
                                submitted={this.state.submitted}
                                inline={true}
                                required={false}
                            />
                            <Input
                                title="ZIP"
                                name="invoiceZip"
                                type="text"
                                value={this.state.customer.invoiceZip}
                                onChange={this.handleChange}
                                submitted={this.state.submitted}
                                inline={true}
                                required={false}
                            />
                            <Input
                                title="City"
                                name="invoiceCity"
                                type="text"
                                value={this.state.customer.invoiceCity}
                                onChange={this.handleChange}
                                submitted={this.state.submitted}
                                inline={true}
                                required={false}
                            />
                            <Input
                                title="Country"
                                name="invoiceCountry"
                                type="text"
                                value={this.state.customer.invoicecountry}
                                onChange={this.handleChange}
                                submitted={this.state.submitted}
                                inline={true}
                                required={false}
                            />
                            <Input
                                title="Phone"
                                name="invoicePhone"
                                type="tel"
                                value={this.state.customer.invoicePhone}
                                onChange={this.handleChange}
                                submitted={this.state.submitted}
                                inline={true}
                                required={false}
                            />
                            <Input
                                title="Email"
                                name="invoiceEmail"
                                type="email"
                                value={this.state.customer.invoiceEmail}
                                onChange={this.handleChange}
                                submitted={this.state.submitted}
                                inline={true}
                                required={false}
                            />
                        </div>   
                        }
                    </div>
                </form>
            </Layout>
        );
    }
}

function mapStateToProps(state) {
    const { loading } = state.customers;
    return {
        loading
    };
}

const connectedCustomer = connect(mapStateToProps)(Customer);
export { connectedCustomer as Customer };