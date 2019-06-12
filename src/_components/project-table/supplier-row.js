import React, { Component } from 'react';

class SupplierRow extends Component {
    render() {
        const { supplier, handleOnclick } = this.props;
        return (
            <tr key={supplier.id} onClick={(event) => handleOnclick(event, supplier._id)}>
                <td>{supplier.name}</td>
                <td>{supplier.registeredName}</td>
                <td>{supplier.contact}</td>
                <td>{supplier.position}</td>
                <td>{supplier.tel}</td>
                <td>{supplier.fax}</td>
                <td>{supplier.mail}</td>
                <td>{supplier.address}</td>
                <td>{supplier.city}</td>
                <td>{supplier.country}</td>
            </tr>
        );
    }
}

export default SupplierRow;