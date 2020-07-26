import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './check-box.css'

export class CheckBox extends Component {
    render(){
        return (
            <div className="mb-3" style={{lineHeight: '1.5', fontSize: '1.25rem'}}>
            <label className="fancy-checkbox">
            <input
                id="thisCheckBox"
                ref="input"
                name={this.props.name}
                type='checkbox'
                checked={this.props.checked}
                onChange={this.props.onChange}
                disabled={this.props.disabled}
                className="form-check-input"
            />
            <FontAwesomeIcon icon="check-square" className="checked fa-lg mr-3" style={{color: '#0070C0'}}/>
            <FontAwesomeIcon icon={["far", "square"]} className="unchecked fa-lg mr-3" style={{color: '#adb5bd'}}/>
            {this.props.title}
            </label>
        </div>
        )
    }
}

// export default CheckBox;