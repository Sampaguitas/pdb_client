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
                deleting, 
                handleChange, 
                handleDelete, 
                handleSubmit,  
                loading,
                opcos,
                project,
                tab,
                erps
            } = this.props
        return (
            <div className="tab-pane fade show" id={tab.id} role="tabpanel">
                <div className="row">
                    <div className="col-md-8 col-sm-12 mb-sm-3">
                        <div className="card">
                            <div className="card-header">
                                <h5>Set user roles</h5>
                            </div>
                            <div className="card-body table-responsive">
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>User</th>
                                            <th>Expediting</th>
                                            <th>Inspection</th>
                                            <th>Shipping</th>
                                            <th>Warehouse</th>
                                            <th>Config</th>
                                        </tr>
                                    </thead>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 col-sm-12">
                        <div className="card">
                            <div className="card-header">
                                <h5>General information</h5>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <Input
                                        title="Name"
                                        name="name"
                                        type="text"
                                        value={project.name}
                                        onChange={handleChange}
                                        submitted={false}
                                        inline={false}
                                        required={false}
                                    />
                                    <Select
                                        title="ERP"
                                        name="erpId"
                                        options={erps.items}
                                        value={project.erpId}
                                        onChange={handleChange}
                                        placeholder=""
                                        submitted={false}
                                        inline={false}
                                        required={false}
                                    />
                                    <Select
                                        title="OPCO"
                                        name="opcoId"
                                        options={opcos.items}
                                        value={project.opcoId}
                                        onChange={handleChange}
                                        placeholder=""
                                        submitted={false}
                                        inline={false}
                                        required={false}
                                    />
                                    <Select
                                        title="Currency"
                                        name="currencyId"
                                        options={currencies.items}
                                        value={project.currencyId}
                                        onChange={handleChange}
                                        placeholder=""
                                        submitted={false}
                                        inline={false}
                                        required={false}
                                    />
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
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default General;
