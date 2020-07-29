import React, { Component } from 'react';
import config from 'config';
import { authHeader } from '../../_helpers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './table-check-box-spadmin.css'

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}
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
        const { id, checked } = this.props  
        this.setState({ 
            user: {
                id: id,
                isSuperAdmin: checked
            }
        })
    }
    render(){
        const { user } = this.state;
        const { disabled } = this.props;
        return (
            <label className="table-check-box-spadmin" data-type="checkbox">
            <input
                name="isSuperAdmin"
                type="checkbox"
                checked={user.isSuperAdmin}
                onChange={this.handleInputChange}
                disabled={disabled}
                data-type="checkbox"
            />
            <FontAwesomeIcon
                data-type="checkbox"
                icon="check-square"
                className="checked fa-lg"
                style={{
                    color: disabled ? '#adb5bd' : '#0070C0',
                    padding: 'auto',
                    textAlign: 'center',
                    width: '100%',
                    margin: '0px',
                    verticalAlign: 'middle',
                    cursor: disabled ? 'auto' : 'pointer'
                }}
            />
            <FontAwesomeIcon
                data-type="checkbox"
                icon={["far", "square"]}
                className="unchecked fa-lg"
                style={{
                    color: disabled ? '#adb5bd' : '#0070C0',
                    padding: 'auto',
                    textAlign: 'center',
                    width: '100%',
                    margin: '0px',
                    verticalAlign: 'middle',
                    cursor: disabled ? 'auto' : 'pointer'
                }}
            /> 
            </label>
        );
    }
};

export default TableCheckBoxSuperAdmin;
