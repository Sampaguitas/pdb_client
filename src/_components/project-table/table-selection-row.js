import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './table-selection-row.css'
//https://codingwithspike.wordpress.com/2014/11/16/fancy-css-checkboxes-with-fontawesome/


class TableSelectionRow extends Component {

    render(){
        const { checked, onChange } = this.props
        return (
            <div>
                <label className="fancy-table-selection-row-checkbox">
                <input type='checkbox' checked={checked} onChange={onChange}/>
                <FontAwesomeIcon icon="check" className="checked fa-2x" style={{color: '#0070C0'}}/> {/* */}
                <FontAwesomeIcon icon="check" className="unchecked fa-2x" style={{color: '#ededed'}}/>
                </label>

            </div>
        );
    }
};
// TableSelectionRow.propTypes = {
//     name: propTypes.string.isRequired,
// };

export default TableSelectionRow;
