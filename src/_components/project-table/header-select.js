import React, { Component } from 'react';

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
        const { title, name, value, options, optionText, onChange, width } = this.props;
        return (
            <th style={{width: `${width ? width : 'auto'}`}}>
                <div className="form-group" style={{marginBottom: '0px'}}>
                    <label
                        htmlFor={name}
                        style={{marginBottom: '0px'}}
                    >
                        {title}
                    </label>
                    <select
                        className="form-control"
                        id={name}
                        name={name}
                        value={value}
                        onChange={onChange}
                        style={{
                            padding: '.375rem .75rem',
                            cursor: 'pointer'
                        }}
                    >
                        {/* <option value="any">Any</option> */}
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