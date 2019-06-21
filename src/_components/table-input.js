import React, { Component } from 'react';
import config from 'config';
import { authHeader } from '../_helpers';
import propTypes from 'prop-types';

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}

class TableInput extends Component{
    constructor(props) {
        super(props);
        this.state = {
            collection: '',
            objectId: '',
            fieldName: '',
            fieldValue: '',
            fieldType: '',
            color: 'inherit',
            editing: false
        }
        this.onChange = this.onChange.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.updatefield = this.updatefield.bind(this);
        this.handleResponse = this.handleResponse.bind(this);

    }
    componentDidMount(){
        this.setState({
            collection: this.props.collection,
            objectId: this.props.objectId,
            fieldName: this.props.fieldName,
            fieldValue: this.props.fieldValue,
            fieldType: this.props.fieldType,
        });
    }

    onChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({
            ...this.state,
            [name]: value
        });
    }

    onFocus() {
        this.setState({ editing: true }, () => {
            this.refs.input.focus();
        });
    }

    onBlur(event){
        event.preventDefault();
        const { collection, objectId, fieldName, fieldValue } = this.state      
        if (collection && objectId && fieldName && fieldValue) {
            this.updatefield(this.state)
            .then(
                field => {
                    this.setState({color:'green'}, () => {
                        setTimeout(() => {
                            this.setState({color: 'inherit'});
                        }, 1000);
                    }, () => {
                        this.setState({editing:false});
                    });
                },
                error => {
                    this.setState({color:'red'}, () => {
                        setTimeout(() => {
                            this.setState({color: 'inherit'});
                        }, 1000);
                    }, () => {
                        this.setState({editing:false});
                    });
                }
            );
        }
    }

    updatefield(args) {
        const requestOptions = {
            method: 'PUT',
            headers: { ...authHeader(), 'Content-Type': 'application/json' },
            body: `{"${args.fieldName}":"${args.fieldValue}"}`
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

    render() {
        const { fieldValue, fieldType, color } = this.state

        return this.state.editing ? (
            <td className="text-nowrap" style={{padding:0}}>
                <input
                    ref='input'
                    className="form-control"
                    type={fieldType}
                    name='fieldValue'
                    value={fieldValue}
                    onChange={this.onChange}
                    onBlur={this.onBlur}
                    style={{
                        margin: 0,
                        borderRadius:0,
                        borderColor: 'white',
                        backgroundColor: 'inherit',
                        color: color,
                        WebkitBoxShadow: 'none',
                        boxShadow: 'none',  
                    }}
                />
            </td>
        ):
        (
        <td onDoubleClick={() => this.onFocus()}>{fieldValue}</td>
        );
    }
}

TableInput.propTypes = {
    fieldType: propTypes.oneOf(['text', 'number', 'email', 'tel','password', 'date']).isRequired,
    fieldName: propTypes.string.isRequired,
    fieldValue:propTypes.oneOfType([
        propTypes.string,
        propTypes.number,
        propTypes.instanceOf(Date),
    ])
};

export default TableInput;