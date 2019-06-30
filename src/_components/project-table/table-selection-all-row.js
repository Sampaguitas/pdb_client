import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './table-selection-all-row.css'

class TableSelectionAllRow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fieldValue: false,
        }
        //this.onClickHandler = this.onClickHandler.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    // onClickHandler() {
    //     const { fieldValue } = this.state;
    //     const { callback } = this.props;
    //     this.setState({  fieldValue: !fieldValue }, callback());
    // }

    onChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;
                this.setState({
            ...this.state,
            [name]: value
        }, () => this.props.toggleSelectAllRow());
            // event.preventDefault();
    }

    // componentDidMount(){
    //     const { selectAllRows } = this.props
    //     this.setState({fieldValue: selectAllRows})
    // }

    

    // componentDidUpdate(prevProps) {

    //     if(this.props.selectAllRows !== prevProps.selectAllRows) {
    //         this.setState({ fieldValue: this.props.selectAllRows })
    //     }
    // }

    render(){
        //const { checked, onChange } = this.props
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
