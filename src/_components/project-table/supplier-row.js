import React, { Component } from 'react';

class SupplierRow extends Component {
    render() {
        const { supplier, handleOnclick } = this.props;
        return (
            <tr key={supplier.id} onClick={(event) => handleOnclick(event, supplier._id)}>
                <td className="text-nowrap">{supplier.name}</td>
                <td className="text-nowrap">{supplier.registeredName}</td>
                <td className="text-nowrap">{supplier.contact}</td>
                <td className="text-nowrap">{supplier.position}</td>
                <td className="text-nowrap">{supplier.tel}</td>
                <td className="text-nowrap">{supplier.fax}</td>
                <td className="text-nowrap">{supplier.mail}</td>
                <td className="text-nowrap">{supplier.address}</td>
                <td className="text-nowrap">{supplier.city}</td>
                <td className="text-nowrap">{supplier.country}</td>
            </tr>
        );
    }
}

export default SupplierRow;