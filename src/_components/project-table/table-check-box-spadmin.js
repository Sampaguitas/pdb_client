import React, { Component } from 'react';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import { userActions } from '../../_actions';
import config from 'config';
import { authHeader } from '../../_helpers';


class TableCheckBoxSuperAdmin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user:{
                id: '',
                isSuperAdmin: false
            }
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.update = this.update.bind(this);
        this.handleResponse = this.handleResponse.bind(this);
    }
    update(user) {
        const requestOptions = {
            method: 'PUT',
            headers: { ...authHeader(), 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        };
        return fetch(`${config.apiUrl}/user/update?id=${user.id}`, requestOptions).then(this.handleResponse);
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
            isSuperAdmin: !this.state.user.isSuperAdmin
        };
        this.update(temp_user).then(this.setState({
            user: {
                id: temp_user.id,
                isSuperAdmin: temp_user.isSuperAdmin
            }

        }));
    }

    componentDidMount(){     
        this.setState({ 
            user: {
                id: this.props.id,
                isSuperAdmin: this.props.checked
            }
        })
    }
    render(){
        return (
            <div className="form-check">
                <input
                    name="isSuperAdmin"
                    type="checkbox"
                    className="form-check-input"
                    checked={this.state.user.isSuperAdmin}
                    onChange={this.handleInputChange}
                    disabled={this.props.disabled}
                />
            </div>
        );
    }
};
TableCheckBoxSuperAdmin.propTypes = {
    id:propTypes.string.isRequired,
    checked:propTypes.bool.isRequired
};

export default TableCheckBoxSuperAdmin;
