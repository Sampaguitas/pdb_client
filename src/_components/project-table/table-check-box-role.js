import React, { Component } from 'react';
import propTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './table-check-box-role.css'

class TableCheckBoxRole extends Component {
    render(){
        return (
            <div>
                <label className="fancy-table-check-box-role">
                <input
                    name={this.props.id}
                    type="checkbox"
                    checked={this.props.checked}
                    onChange={this.props.onChange}
                    disabled={this.props.disabled}
                />
                <FontAwesomeIcon icon="check-square" className="checked fa-lg" style={{color: '#0070C0', margin: '0%', padding: 'auto', textAlign: 'center', width: '100%'}}/>
                <FontAwesomeIcon icon={["far", "square"]} className="unchecked fa-lg" style={{color: '#adb5bd', margin: '0%', padding: 'auto', textAlign: 'center', width: '100%'}}/>  
                </label>
            </div>
        );
    }
};
TableCheckBoxRole.propTypes = {
    id:propTypes.string.isRequired,
    checked:propTypes.bool.isRequired
};

export default TableCheckBoxRole;


//<i class="fal fa-square"></i>