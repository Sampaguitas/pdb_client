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
            color: '#0070C0',
            editing: false,
            // disabled: false
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
            // disabled: this.props.disabled ? this.props.disabled : false,
            fieldType: this.props.fieldType,
        });
    }

    onChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({
            ...this.state,
            [name]: value //decodeURI(
        });
    }

    onFocus() {
        const { disabled, unlocked } = this.props;
        if(unlocked || !disabled){
            this.setState({ editing: true }, () => {
                this.refs.input.focus();
            });
        }
    }

    onBlur(event){
        event.preventDefault();
        const { disabled, unlocked } = this.props;
        const { collection, objectId, fieldName, fieldValue } = this.state    
        if ((unlocked || !disabled) && collection && objectId && fieldName) {
            const requestOptions = {
                method: 'PUT',
                headers: { ...authHeader(), 'Content-Type': 'application/json' },
                body: `{"${fieldName}":"${encodeURI(fieldValue)}"}` //encodeURI
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
                            color: '#0070C0',
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
                            color: '#0070C0',
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
                    return fieldValue; // decodeURI
                } else {
                    return new Intl.DateTimeFormat().format(new Date(fieldValue));
                }
            default: return fieldValue; //decodeURI
        }
    }

    render() {
        const {
            align,
            disabled,
            textNoWrap,
            unlocked,
            width
        } = this.props;

        const {
            color,
            editing,
            fieldValue,
            fieldType
        } = this.state;

        return editing ? (
            <td
                style={{
                    width: `${width ? width : 'auto'}`,
                    whiteSpace: `${textNoWrap ? 'nowrap' : 'auto'}`,
                    padding: '0px'
                }}
            >
                <input
                    ref='input'
                    className="form-control"
                    type={fieldType}
                    name='fieldValue'
                    value={fieldValue}
                    onChange={this.onChange}
                    onBlur={this.onBlur}
                    disabled={unlocked ? false : disabled}
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
            <td 
                onClick={() => this.onFocus()}
                style={{
                    color: disabled ? unlocked ? color!='#0070C0' ? color : '#A8052C' : 'inherit' : color, //disabled ? !unlocked ? color != '#0070C0' ? color : '#A8052C' : 'inherit' : color
                    width: `${width ? width : 'auto'}`,
                    whiteSpace: `${textNoWrap ? 'nowrap' : 'auto'}`
                }}
                align={align ? align : 'left'}
            >
                {this.formatText(fieldValue, fieldType)}
            </td> //onDoubleClick
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