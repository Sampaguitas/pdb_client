import React from 'react';
import { connect } from 'react-redux';

class Grids extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { tab } = this.props
        return (
            <div className="tab-pane fade show" id={tab.id} role="tabpanel">
                <div className="table-responsive">
                    <table className="table table-hover table-sm table-bordered">
                        <thead>
                            <tr className="text-center">
                                <th colSpan="5" >
                                    <div className="input-group">
                                        <div className="input-group-prepend">
                                        <span className="input-group-text">Entity</span>
                                        </div>
                                        {/* {entities &&
                                            <select className="form-control">
                                                {entities.map((entity, index)=>
                                                <option key={index}>{entity}</option>
                                                )}
                                            </select>
                                        } */}
                                    </div>
                                </th>
                                <th colSpan="4">
                                    <div className="input-group">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">Grid View</span>
                                        </div>
                                        <select className="form-control">
                                            <option value="ProjectOrders">ProjectOrders</option>
                                            <option value="ProjectOrderLines">ProjectOrderLines</option>
                                            <option value="Expediting">Expediting</option>
                                            <option value="Esr">ESR</option>
                                            <option value="Inspection">Inspection</option>
                                            <option value="ShippingIn">ShippingIn</option>
                                            <option value="ShippingOut">ShippingOut (Warehouse)</option>
                                            <option value="GoodsReceipt">GoodsReceipt</option>
                                            <option value="Stock">Stock</option>
                                            <option value="InspectionExpediting">InspectionExpediting</option>
                                            <option value="ShippingPackages">ShippingPackages</option>
                                        </select>
                                    </div>
                                </th>
                            </tr>
                            <tr>
                                <th>Entity</th>
                                <th>Property</th>
                                <th>Translation</th>
                                <th>Type</th>
                                <th>DUF</th>
                                <th>Order</th>
                                <th>Read</th>
                                <th>Write</th>
                                <th>Hide</th> 
                            </tr>
                        </thead>
                        <tbody>
                            <tr>

                            </tr>
                        </tbody>
                    </table>
                </div>               
            </div>
        );
    }
}

export default Grids;