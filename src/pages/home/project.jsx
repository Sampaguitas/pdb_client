import React from 'react';
import { connect } from 'react-redux';
import { currencyActions, opcoActions,  customerActions, projectActions } from '../../_actions';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

//Components
import CheckBox from '../../_components/check-box';
import Input from '../../_components/input';
import Select from '../../_components/select';
import Layout from '../../_components/layout';


class Project extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            project: {
                name: '',
                customer: '',
                opco: '',
                currency:'',
                projectInspection: true,
                projectShipping: true,
                projectWarehouse: true,
            },
            submitted: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleCheck = this.handleCheck.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentDidMount() {
        this.props.dispatch(currencyActions.getAll());
        this.props.dispatch(opcoActions.getAll());
        this.props.dispatch(customerActions.getAll());
    }
    handleCheck(event) {
        const { project } = this.state;
        const target = event.target;
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({
            project: {
                ...project,
                [name]: value
            }
        });
    }
    handleChange(event) {
        const { project } = this.state;
        const { name, value } = event.target;
        this.setState({
            project: {
                ...project,
                [name]: value
            }
        });
    }
    handleSubmit(event) {
        event.preventDefault();

        this.setState({ submitted: true });
        const { project } = this.state;
        const { dispatch } = this.props;
        if (
            project.name &&
            project.customer &&
            project.opco &&
            project.currency
        ) {
            dispatch(projectActions.create(project));
        }
    }
    handleDeletProject(id) {
        return (event) => this.props.dispatch(projectActions.delete(id));
    }
    render() {
        const { alert, loading, currencies, customers, opcos } = this.props;
        const { project, submitted } = this.state;
        return (
            <Layout>
                {alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div>}
                <br />
                <h2>Add or Edit Project:</h2>
                <hr />
                <form onSubmit={this.handleSubmit}>
                    <Input
                        title="Name"
                        name="name"
                        type="text"
                        value={project.name}
                        onChange={this.handleChange}
                        submitted={submitted}
                        inline={true}
                        required={true}
                    />
                    {/* {this.props.customers.items && */}
                        <Select
                            title="Customer"
                            name="customer"
                            options={customers.items}
                            value={project.customer}
                            onChange={this.handleChange}
                            placeholder=""
                            submitted={submitted}
                            inline={true}
                            required={true}
                        />
                    {/* }                     */}
                    {/* {this.props.opcos.items && */}
                        <Select
                            title="OPCO"
                            name="opco"
                            options={opcos.items}
                            value={project.opco}
                            onChange={this.handleChange}
                            placeholder=""
                            submitted={submitted}
                            inline={true}
                            required={true}
                        />
                    {/* } */}
                    {/* {this.props.currencies.items &&  */}
                        <Select
                            title="Currency"
                            name="currency"
                            options={currencies.items}
                            value={project.currency}
                            onChange={this.handleChange}
                            placeholder=""
                            submitted={submitted}
                            inline={true}
                            required={true}
                        />
                    {/* } */}
                    <div className="col-sm-10 offset-md-2">
                        <CheckBox
                            title="Enable Inspection Module"
                            id="projectInspection"
                            name="projectInspection"
                            checked={project.projectInspection}
                            onChange={this.handleCheck}
                            small="Check this if this project requires the Inspection Module. The Inspection Module is required if you want to use the Warehouse Module."
                        />
                        <CheckBox
                            title="Enable Shipping Module"
                            id="projectShipping"
                            name="projectShipping"
                            checked={project.projectShipping}
                            onChange={this.handleCheck}
                            small="Check this if this project requires the Shipping Module."
                        />
                        <CheckBox
                            title="Enable Warehouse Module"
                            id="projectWarehouse"
                            name="projectWarehouse"
                            checked={project.projectWarehouse}
                            onChange={this.handleCheck}
                            small="Check this if this project requires the Warehouse Module. "
                            strong="Requires the Inspection Module to be enabled."
                        />
                    </div>
                    <div className="text-right">
                        <button type="submit" className="btn btn-lg btn-outline-leeuwen">
                            {loading ? <FontAwesomeIcon icon="spinner" className="fa-pulse fa-1x fa-fw" /> : ''}
                        Save Project
                        </button>
                    </div>
                </form>
            </Layout>
        );
    }
}

function mapStateToProps(state) {
    const { alert, currencies, customers, opcos } = state;
    const { loading } = state.projects;
    return {
        alert,
        customers,
        currencies,
        loading,
        opcos
    };
}

const connectedProject = connect(mapStateToProps)(Project);
export { connectedProject as Project };