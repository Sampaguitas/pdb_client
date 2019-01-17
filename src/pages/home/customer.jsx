import React from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import config from 'config';
import { customerActions } from '../../_actions';
import { authHeader } from '../../_helpers';
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
        this.getById = this.getById.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleResponse = this.handleResponse.bind(this);
    }

    componentDidMount(){
        var qs = queryString.parse(this.props.location.search);
        if (qs.id) {
            this.getById(qs.id);
        }
    }

    handleCheck(){
        const { copyAddress } = this.state
        this.setState({
            copyAddress: !copyAddress,
        });
        this.handleCopyAddress();
    }

    handleCopyAddress(){
        const { customer } = this.state
        this.setState({
            customer:{
                ...customer,
                invoiceName: customer.name,
                invoiceAddress: customer.address,
                invoiceZip: customer.zip,
                invoiceCity: customer.city,
                invoiceCountry: customer.country,
                invoicePhone: customer.phone,
                invoiceEmail: customer.email
            }
        });
        
    }

    handleChange(event) {
        const {name, value} = event.target;
        const { customer } = this.state;
        this.setState({
            customer:{
                ...customer,
                [name]: value
            }

        });
    }

    handleSubmit(event) {
        event.preventDefault();
        const { copyAddress, customer } = this.state;
        const { dispatch } = this.props;
        copyAddress && this.handleCopyAddress();
        this.setState({ submitted: true });
        if (customer.code && customer.name) {
            if(customer.id){
                dispatch(customerActions.update(customer));
            } else {
                dispatch(customerActions.create(customer));
            }
        }
    }

    getById(id) {
        const requestOptions = {
            method: 'GET',
            headers: authHeader()
        };

        return fetch(`${config.apiUrl}/customer/findOne/?id=${id}`, requestOptions)
        .then(this.handleResponse)
            .then(data => this.setState({ 
                copyAddress: false, 
                customer: data 
            }));
    }

    handleDelete(event) {
        event.preventDefault();
        const { dispatch } = this.props;
        const { customer } = this.state;
        dispatch(customerActions.delete(customer.id));
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
        const { alert, loading } = this.props;
        const { copyAddress, customer, submitted } = this.state;
        return (
            <Layout>
                {alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div>}
                <br />
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
                            {customer.id &&
                            <button type="submit" className="btn btn-outline-dark btn-lg" onClick={this.handleDelete} style={{marginRight: 10}}>
                                    {loading ? <FontAwesomeIcon icon="spinner" className="fa-pulse fa-1x fa-fw" /> : ''}
                                    Remove
                            </button>
                            }
                            <button type="submit" className="btn btn-lg btn-outline-leeuwen" onClick={this.handleSubmit}>
                                {loading ? <FontAwesomeIcon icon="spinner" className="fa-pulse fa-1x fa-fw" /> : ''}
                                {customer.id ? 'Update Customer' : 'Save Customer' }
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
                                value={customer.invoiceCountry}
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