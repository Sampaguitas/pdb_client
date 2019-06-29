import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './table-selection-row.css'

class TableSelectionRow extends Component {

    constructor(props) {
        super(props);
        this.state = {
            checked: false,
        }
        this.onClickHandler = this.onClickHandler.bind(this);
    }

    onClickHandler() {
        const { checked } = this.state;
        const { callback, id } = this.props;
        this.setState({  checked: !checked }, callback(id))
    }

    componentDidUpdate(prevProps) {
        if(prevProps.selectAllRows !== this.props.selectAllRows) {
            this.setState({ checked: this.props.selectAllRows })
        }
    }

    render(){
        const { id, onChange, selectedRows } = this.props
        const { checked } = this.state;
        return (
            <div>
                <label className="fancy-table-selection-row">
                <input type='checkbox' checked={checked} onClick={this.onClickHandler}/>
                <FontAwesomeIcon icon="check" className="checked fa-lg" style={{color: '#0070C0', padding: 'auto', textAlign: 'center', width: '100%'}}/> 
                <FontAwesomeIcon icon="check" className="unchecked fa-lg" style={{color: '#adb5bd', padding: 'auto', textAlign: 'center', width: '100%'}}/> {/*#ededed*/}
                </label>

            </div>
        );
    }
};

export default TableSelectionRow;
