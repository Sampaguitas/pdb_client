import React, { Component } from 'react';
import classNames from 'classnames';
import {
    getDateFormat,
} from '../../_functions';

class NewRowInput extends Component{
    constructor(props) {
        super(props);
        this.state = {
            isEditing: false,
            isSelected: false,
        }
        this.onBlur = this.onBlur.bind(this);
        this.formatText = this.formatText.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    onKeyDown(event) {
        const { isEditing } = this.state;
        if (event.keyCode === 38 || event.keyCode === 40 || event.keyCode === 9 || event.keyCode === 13){ //up //down //tab //enter
            this.onBlur(event);  
        } else if (!isEditing && (event.keyCode === 37 || event.keyCode === 39)) { //left //right
            this.onBlur(event);
        }
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
                return fieldValue === '' ? '' : new Intl.NumberFormat().format(fieldValue);
            default: return fieldValue; //decodeURI
        }
    }
    

    render() {
        const {
            align,
            color,
            fieldType,
            fieldName, 
            onChange,
            textNoWrap,
            fieldValue, 
            width,
            maxLength
        } = this.props;

        const { isEditing, isSelected } = this.state;

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
                    color: isSelected ? 'inherit' : color,
                    width: `${width ? width : 'auto'}`,
                    whiteSpace: `${textNoWrap ? 'nowrap' : 'auto'}`, 
                    padding: isSelected ? '0px': '5px', /////
                    cursor: isSelected ? 'auto' : 'pointer' //////
                }}
                className={tdClasses}
                align={align ? align : 'left'}
            >
                {isSelected ?
                    <input
                        ref='input'
                        className="form-control"
                        type={fieldType}
                        name={fieldName}
                        value={fieldValue}
                        onChange={onChange}
                        onBlur={this.onBlur}
                        onKeyDown={event => this.onKeyDown(event)}
                        placeholder={fieldType === 'date' ? getDateFormat() : ''}
                        maxLength={maxLength || 524288}
                    />
                :
                    <span>{this.formatText(fieldValue, fieldType)}</span>
                }
            </td>
        );
    }
}

export default NewRowInput;