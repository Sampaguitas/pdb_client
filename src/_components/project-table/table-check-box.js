import React, { Component } from 'react';
import config from 'config';
import { authHeader } from '../../_helpers';
import propTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './table-check-box.css'

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}

class TableCheckBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collection: '',
            objectId: '',
            fieldName: '',
            fieldValue: false,
            color: '#0070C0',
            // disabled: false,
        }
        this.onChange = this.onChange.bind(this);
    }
    
    componentDidMount(){
        this.setState({
            collection: this.props.collection,
            objectId: this.props.objectId,
            fieldName: this.props.fieldName,
            fieldValue: this.props.fieldValue ? this.props.fieldValue : false,
            // disabled: this.props.disabled ? this.props.disabled : false
        });
    }

    onChange(event) {
        const { collection, objectId, fieldName, fieldValue } = this.state
        const target = event.target;
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({
            ...this.state,
            [name]: value
        }, () => {
            if (collection && objectId && fieldName) {
                const requestOptions = {
                    method: 'PUT',
                    headers: { ...authHeader(), 'Content-Type': 'application/json' },
                    body: `{"${fieldName}":${fieldValue}}`
                };
                return fetch(`${config.apiUrl}/${collection}/update?id=${objectId}`, requestOptions)
                .then( () => {
                    this.setState({
                        ...this.state,
                        color: 'green',
                    }, () => {
                        setTimeout(() => {
                            this.setState({
                                ...this.state,
                                color: '#0070C0',
                            });
                        }, 1000);                         
                    });
                })
                .catch( () => {
                    this.setState({
                        ...this.state,
                        color: 'red',
                        fieldValue: this.props.fieldValue ? this.props.fieldValue: false,
                    }, () => {
                        setTimeout(() => {
                            this.setState({
                                ...this.state,
                                color: '#0070C0',
                            });
                        }, 1000);
                    }); 
                });
            }            
        });
    }

    render(){
        const { disabled } = this.props;
        const { fieldValue, color } = this.state;
        return (
            <td>
             <div>
                <label className="fancy-table-checkbox">
                <input
                    ref="input"
                    type='checkbox'
                    name='fieldValue'
                    checked={fieldValue}
                    onChange={this.onChange}
                    disabled={disabled}
                />
                <FontAwesomeIcon icon="check-square" className="checked fa-lg" style={{color: disabled ? '#adb5bd' : color, padding: 'auto', textAlign: 'center', width: '100%'}}/>
                <FontAwesomeIcon icon={["far", "square"]} className="unchecked fa-lg" style={{color: disabled ? '#adb5bd' : color, padding: 'auto', textAlign: 'center', width: '100%'}}/>                
                </label>
            </div>
            </td>
        );
    }
};
TableCheckBox.propTypes = {
    fieldName: propTypes.string.isRequired,
    fieldValue:propTypes.oneOfType([
        propTypes.string,
        propTypes.number,
        propTypes.bool,
        propTypes.instanceOf(Date),
    ])

};

export default TableCheckBox;
