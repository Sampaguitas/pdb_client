import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './table-selection-all-row.css'

class TableSelectionAllRow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fieldValue: false,
        }
        this.onChange = this.onChange.bind(this);
    }

    onChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;
                this.setState({
            ...this.state,
            [name]: value
        }, () => this.props.toggleSelectAllRow());
    }

    componentDidUpdate(prevProps) {
        if(this.props.selectedScreen !== prevProps.selectedScreen) {
            console.log('the screen has changed');
            this.setState({ fieldValue: false })
        }
    }

    render(){
        const { fieldValue } = this.state;
        return (
            <div>
                <label className="fancy-table-selection-all-row">
                <input type="checkbox" name="fieldValue" checked={fieldValue} onChange={this.onChange}/>
                    <FontAwesomeIcon icon="check" className="checked fa-lg" style={{color: '#0070C0', padding: 'auto', textAlign: 'center', width: '100%'}}/> 
                    <FontAwesomeIcon icon="check" className="unchecked fa-lg" style={{color: '#adb5bd', padding: 'auto', textAlign: 'center', width: '100%'}}/> {/*#ededed*/}
                </label>

            </div>
        );
    }
};

export default TableSelectionAllRow;
