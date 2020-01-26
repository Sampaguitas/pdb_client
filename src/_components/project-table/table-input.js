import React, { Component } from 'react';
import config from 'config';
import { authHeader } from '../../_helpers';
import propTypes from 'prop-types';
import _ from 'lodash';
import classNames from 'classnames';

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
            isEditing: false,
            isSelected: false,
            // disabled: false
        }
        this.onChange = this.onChange.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.formatText = this.formatText.bind(this);
        this.onClick = this.onClick.bind(this);

    }
    
    componentDidMount(){
        const arrowKeys = [9, 13, 37, 38, 39, 40]; //tab, enter, left, up, right, down
        this.setState({
            collection: this.props.collection,
            objectId: this.props.objectId,
            fieldName: this.props.fieldName,
            fieldValue: this.props.fieldValue ? this.props.fieldValue: '',
            // disabled: this.props.disabled ? this.props.disabled : false,
            fieldType: this.props.fieldType,
        });
        // this.refs.input.addEventListener('keydown', (e) => {

        // })
        
    }

    onChange(event) {
        const target = event.target;
        // console.log('keyCode:', event.target.keyCode);
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({
            ...this.state,
            isEditing: true,
            [name]: value //decodeURI(
        });
    }

    onFocus() {
        const { disabled, unlocked } = this.props;
        if(unlocked || !disabled){
            this.setState({ isEditing: true }, () => {
                this.refs.input.focus();
                // this.refs.input.select();
                // this.refs.input.setSelectionRange(0, this.refs.input.value.length);
            });
        }
    }

    onClick() {
        const { disabled, unlocked } = this.props;
        const { isEditing, isSelected } = this.state;
        if(unlocked || !disabled){
            if(!isSelected) {
                this.setState({isSelected: true}, () => {
                    setTimeout(() => {
                    this.refs.input.select();
                    }, 1);
                });
            } else {
                this.setState({isEditing: true }, () => {
                    setTimeout(() => {
                    this.refs.input.focus();
                    }, 1);
                });
            }
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
                    isEditing: false,
                    isSelected: false,
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
                    isEditing: false,
                    isSelected: false,
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
                return fieldValue === '' ? '' : new Intl.NumberFormat().format(fieldValue);
                break;
            case "date":
                return fieldValue ? new Intl.DateTimeFormat().format(new Date(fieldValue)) : '';
                break;
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
            isEditing,
            isSelected,
            fieldValue,
            fieldType
        } = this.state;

        const tdClasses = classNames(
            'table-cell',
            {
                isEditing: isEditing,
                isSelected: isSelected
            }
        )

        return isSelected ? (
            <td
                onClick={() => this.onClick()}
                style={{
                    width: `${width ? width : 'auto'}`,
                    whiteSpace: `${textNoWrap ? 'nowrap' : 'auto'}`,
                    // padding: isSelected ? unlocked ? '0px' : disabled ? '5px': '0px' : '5px',
                    padding: isSelected ? '0px' : '5px',
                    cursor: unlocked ? 'pointer' : disabled ? 'auto' : 'pointer'
                }}
                className={tdClasses}
            >
                <input
                    ref='input'
                    className="form-control table-input"
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
                onClick={() => this.onClick()}
                // onSelect={() => this.onSelect()}
                style={{
                    color: disabled ? unlocked ? color!='#0070C0' ? color : '#A8052C' : 'inherit' : color, //disabled ? !unlocked ? color != '#0070C0' ? color : '#A8052C' : 'inherit' : color
                    width: `${width ? width : 'auto'}`,
                    whiteSpace: `${textNoWrap ? 'nowrap' : 'auto'}`,
                    cursor: unlocked ? 'pointer' : disabled ? 'auto' : 'pointer'
                }}
                className={tdClasses}
                align={align ? align : 'left'}
            >
                <span>{this.formatText(fieldValue, fieldType)}</span>
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