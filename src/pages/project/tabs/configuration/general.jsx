import React from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';
import config from 'config';
//Components
import CheckBox from '../../../../_components/check-box';
import Input from '../../../../_components/input';
import Select from '../../../../_components/select';

class General extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            project: {
                name: this.props.project.name,
                customer: this.props.project.customer,
                opco: this.props.project.opco,
                currency:this.props.project.currency,
            },
            projtInspection: true,
            projectShipping: true,
            projectWarehouse: true,
            submitted: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleCheck = this.handleCheck.bind(this);
    }
    componentDidMount(){
        // const { project }=this.props
        this.setState({
            ...this.state,
            project: this.props.project
        });
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
        const { project } = this.state;
        this.setState({
            project: {
                ...project,
                [name]: value
            }
        });
    }
    render() {
        const { tab, currencies, customers, opcos } = this.props
        // const { currencies, customers, opcos } = this.props;
        const { project } = this.state;
        return (
            <div className="tab-pane fade show" id={tab.id} role="tabpanel">
                    <Input
                        title="Name"
                        name="name"
                        type="text"
                        value={project.name}
                        onChange={this.handleChange}
                        submitted={false}
                        inline={true}
                        required={false}
                    />
                    {customers.items &&
                        <Select
                            title="Customer"
                            name="customer"
                            options={customers.items}
                            value={project.customer}
                            onChange={this.handleChange}
                            placeholder=""
                            submitted={false}
                            inline={true}
                            required={false}
                        />
                    }                    
                    {opcos.items &&
                        <Select
                            title="OPCO"
                            name="opco"
                            options={opcos.items}
                            value={project.opco}
                            onChange={this.handleChange}
                            placeholder=""
                            submitted={false}
                            inline={true}
                            required={false}
                        />
                    }
                    {currencies.items && 
                        <Select
                            title="Currency"
                            name="currency"
                            options={currencies.items}
                            value={project.currency}
                            onChange={this.handleChange}
                            placeholder=""
                            submitted={false}
                            inline={true}
                            required={false}
                        />
                    }
                    {/* <div className="col-sm-10 offset-md-2">
                        <CheckBox
                            title="Enable Inspection Module"
                            id="projectInspection"
                            name="projectInspection"
                            checked={projectInspection}
                            onChange={this.handleCheck}
                            small="Check this if this project requires the Inspection Module. The Inspection Module is required if you want to use the Warehouse Module."
                        />
                        <CheckBox
                            title="Enable Shipping Module"
                            id="projectShipping"
                            name="projectShipping"
                            checked={projectShipping}
                            onChange={this.handleCheck}
                            small="Check this if this project requires the Shipping Module."
                        />
                        <CheckBox
                            title="Enable Warehouse Module"
                            id="projectWarehouse"
                            name="projectWarehouse"
                            checked={projectWarehouse}
                            onChange={this.handleCheck}
                            small="Check this if this project requires the Warehouse Module. "
                            strong="Requires the Inspection Module to be enabled."
                        />
                    </div>              */}
            </div>
        );
    }
}

export default General;
