import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class HeaderInput extends Component{

    render() {
        
        const { type, title, name, value, onChange, width, textNoWrap, sort, toggleSort, maxLength } = this.props;
        
        return (
            <th style={{width: `${width ? width : 'auto'}`, whiteSpace: `${textNoWrap ? 'nowrap' : 'auto'}`, padding: '0px' }}>
                <div role="button" className="btn-header" onClick={event => toggleSort(event, name)}>
                    <span className="btn-header-title no-select">
                        {title}
                    </span>
                    <span className="btn-header-icon">
                        {sort.name === name && sort.isAscending ?
                            <FontAwesomeIcon icon="sort-up" className="btn-header-icon__icon"/>
                        : sort.name === name && !sort.isAscending &&
                            <FontAwesomeIcon icon="sort-down" className="btn-header-icon__icon"/>
                        }
                    </span>
                </div>
                <div className="form-group" style={{margin: '0px', padding: '0px 5px 5px 5px'}}>
                    <input
                        className="form-control form-control-sm"
                        name={name}
                        type={type}
                        value={value}
                        onChange={onChange}
                        style={{
                            boxSizing: 'border-box',
                            height: '20px',
                            padding: '0rem .75rem'
                        }}
                        maxLength={maxLength || 524288}
                    />
                </div>
                <div
                    role="button"
                    style={{
                        position: 'absolute',
                        top: '0px',
                        bottom: '0px',
                        right: '0px',
                        width:'3px',
                        height: 'auto',
                        zIndex: '2',
                        cursor: 'col-resize'
                    }}
                >

                </div>
            </th>
        );
    }
}

export default HeaderInput;