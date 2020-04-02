import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function resolve(path, obj) {
    return path.split('.').reduce(function(prev, curr) {
        return prev ? prev[curr] : null
    }, obj || self)
}

function arraySorted(array, field) {
    if (array) {
        const newArray = array
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

class HeaderSelect extends Component{

    render() {
        const { title, name, value, options, optionText, onChange, width, textNoWrap } = this.props;
        return (
            <th style={{width: `${width ? width : 'auto'}`, whiteSpace: `${textNoWrap ? 'nowrap' : 'auto'}`, padding: '0px' }}>
                <div role="button" style={{whiteSpace: 'nowrap', height: '27px', padding: '5px'}}>
                    <span style={{display: 'inline-block', width: 'calc(100% - 20px)', fontSize: '12px', textAlign: 'left', verticalAlign: 'middle', margin: '0px', padding: '0px'}}>{title}</span>
                    <span style={{display: 'inline-block', width: '20px', fontSize: '12px', textAlign: 'right', verticalAlign: 'middle', margin: '0px', padding: '0px'}}><FontAwesomeIcon icon="sort-down" style={{verticalAlign: 'top'}}/></span>
                </div>
                <div className="form-group" style={{margin: '0px', padding: '0px 5px 5px 5px'}}>
                    <select
                        className="form-control form-control-sm"
                        id={name}
                        name={name}
                        value={value}
                        onChange={onChange}
                        style={{
                            // padding: '.375rem .75rem',
                            // cursor: 'pointer'
                            boxSizing: 'border-box',
                            height: '20px',
                            padding: '0rem .75rem',
                            cursor: 'pointer'
                        }}
                    >
                        <option value="any">Any</option>
                        {options && arraySorted(options, optionText).map(option => {
                            return (
                                <option
                                    key={option._id}
                                    value={option._id}>{option[optionText]}
                                </option>                                   
                            );
                        })}
                    </select>
                </div>
            </th>
        );
    }
}

export default HeaderSelect;