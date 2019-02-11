import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//Components
import CheckBox from '../../../../_components/check-box';
import Input from '../../../../_components/input';
import Select from '../../../../_components/select';

class General extends React.Component {
    render() {
        const { 
                currencies, 
                customers,
                deleting, 
                handleChange,
                handleCheck, 
                handleDelete, 
                handleSubmit,  
                loading,
                opcos,
                project,
                tab
            } = this.props
        return (
            <div className="tab-pane fade show" id={tab.id} role="tabpanel">
                <form onSubmit={handleSubmit}>
                    <Input
                        title="Name"
                        name="name"
                        type="text"
                        value={project.name}
                        onChange={handleChange}
                        submitted={false}
                        inline={true}
                        required={false}
                    />
                        <Select
                            title="Customer"
                            name="customer"
                            options={customers.items}
                            value={project.customer}
                            onChange={handleChange}
                            placeholder=""
                            submitted={false}
                            inline={true}
                            required={false}
                        />
                        <Select
                            title="OPCO"
                            name="opco"
                            options={opcos.items}
                            value={project.opco}
                            onChange={handleChange}
                            placeholder=""
                            submitted={false}
                            inline={true}
                            required={false}
                        />
                        <Select
                            title="Currency"
                            name="currency"
                            options={currencies.items}
                            value={project.currency}
                            onChange={handleChange}
                            placeholder=""
                            submitted={false}
                            inline={true}
                            required={false}
                        />
                    <div className="offset-md-2">  
                    <CheckBox
                        title="Enable Inspection Module"
                        id="projectInspection"
                        name="projectInspection"
                        checked={project.projectInspection}
                        onChange={handleCheck}
                        small="Check this if this project requires the Inspection Module. The Inspection Module is required if you want to use the Warehouse Module."
                    />
                    <CheckBox
                        title="Enable Shipping Module"
                        id="projectShipping"
                        name="projectShipping"
                        checked={project.projectShipping}
                        onChange={handleCheck}
                        small="Check this if this project requires the Shipping Module."
                    />
                    <CheckBox
                        title="Enable Warehouse Module"
                        id="projectWarehouse"
                        name="projectWarehouse"
                        checked={project.projectWarehouse}
                        onChange={handleCheck}
                        small="Check this if this project requires the Warehouse Module. "
                        strong="Requires the Inspection Module to be enabled."
                    />
                    </div>
                    <div className="text-right">
                        {project._id &&
                        <button type="submit" className="btn btn-outline-dark btn-lg" onClick={handleDelete(project._id)} style={{ marginRight: 10 }} >
                            {deleting ? <FontAwesomeIcon icon="spinner" className="fa-pulse fa-1x fa-fw" /> : '' }
                            Remove
                        </button>
                        }
                        <button type="submit" className="btn btn-lg btn-outline-leeuwen" >
                        {loading ? <FontAwesomeIcon icon="spinner" className="fa-pulse fa-1x fa-fw" /> : ''}
                        {project._id ? 'Update Project' : 'Save Project'}
                        </button>
                    </div>
                </form>         
            </div>
        );
    }
}

export default General;
