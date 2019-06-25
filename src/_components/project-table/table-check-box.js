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
            fieldValue: false
        }
        this.onChange = this.onChange.bind(this);
        this.updatefield = this.updatefield.bind(this);
        this.handleResponse = this.handleResponse.bind(this);
    }
    
    componentDidMount(){
        this.setState({
            collection: this.props.collection,
            objectId: this.props.objectId,
            fieldName: this.props.fieldName,
            fieldValue: this.props.fieldValue ? this.props.fieldValue: false,
        });
    }

    onChange(event) {
        const { collection, objectId, fieldName } = this.state
        const target = event.target;
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({
            ...this.state,
            [name]: value
        }, () => {
            if (collection && objectId && fieldName) {
                this.updatefield(this.state);
            }            
        });
    }

    updatefield(args) {
        const requestOptions = {
            method: 'PUT',
            headers: { ...authHeader(), 'Content-Type': 'application/json' },
            body: `{"${args.fieldName}":${args.fieldValue}}`
        };
    
        return fetch(`${config.apiUrl}/${args.collection}/update?id=${args.objectId}`, requestOptions).then(this.handleResponse);
    }
    
    handleResponse(response) {
        return response.text().then(text => {
            if (text == 'Unauthorized') {
                logout();
                location.reload(true);
            }
            const data = text && JSON.parse(text);
            if (!response.ok) {
                if (response.status === 401) {
                    // auto logout if 401 response returned from api
                    logout();
                    location.reload(true);
                }
                const error = (data && data.message) || response.statusText;
                return Promise.reject(error);
            }
            return data;
        });
    }

    render(){
        const { fieldValue, disabled } = this.state
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
                <FontAwesomeIcon icon="check-square" className="checked fa-lg" style={{color: '#0070C0', padding: 'auto', textAlign: 'center', width: '100%'}}/>
                <FontAwesomeIcon icon={["far", "square"]} className="unchecked fa-lg" style={{color: '#adb5bd', padding: 'auto', textAlign: 'center', width: '100%'}}/>                
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
