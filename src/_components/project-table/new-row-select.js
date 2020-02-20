import React, { Component } from 'react';
import _ from 'lodash';
import classNames from 'classnames';

function resolve(path, obj) {
    return path.split('.').reduce(function(prev, curr) {
        return prev ? prev[curr] : null
    }, obj || self)
}


function arraySorted(array, field, fromTbls) {
    if (array) {
        let newArray = [];
        if (!_.isEmpty(fromTbls)) {
            newArray = array.reduce(function (accumulator, currentValue) {
                if (fromTbls.indexOf(currentValue.fromTbl) != -1){
                    accumulator.push(currentValue)
                }
                return accumulator
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
        // const { disabled, unlocked } = this.props;
        // if(unlocked || !disabled){
        this.setState({isSelected: true }, () => {
            setTimeout(() => {
            this.refs.select.focus();
            }, 1);
        });
        // }
    }

    onFocus() {
        this.setState({ isSelected: true }, () => {
            this.refs.input.focus();
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
            disabled,
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
            // isSelected ? (
            <td
                onClick={() => this.onClick()} /////
                style={{
                    // color: isSelected ? 'inherit' : disabled ? unlocked ? color!='#0070C0' ? color : '#A8052C' : 'inherit' : color, /////
                    color: isSelected ? 'inherit' : color,
                    width: `${width ? width : 'auto'}`,
                    whiteSpace: `${textNoWrap ? 'nowrap' : 'auto'}`,
                    // padding: '0px'
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
                        // disabled={disabled}
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
        // )
        // :
        // (
        //     <td
        //         onClick={() => this.onFocus()}
        //         style={{
        //             color: disabled ? 'inherit' : color,
        //             width: `${width ? width : 'auto'}`,
        //             whiteSpace: `${textNoWrap ? 'nowrap' : 'auto'}`
        //         }}
        //         align={align ? align : 'left'}
        //     >
        //         {this.selectedName(options, value)}
        //     </td>
        // );
        );
    }
}

export default NewRowSelect;