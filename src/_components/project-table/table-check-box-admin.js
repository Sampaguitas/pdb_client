import React, { Component } from 'react';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import { userActions } from '../../_actions';
import config from 'config';
import { authHeader } from '../../_helpers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './table-check-box-admin.css'

class TableCheckBoxAdmin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user:{
                id: '',
                isAdmin: false
            }
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.setAdmin = this.setAdmin.bind(this);
        this.handleResponse = this.handleResponse.bind(this);
    }
    setAdmin(user) {
        const requestOptions = {
            method: 'PUT',
            headers: { ...authHeader(), 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        };
        return fetch(`${config.apiUrl}/user/setAdmin?id=${user.id}`, requestOptions).then(this.handleResponse);
    }
    handleResponse(response) {
        return response.text().then(text => {
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

    handleInputChange() {
        const temp_user = {
            id: this.props.id,
            isAdmin: !this.state.user.isAdmin
        };
        this.setAdmin(temp_user).then(this.setState({
            user: {
                id: temp_user.id,
                isAdmin: temp_user.isAdmin
            }

        }));
    }

    componentDidMount(){     
        this.setState({ 
            user: {
                id: this.props.id,
                isAdmin: this.props.checked
            }
        })
    }
    render(){
        return (
            <div>
                <label className="fancy-table-check-box-admin" data-type="checkbox">
                <input
                    name="isAdmin"
                    type="checkbox"
                    checked={this.state.user.isAdmin}
                    onChange={this.handleInputChange}
                    disabled={this.props.disabled}
                    data-type="checkbox"
                />
                <FontAwesomeIcon data-type="checkbox" icon="check-square" className="checked fa-lg" style={{color: '#0070C0', padding: 'auto', textAlign: 'center', width: '100%'}}/>
                <FontAwesomeIcon data-type="checkbox" icon={["far", "square"]} className="unchecked fa-lg" style={{color: '#adb5bd', padding: 'auto', textAlign: 'center', width: '100%'}}/> 
                </label>

            </div>
        );
    }
};
TableCheckBoxAdmin.propTypes = {
    id:propTypes.string.isRequired,
    checked:propTypes.bool.isRequired
};

export default TableCheckBoxAdmin;
