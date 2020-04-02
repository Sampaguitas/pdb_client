import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class HeaderInput extends Component{

    render() {
        
        const { type, title, name, value, onChange, width, textNoWrap } = this.props;
        
        return (
            <th style={{width: `${width ? width : 'auto'}`, whiteSpace: `${textNoWrap ? 'nowrap' : 'auto'}`, padding: '0px' }}>
                <div role="button" style={{whiteSpace: 'nowrap', height: '27px', padding: '5px'}}>
                    <span style={{display: 'inline-block', width: 'calc(100% - 20px)', fontSize: '12px', textAlign: 'left', verticalAlign: 'middle', margin: '0px', padding: '0px'}}>{title}</span>
                    <span style={{display: 'inline-block', width: '20px', fontSize: '12px', textAlign: 'right', verticalAlign: 'middle', margin: '0px', padding: '0px'}}><FontAwesomeIcon icon="sort-down" style={{verticalAlign: 'top'}}/></span>
                </div>
                <div className="form-group" style={{margin: '0px', padding: '0px 5px 5px 5px'}}>
                    <input
                        className="form-control form-control-sm"
                        // id={name}
                        name={name}
                        type={type}
                        value={value}
                        onChange={onChange}
                        style={{
                            boxSizing: 'border-box',
                            height: '20px',
                            padding: '0rem .75rem'
                        }}
                    />
                </div>
            </th>
        );
    }
}

export default HeaderInput;