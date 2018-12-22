import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { userActions } from '../../_actions';
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
                invoicecountry: '',
                invoicePhone: '',
                invoiceEmail: ''
            },
            copyAddress: true,
            submitted: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleCheck(event){
        const target = event.target;
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({
            [name]:value
        });        
    }
    handleChange(event) {
        const {name, value} = event.target;
        const { customer } = this.state;
        this.setState({
            customer: {
                ...customer,
                [name]: value
            }
        });
    }
    handleSubmit(event) {
        event.preventDefault();

        this.setState({ submitted: true });
        const { customer } = this.state;
        const { dispatch } = this.props;
        if (
            customer.code && 
            customer.name && 
            customer.address && 
            customer.zip && 
            customer.city && 
            customer.country &&
            customer.phone &&
            customer.email &&
            customer.invoiceName &&
            customer.invoiceAddress &&
            customer.invoiceZip &&
            customer.invoiceCity &&
            customer.invoicecountry &&
            customer.invoicePhone &&
            customer.invoiceEmail
            ) {
            dispatch(customerActions.create(customer));
        }
    }
    componentDidMount() {
        this.getCustomer();
    }
    handleDeleteCustomer(id) {
        return (event) => this.props.dispatch(customerActions.delete(id));
    }
    render() {
        const { loading } = this.props;
        const { customer, copyAddress, submitted } = this.state;
        return (
            <Layout>
                <h2>Add or Edit Customer</h2>
                <hr/>
                <form onSubmit={saveCustomer()} className="row">
                    <div className="col-md-6">
                    <h3>Address</h3>
                        <Input
                            title="Code"
                            name="customerCode" 
                            type="text"
                            value={customer.code}
                            onChange={this.handleChange}
                            submitted={submitted} 
                        />
                        <Input
                            title="Name"
                            name="customerName"
                            type="text"
                            value={customer.name}
                            onChange={this.handleChange}
                            submitted={submitted}
                        />
                        <Input
                            title="Address"
                            name="customerAddress"
                            type="text"
                            value={customer.address}
                            onChange={this.handleChange}
                            submitted={submitted}
                        />
                        <Input
                            title="ZIP"
                            name="customerZIP"
                            type="text"
                            value={customer.zip}
                            onChange={this.handleChange}
                            submitted={submitted}
                        />
                        <Input
                            title="City"
                            name="customerCity"
                            type="text"
                            value={customer.city}
                            onChange={this.handleChange}
                            submitted={submitted}
                        />
                        <Input
                            title="Country"
                            name="customerCountry"
                            type="text"
                            value={customer.country}
                            onChange={this.handleChange}
                            submitted={submitted}
                        />
                        <Input
                            title="Phone"
                            name="customerPhone"
                            type="tel"
                            value={customer.phone}
                            onChange={this.handleChange}
                            submitted={submitted}
                        />
                        <Input
                            title="Email"
                            name="customerEmail"
                            type="email"
                            value={customer.email}
                            onChange={this.handleChange}
                            submitted={submitted}
                        />
                    </div>
                    <div className="text-right">
                        {/* butons save and remove goes here*/}
                    </div>
                    <div class="col-md-6">
                        <h3>Invoice Address</h3>
                        <CheckBox
                            title="Use the same address for invoices."
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
                            />
                            <Input
                                title="Address"
                                name="invoiceAddress"
                                type="text"
                                value={customer.invoiceAddress}
                                onChange={this.handleChange}
                                submitted={submitted}
                            />
                            <Input
                                title="ZIP"
                                name="invoiceZIP"
                                type="text"
                                value={customer.invoiceZip}
                                onChange={this.handleChange}
                                submitted={submitted}
                            />
                            <Input
                                title="City"
                                name="invoiceCity"
                                type="text"
                                value={customer.invoiceCity}
                                onChange={this.handleChange}
                                submitted={submitted}
                            />
                            <Input
                                title="Country"
                                name="invoiceCountry"
                                type="text"
                                value={customer.invoicecountry}
                                onChange={this.handleChange}
                                submitted={submitted}
                            />
                            <Input
                                title="Phone"
                                name="invoicePhone"
                                type="tel"
                                value={customer.invoicePhone}
                                onChange={this.handleChange}
                                submitted={submitted}
                            />
                            <Input
                                title="Email"
                                name="invoiceEmail"
                                type="email"
                                value={customer.invoiceEmail}
                                onChange={this.handleChange}
                                submitted={submitted}
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
    const { loading } = state.customerCreation;
    return {
        loading
    };
}

const connectedCustomer = connect(mapStateToProps)(Customer);
export { connectedCustomer as Customer };