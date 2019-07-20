import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './new-row-check-box.css'

class NewRowCheckBox extends Component {
    render(){
        const { name, checked, onChange, disabled, color } = this.props
        return (
            <td>
             <div>
                <label className="fancy-table-checkbox">
                <input
                    ref="input"
                    type='checkbox'
                    name={name}
                    checked={checked}
                    onChange={onChange}
                    disabled={disabled}
                />
                <FontAwesomeIcon icon="check-square" className="checked fa-lg" style={{color: `${color == 'inherit' ? '#0070C0' : color}`, padding: 'auto', textAlign: 'center', width: '100%', margin: '0px', verticalAlign: 'middle'}}/>
                <FontAwesomeIcon icon={["far", "square"]} className="unchecked fa-lg" style={{color: `${color == 'inherit' ? '#adb5bd' : color}`, padding: 'auto', textAlign: 'center', width: '100%', margin: '0px', verticalAlign: 'middle'}}/>                
                </label>
            </div>
            </td>
        );
    }
};

export default NewRowCheckBox;
