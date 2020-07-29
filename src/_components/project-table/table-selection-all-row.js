import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './table-selection-all-row.css'

class TableSelectionAllRow extends Component {
    render(){
        const {
            checked,
            onChange,
        } = this.props;
        return (
            <th
                style={{
                    width: '30px',
                    minWidth: '30px',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <label
                    className="fancy-table-selection-all-row"
                    style={{margin: '0px'}}
                >
                    <input
                        type="checkbox"
                        name="fieldValue"
                        checked={checked}
                        onChange={onChange}
                    />
                    <FontAwesomeIcon
                        icon="check"
                        className="checked fa-lg"
                        style={{
                            color: '#0070C0',
                            padding: 'auto',
                            textAlign: 'center',
                            width: '100%',
                            margin: '0px',
                            verticalAlign: 'middle',
                            cursor: 'pointer'
                        }}
                    /> 
                    <FontAwesomeIcon
                        icon="check"
                        className="unchecked fa-lg"
                        style={{
                            color: '#adb5bd',
                            padding: 'auto',
                            textAlign: 'center',
                            width: '100%',
                            margin: '0px',
                            verticalAlign: 'middle',
                            cursor: 'pointer'
                        }}
                    />
                </label>
            </th>
        );
    }
};

export default TableSelectionAllRow;
