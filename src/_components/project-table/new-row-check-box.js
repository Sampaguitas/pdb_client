import React, { Component } from 'react';
import config from 'config';
import { authHeader } from '../../_helpers';
import propTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './new-row-check-box.css'

class NewRowCheckBox extends Component {
    render(){
        return (
            <td>
             <div>
                <label className="fancy-table-checkbox">
                <input
                    ref="input"
                    type='checkbox'
                    name={this.props.name}
                    checked={this.props.checked}
                    onChange={this.props.onChange}
                    disabled={this.props.disabled}
                />
                <FontAwesomeIcon icon="check-square" className="checked fa-lg" style={{color: `${this.props.color == 'inherit' ? '#0070C0' : this.props.color}`, padding: 'auto', textAlign: 'center', width: '100%'}}/>
                <FontAwesomeIcon icon={["far", "square"]} className="unchecked fa-lg" style={{color: '#adb5bd', padding: 'auto', textAlign: 'center', width: '100%'}}/>                
                </label>
            </div>
            </td>
        );
    }
};

export default NewRowCheckBox;
