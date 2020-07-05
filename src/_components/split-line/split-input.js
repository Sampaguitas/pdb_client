import React, { Component } from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import {
    myLocale,
    getDateFormat,
} from '../../_functions';

class SplitInput extends Component{
    constructor(props) {
        super(props);
        this.state = {
            isEditing: false,
            isSelected: false,
        }
        this.onChange = this.onChange.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.formatText = this.formatText.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);

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
        const { callback, indexBody } = this.props;
        this.setState({isEditing: true});
        callback(event, indexBody);
    }

    onClick() {
        const { isSelected } = this.state;
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

    onBlur(event){
        event.preventDefault();
        
        this.setState({
            isEditing: false,
            isSelected: false,
        });
    }

    formatText(fieldValue, fieldType){
        switch(fieldType){
            case "number":
                return (fieldValue == '' || _.isUndefined(fieldValue)) ? '' : new Intl.NumberFormat().format(fieldValue);
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
            fieldName,
            fieldValue,
            fieldType,
        } = this.props;

        const {
            isEditing,
            isSelected,
        } = this.state;

        const tdClasses = classNames(
            'table-cell',
            {
                isEditing: isEditing,
                isSelected: isSelected
            }
        )

        return (
            <td
                onClick={() => this.onClick()}
                style={{
                    whiteSpace: 'nowrap',
                    padding: isSelected ? '0px': '5px',
                    cursor: isSelected ? 'auto' : 'pointer'
                }}
                className={tdClasses}
                align={align ? align : 'left'}
            >
                {isSelected ?
                    <input
                        ref='input'
                        className="form-control table-input"
                        type={fieldType === 'number' ? 'number' : 'text'}
                        name={fieldName}
                        value={fieldValue}
                        onChange={event => this.onChange(event)}
                        onBlur={this.onBlur}
                        onKeyDown={event => this.onKeyDown(event)}
                        placeholder={fieldType === 'date' ? getDateFormat(myLocale) : ''}
                    />
                :
                    <span>{this.formatText(fieldValue, fieldType)}</span>
                }
            </td>
        );
    }
}

export default SplitInput;