import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './table-selection-row.css'

class TableSelectionRow extends Component {

    render(){
        const { checked, onChange } = this.props
        return (
            <div>
                <label className="fancy-table-selection-row">
                <input type='checkbox' checked={checked} onChange={onChange}/>
                <FontAwesomeIcon icon="check" className="checked fa-lg" style={{color: '#0070C0', padding: 'auto', textAlign: 'center', width: '100%'}}/> 
                <FontAwesomeIcon icon="check" className="unchecked fa-lg" style={{color: '#adb5bd', padding: 'auto', textAlign: 'center', width: '100%'}}/> {/*#ededed*/}
                </label>

            </div>
        );
    }
};

export default TableSelectionRow;
