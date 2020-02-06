import React, { Component } from 'react';
import _ from 'lodash';

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
            editing: false,
        }
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.selectedName = this.selectedName.bind(this);
    }

    onFocus() {
        this.setState({ editing: true }, () => {
            this.refs.input.focus();
        });
    }

    onBlur(event){
        event.preventDefault();
        this.setState({editing:false});
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
            name,
            onChange,
            options,
            optionText,
            fromTbls,
            textNoWrap,
            value,
            width
        } = this.props;

        const { editing } = this.state;

        return editing ? (
            <td
                style={{
                    width: `${width ? width : 'auto'}`,
                    whiteSpace: `${textNoWrap ? 'nowrap' : 'auto'}`,
                    padding: '0px'
                }}
            >
                <select
                    ref='input'
                    className="form-control"
                    name={name}
                    value={value}
                    onChange={onChange}
                    onBlur={this.onBlur}
                    disabled={disabled}
                    // style={{
                    //     margin: 0,
                    //     borderRadius:0,
                    //     borderColor: 'white',
                    //     backgroundColor: 'inherit',
                    //     color: color,
                    //     WebkitBoxShadow: 'none',
                    //     boxShadow: 'none',  
                    // }}
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
            </td>
        )
        :
        (
            <td
                onClick={() => this.onFocus()}
                style={{
                    color: disabled ? 'inherit' : color,
                    width: `${width ? width : 'auto'}`,
                    whiteSpace: `${textNoWrap ? 'nowrap' : 'auto'}`
                }}
                align={align ? align : 'left'}
            >
                {this.selectedName(options, value)}
            </td>
        );
    }
}

export default NewRowSelect;