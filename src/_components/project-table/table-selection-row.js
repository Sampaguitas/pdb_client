import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './table-selection-row.css'

class TableSelectionRow extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fieldValue: false,
        }
        this.onChange = this.onChange.bind(this);
    }

    onChange(event) {
        const { callback, id } = this.props;
        this.setState({
            fieldValue: event.target.checked
        }, () => callback(id))
    }

    componentDidUpdate(prevProps) {
        const { selectAllRows, selectedRows, id } = this.props;
        if(selectAllRows != prevProps.selectAllRows) {
            this.setState({
                fieldValue: selectAllRows
            });
        }

        if (selectedRows != prevProps.selectedRows) {
            if (selectedRows.includes(id)) {
                this.setState({
                    fieldValue: true
                });
            } else {
                this.setState({
                    fieldValue: false
                });
            }
        }
    }

    render(){
        const { fieldValue } = this.state;
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
                    className="fancy-table-selection-row"
                    style={{margin: '0px'}}>
                    <input
                        type="checkbox"
                        name="fieldValue"
                        checked={fieldValue}
                        onChange={this.onChange}
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

export default TableSelectionRow;
