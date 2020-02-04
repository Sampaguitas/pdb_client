import React, { Component } from 'react';
import config from 'config';
import { authHeader } from '../../_helpers';
import propTypes from 'prop-types';
import _ from 'lodash';
import classNames from 'classnames';
import moment from 'moment';


const locale = Intl.DateTimeFormat().resolvedOptions().locale;
//const locale = //ja-JP, fr-FR, en-US, en-GB, nl
const options = Intl.DateTimeFormat(locale, {'year': 'numeric', 'month': '2-digit', day: '2-digit'})
const myLocale = Intl.DateTimeFormat(locale, options);

function getLiteral(myLocale) {
    let firstLiteral = myLocale.formatToParts().find(function (element) {
      return element.type === 'literal';
    });
    if (firstLiteral) {
      return firstLiteral.value;
    } else {
      return '/';
    }
};

function getDateFormat(myLocale) {
    let tempDateFormat = ''
    myLocale.formatToParts().map(function (element) {
        switch(element.type) {
            case 'month': 
                tempDateFormat = tempDateFormat + 'MM';
                break;
            case 'literal': 
                tempDateFormat = tempDateFormat + element.value;
                break;
            case 'day': 
                tempDateFormat = tempDateFormat + 'DD';
                break;
            case 'year': 
                tempDateFormat = tempDateFormat + 'YYYY';
                break;
        }
    });
    return tempDateFormat;
}

function TypeToString (fieldValue, fieldType, myDateFormat) {
    if (fieldValue) {
        switch (fieldType) {
            case 'date': return String(moment(fieldValue).format(myDateFormat)); 
            default: return fieldValue;
        }
    } else {
        return '';
    }
    
    //return String(Intl.DateTimeFormat(locale, options).format(new Date(fieldValue)));
}

function StringToType (fieldValue, fieldType, myDateFormat) {
    if (fieldValue) {
        switch (fieldType) {
            case 'date': return moment(fieldValue, myDateFormat).toDate();
            default: return fieldValue;
        }
    } else {
        return '';
    }
}

function isValidFormat (fieldValue, fieldType, myDateFormat) {
    if (fieldValue) {
        switch (fieldType) {
            case 'date': return moment(fieldValue, myDateFormat, true).isValid();
            default: return true;
        }
    } else {
        return true;
    }
    
}


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
        this.onBlur = this.onBlur.bind(this);
        this.formatText = this.formatText.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);

    }
    
    componentDidMount(){
        this.setState({
            collection: this.props.collection,
            objectId: this.props.objectId,
            fieldName: this.props.fieldName,
            fieldValue: TypeToString (this.props.fieldValue, this.props.fieldType, getDateFormat(myLocale)),
            fieldType: this.props.fieldType,
        });  
    }

    componentWillReceiveProps(nextProps) {
        if(!_.isEqual(nextProps.fieldValue, this.props.fieldValue)) {
            this.setState({
                collection: nextProps.collection,
                objectId: nextProps.objectId,
                fieldName: nextProps.fieldName,
                fieldValue: TypeToString (nextProps.fieldValue, nextProps.fieldType, getDateFormat(myLocale)),
                fieldType: this.props.fieldType,
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
        }
    }

    onKeyDown(event) {
        const { isEditing } = this.state;
        if (event.keyCode === 38 || event.keyCode === 40 || event.keyCode === 9 || event.keyCode === 13){ //up //down //tab //enter
            this.onBlur(event);  
        } else if (!isEditing && (event.keyCode === 37 || event.keyCode === 39)) { //left //right
            this.onBlur(event);
        }
    }

    onChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({
            ...this.state,
            isEditing: true,
            [name]: value //decodeURI(
        });
    }

    onClick() {
        const { disabled, unlocked } = this.props;
        const { isSelected, fieldValue, fieldType } = this.state;
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
        const { collection, objectId, fieldName, fieldValue, fieldType } = this.state;

        if ((unlocked || !disabled) && collection && objectId && fieldName) {
            if (!isValidFormat(fieldValue, fieldType, getDateFormat(myLocale))) {
                this.setState({
                    ...this.state,
                    isEditing: false,
                    isSelected: false,
                    color: 'red',
                    fieldValue: this.props.fieldValue ? TypeToString (this.props.fieldValue, this.props.fieldType, getDateFormat(myLocale)) : '',
                }, () => {
                    setTimeout(() => {
                        this.setState({
                            ...this.state,
                            color: '#0070C0',
                        });
                    }, 1000);
                });
            } else {
                const requestOptions = {
                    method: 'PUT',
                    headers: { ...authHeader(), 'Content-Type': 'application/json' },
                    body: `{"${fieldName}":"${encodeURI(StringToType (fieldValue, fieldType, getDateFormat(myLocale)))}"}` //encodeURI
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
                        fieldValue: this.props.fieldValue ? TypeToString (this.props.fieldValue, this.props.fieldType, myDateFormat) : '',
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
        } else {
            this.setState({
                ...this.state,
                isEditing: false,
                isSelected: false,
            });
        }
    }

    //Intl.NumberFormat().resolvedOptions().locale => "en-US"

    formatText(fieldValue, fieldType){
        switch(fieldType){
            case "number":
                return fieldValue === '' ? '' : new Intl.NumberFormat().format(fieldValue);
            //     break;
            // case "date":
            //     return fieldValue ? new Intl.DateTimeFormat().format(new Date(fieldValue)) : '';
            //     break;
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
                    padding: '0px',
                    cursor: unlocked ? 'pointer' : disabled ? 'auto' : 'pointer'
                }}
                className={tdClasses}
            >
                <input
                    ref='input'
                    className="form-control table-input"
                    type={fieldType === 'number' ? 'number' : 'text'}
                    name='fieldValue'
                    value={fieldValue}
                    onChange={this.onChange}
                    onBlur={this.onBlur}
                    disabled={unlocked ? false : disabled}
                    onKeyDown={event => this.onKeyDown(event)}
                    placeholder={fieldType === 'date' ? getDateFormat(myLocale) : ''}
                />
            </td>
        ):
        (
            <td 
                onClick={() => this.onClick()}
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