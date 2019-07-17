import React, { Component } from 'react';
import config from 'config';
import { authHeader } from '../../_helpers';
import propTypes from 'prop-types';

class TableInput extends Component{
    constructor(props) {
        super(props);
        this.state = {
            collection: '',
            objectId: '',
            fieldName: '',
            fieldValue: '',
            fieldType: '',
            color: 'inherit',
            editing: false
        }
        this.onChange = this.onChange.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.formatText = this.formatText.bind(this);

    }
    componentDidMount(){
        this.setState({
            collection: this.props.collection,
            objectId: this.props.objectId,
            fieldName: this.props.fieldName,
            fieldValue: this.props.fieldValue ? this.props.fieldValue: '',
            fieldType: this.props.fieldType,
        });
    }

    onChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({
            ...this.state,
            [name]: value
        });
    }

    onFocus() {
        this.setState({ editing: true }, () => {
            this.refs.input.focus();
        });
    }

    onBlur(event){
        event.preventDefault();

        const { collection, objectId, fieldName, fieldValue } = this.state      
        if (collection && objectId && fieldName) {
            const requestOptions = {
                method: 'PUT',
                headers: { ...authHeader(), 'Content-Type': 'application/json' },
                body: `{"${fieldName}":"${fieldValue}"}`
            };
            return fetch(`${config.apiUrl}/${collection}/update?id=${objectId}`, requestOptions)
            .then( () => {
                this.setState({
                    ...this.state,
                    editing: false,
                    color: 'green',
                }, () => {
                    setTimeout(() => {
                        this.setState({
                            ...this.state,
                            color: 'inherit',
                        });
                    }, 1000);
                });
            })
            .catch( () => {
                this.setState({
                    ...this.state,
                    editing: false,
                    color: 'red',
                    fieldValue: this.props.fieldValue ? this.props.fieldValue: '',
                }, () => {
                    setTimeout(() => {
                        this.setState({
                            ...this.state,
                            color: 'inherit',
                        });
                    }, 1000);
                });                
            });
        }
    }

    formatText(fieldValue, fieldType){
        switch(fieldType){
            case "number":
                return new Intl.NumberFormat().format(fieldValue);
            case "date":
                if(!fieldValue){
                    return fieldValue
                } else {
                    return new Intl.DateTimeFormat().format(new Date(fieldValue));
                }
            default: return fieldValue
        }
    }

    render() {
        const { fieldValue, fieldType, color } = this.state

        return this.state.editing ? (
            <td className="text-nowrap" style={{padding:0}}>
                <input
                    ref='input'
                    className="form-control"
                    type={fieldType}
                    name='fieldValue'
                    value={fieldValue}
                    onChange={this.onChange}
                    onBlur={this.onBlur}
                    // style={{
                    //     margin: 0,
                    //     borderRadius:0,
                    //     borderColor: 'white',
                    //     backgroundColor: 'inherit',
                    //     color: 'inherit',
                    //     WebkitBoxShadow: 'none',
                    //     boxShadow: 'none',  
                    // }}
                />
            </td>
        ):
        (
        <td onClick={() => this.onFocus()} style={{color:color}}>{this.formatText(fieldValue, fieldType)}</td> //onDoubleClick
        );
    }
}

TableInput.propTypes = {
    fieldType: propTypes.oneOf(['text', 'number', 'email', 'tel','password', 'date']).isRequired,
    fieldName: propTypes.string.isRequired,
    fieldValue:propTypes.oneOfType([
        propTypes.string,
        propTypes.number,
        propTypes.instanceOf(Date),
    ])
};

export default TableInput;