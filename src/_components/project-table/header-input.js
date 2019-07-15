import React, { Component } from 'react';

class HeaderInput extends Component{

    render() {
        const { type, title, name, value, onChange, width } = this.props;
        return (
            <th style={{width: `${width ? width : 'auto'}` }}>
                <div class="form-group">
                    <label htmlFor={name}>{title}</label>
                    <input
                        className="form-control"
                        id={name}
                        name={name}
                        type={type}
                        value={value}
                        onChange={onChange}
                    />
                </div>
            </th>
        );
    }
}

export default HeaderInput;