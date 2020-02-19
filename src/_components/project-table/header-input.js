import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class HeaderInput extends Component{

    render() {
        
        const { 
            type, 
            title, 
            name, 
            value, 
            onChange, 
            width, 
            textNoWrap 
        } = this.props;
        
        return (
            <th style={{width: `${width ? width : 'auto'}`, whiteSpace: `${textNoWrap ? 'nowrap' : 'auto'}` }}>
                
                <div className="form-group" style={{marginBottom: '0px'}}>
                    <label htmlFor={name} style={{marginBottom: '0px'}}>{title}</label>
                    {/* <FontAwesomeIcon icon="sort-down" className="fa-2x ml-2"/> */}
                    <input
                        className="form-control"
                        // id={name}
                        name={name}
                        type={type}
                        value={value}
                        onChange={onChange}
                        style={{padding: '.375rem .75rem'}} //{{padding: '0rem 0.75rem', lineHeight: '20px', height: '22px'}}//
                    />
                </div>

            </th>
        );
    }
}

export default HeaderInput;