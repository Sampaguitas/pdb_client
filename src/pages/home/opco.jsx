import React from 'react';
import { connect } from 'react-redux';
//Components
import CheckBox from '../../_components/check-box';
import Input from '../../_components/input';
import Layout from '../../_components/layout';


class Opco extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            opco: {
                code: '', //ok
                name: '', //ok
                address: '', //ok
                zip: '', //ok
                city: '', //ok
                country: '', //ok
                phone: '', //ok
                email: '' //ok
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
            opco.code &&
            opco.name &&
            opco.address &&
            opco.zip &&
            opco.city &&
            opco.country &&
            opco.phone
        ) {
            dispatch(opcoActions.create(opco));
        }
    }
    handleDeletOpco(id) {
        return (event) => this.props.dispatch(opcoActions.delete(id));
    }
    render() {
        const { alert, loading } = this.props;
        const { opco, submitted } = this.state;
        return (
            <Layout alert={alert}>
                <h2>Add or Edit Operating Company:</h2>
                <hr />
                <form onSubmit={this.handleSubmit}>
                    <Input
                        title="Code"
                        name="opcoCode"
                        type="text"
                        value={opco.code}
                        onChange={this.handleChange}
                        submitted={submitted}
                        inline={true}
                        required={true}
                    />
                    <Input
                        title="Name"
                        name="opcoName"
                        type="text"
                        value={opco.name}
                        onChange={this.handleChange}
                        submitted={submitted}
                        inline={true}
                        required={true}
                    />
                    <Input
                        title="Address"
                        name="opcoAddress"
                        type="text"
                        value={opco.address}
                        onChange={this.handleChange}
                        submitted={submitted}
                        inline={true}
                        required={true}
                    />
                    <Input
                        title="ZIP"
                        name="opcoZIP"
                        type="text"
                        value={opco.zip}
                        onChange={this.handleChange}
                        submitted={submitted}
                        inline={true}
                        required={true}
                    />
                    <Input
                        title="City"
                        name="opcoCity"
                        type="text"
                        value={opco.city}
                        onChange={this.handleChange}
                        submitted={submitted}
                        inline={true}
                        required={true}
                    />
                    <Input
                        title="Country"
                        name="opcoCountry"
                        type="text"
                        value={opco.country}
                        onChange={this.handleChange}
                        submitted={submitted}
                        inline={true}
                        required={true}
                    />
                    <Input
                        title="Phone"
                        name="opcoPhone"
                        type="tel"
                        value={opco.phone}
                        onChange={this.handleChange}
                        submitted={submitted}
                        inline={true}
                        required={true}
                    />
                    <Input
                        title="Email"
                        name="opcoEmail"
                        type="email"
                        value={opco.email}
                        onChange={this.handleChange}
                        submitted={submitted}
                        inline={true}
                        required={true}
                    />
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