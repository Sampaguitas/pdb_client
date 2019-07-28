import React, { Component } from 'react';
class HeaderCheckBox extends Component{

    render() {
        const { title, name, value, onChange, width } = this.props;
        return (
            <th style={{width: `${width ? width : 'auto'}` }}>
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
                        style={{padding: '.375rem .75rem'}}
                    >
                        <option key="1" value="any">Any</option>
                        <option key="2" value="true">True</option> 
                        <option key="3" value="false">False</option> 
                    </select>
                </div>
            </th>
        );
    }
}

export default HeaderCheckBox;