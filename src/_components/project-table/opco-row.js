import React, { Component } from 'react';

class OpcoRow extends Component {
    render() {
        const { opco, handleOnclick } = this.props;
        return (
            <tr key={opco._id} onClick={(event) => handleOnclick(event, opco._id)}>
                <td>{opco.code}</td>
                <td>{opco.name}</td>
                <td>{opco.city}</td>
                <td>{opco.country}</td>
                <td>{opco.region.name}</td>
                <td>{opco.locale.name}</td>
            </tr>
        );
    }
}

export default OpcoRow;