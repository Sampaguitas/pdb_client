import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './table-check-box-role.css'

class TableCheckBoxRole extends Component {
    render(){
        const {id, checked, onChange, disabled } = this.props;
        return (
            <td>
                <label className="fancy-table-check-box-role">
                    <input
                        name={id}
                        type="checkbox"
                        checked={checked}
                        onChange={onChange}
                        disabled={disabled}
                    />
                    <FontAwesomeIcon
                        icon="check-square"
                        className="checked fa-lg"
                        style={{
                            color: disabled ? '#adb5bd' : '#0070C0',
                            margin: '0%', padding: 'auto',
                            textAlign: 'center',
                            width: '100%',
                            margin: '0px',
                            verticalAlign: 'middle',
                            cursor: disabled ? 'auto' : 'pointer'
                        }}
                    />
                    <FontAwesomeIcon
                        icon={["far", "square"]}
                        className="unchecked fa-lg"
                        style={{
                            color: disabled ? '#adb5bd' : '#0070C0',
                            margin: '0%',
                            padding: 'auto',
                            textAlign: 'center',
                            width: '100%',
                            margin: '0px',
                            verticalAlign: 'middle',
                            cursor: disabled ? 'auto' : 'pointer'
                        }}
                    />  
                </label>
            </td>
        );
    }
};

export default TableCheckBoxRole;