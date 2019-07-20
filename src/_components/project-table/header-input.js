import React, { Component } from 'react';

class HeaderInput extends Component{

    render() {
        const { type, title, name, value, onChange, width, textNoWrap } = this.props;
        return (
            <th style={{width: `${width ? width : 'auto'}`, whiteSpace: `${textNoWrap ? 'nowrap' : 'auto'}` }}>
                <div className="form-group">
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