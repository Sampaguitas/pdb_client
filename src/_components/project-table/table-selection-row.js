import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './table-selection-row.css'
//https://codingwithspike.wordpress.com/2014/11/16/fancy-css-checkboxes-with-fontawesome/


class TableSelectionRow extends Component {

    render(){
        const { checked, onChange } = this.props
        return (
            <div
                //className="fancy-checkbox" //form-check
                // style={{
                //     padding: '0px',
                //     margin: 'auto',
                //     alignItems: 'center',
                //     justifyContent: 'center',
                // }}
            >
                <label className="fancy-checkbox">
                <input
                    // ref="input"
                    //className="form-check-input"
                    type='checkbox'
                    checked={checked}
                    onChange={onChange}
                    // style={{display: 'inline-block', verticalAlign: 'middle'}}
                />
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
