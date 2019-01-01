import React, { Component } from 'react';
import propTypes from 'prop-types';
import { userActions } from '../_actions';
import config from 'config';
import { authHeader } from '../_helpers';


class TableCheckBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user:{
                id: '',
                isAdmin: false
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
            isAdmin: !this.state.user.isAdmin
        };
        this.update(temp_user).then(this.setState({
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
            <div className="form-check">
                <input
                    name="isAdmin"
                    type="checkbox"
                    className="form-check-input"
                    checked={this.state.user.isAdmin}
                    onChange={this.handleInputChange}
                />
            </div>
        );
    }
};
TableCheckBox.propTypes = {
    id:propTypes.string.isRequired,
    checked:propTypes.bool.isRequired
};
export default TableCheckBox;
