import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import './table-selection-all-row.css'

class CustomTableSelectAll extends Component {
    render(){
        const {
            checked,
            onChange,
        } = this.props;
        return (
            <label className="table-header-select-icon-label">
                <input
                    type="checkbox"
                    name="fieldValue"
                    checked={checked}
                    onChange={onChange}
                />
                <FontAwesomeIcon
                    icon="check"
                    className="table-header-select-icon checked fa-lg"
                    style={{
                        color: '#0070C0',
                        padding: 'auto',
                        // textAlign: 'center',
                        // width: '100%',
                        // margin: '0px',
                        // verticalAlign: 'middle',
                        // cursor: 'pointer',
                    }}
                /> 
                <FontAwesomeIcon
                    icon="check"
                    className="table-header-select-icon unchecked fa-lg"
                    style={{
                        color: '#adb5bd',
                        padding: 'auto',
                        // textAlign: 'center',
                        // width: '100%',
                        // margin: '0px',
                        // verticalAlign: 'middle',
                        // cursor: 'pointer',
                    }}
                />
            </label>
        );
    }
};

export default CustomTableSelectAll;
