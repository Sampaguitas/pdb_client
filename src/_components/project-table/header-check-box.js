import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class HeaderCheckBox extends Component{

    render() {
        const { title, name, value, onChange, width, textNoWrap, sort, toggleSort } = this.props;
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
                    <select
                        className="form-control form-control-sm"
                        id={name}
                        name={name}
                        value={value}
                        onChange={onChange}
                        style={{
                            boxSizing: 'border-box',
                            height: '20px',
                            padding: '0rem .75rem',
                            cursor: 'pointer'
                        }}
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