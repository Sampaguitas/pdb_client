import React, { Component } from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import { resolve } from '../../_functions';

function arraySorted(array, field, fromTbls) {
    if (array) {
        let newArray = [];
        if (!_.isEmpty(fromTbls)) {
            newArray = array.reduce(function (acc, cur) {
                if (fromTbls.indexOf(cur.fromTbl) != -1){
                    acc.push(cur)
                }
                return acc
            },[]);
        } else {
            newArray = array;
        }

        newArray.sort(function(a,b){
            if (resolve(field, a) < resolve(field, b)) {
                return -1;
            } else if ((resolve(field, a) > resolve(field, b))) {
                return 1;
            } else {
                return 0;
            }
        });
        return newArray;             
    }
}

class NewRowSelect extends Component{
    constructor(props) {
        super(props);
        this.state = {
            isSelected: false,
        }
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.selectedName = this.selectedName.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
    }

    onKeyDown(event) {
        if (event.keyCode === 37 || event.keyCode === 38 || event.keyCode === 39 || event.keyCode === 40 || event.keyCode === 9 || event.keyCode === 13){ //left //up //wright //down //tab //enter
            this.onBlur(event);  
        }
    }

    onClick() {
        this.setState({isSelected: true }, () => {
            setTimeout(() => {
            this.refs.select.focus();
            }, 1);
        });
    }

    onFocus() {
        this.setState({ isSelected: true }, () => {
            this.refs.select.focus();
        });
    }

    onBlur(event){
        event.preventDefault();
        this.setState({isSelected:false});
    }

    selectedName(arr, search) {
        const { optionText } = this.props;
        if (arr && search) {
            const foundOption = arr.find((option) => {
                return _.isEqual(option._id, search);
            })
            if(foundOption){
                return foundOption[optionText];
            } else {
                "";
            }
        } else {
            return '';
        }
    }

    render() {
        const {
            align,
            color,
            fieldName,
            onChange,
            options,
            optionText,
            fromTbls,
            textNoWrap,
            fieldValue,
            width
        } = this.props;

        const { isSelected } = this.state;

        const tdClasses = classNames(
            'table-cell',
            {
                isSelected: isSelected,
            }
        );

        return (
            <td
                onClick={() => this.onClick()} /////
                style={{
                    color: isSelected ? 'inherit' : color,
                    width: `${width ? width : 'auto'}`,
                    whiteSpace: `${textNoWrap ? 'nowrap' : 'auto'}`,
                    padding: isSelected ? '0px': '5px', /////
                    cursor: isSelected ? 'auto' : 'pointer' /////
                }}
                className={tdClasses}
                align={align ? align : 'left'}
            >
                {isSelected ?
                    <select
                        ref='select'
                        className="form-control"
                        name={fieldName}
                        value={fieldValue}
                        onChange={onChange}
                        onBlur={this.onBlur}
                        onKeyDown={event => this.onKeyDown(event)} 
                    >
                        <option>Select...</option>
                        {options && arraySorted(options, optionText, fromTbls).map(option => {
                            return (
                                <option
                                    key={option._id}
                                    value={option._id}>{option[optionText]}
                                </option>
                            );
                        })}                    
                    </select>
                :
                    <span>{this.selectedName(options, fieldValue)}</span>
                }
            </td>
        );
    }
}

export default NewRowSelect;