import React, { Component } from 'react';
import propTypes from 'prop-types';
import { history } from '../../_helpers';
import TableCheckBoxAdmin from "../../_components/table-check-box-admin";
import TableCheckBoxSuperAdmin from "../../_components/table-check-box-spadmin";

class UserRow extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.isUser = this.isUser.bind(this)
    }


    isUser(id) {
        let user = JSON.parse(localStorage.getItem('user'));
        if (user.id == id) {
          return true;
        } else {
          return false;
        }
    }

    render() {
        const { user, currentUser, handleOnclick, handleInputChange } = this.props;
        return (
            <tr key={user._id} onClick={(event) => handleOnclick(event, user._id)}>
                <td>{user.userName}</td>
                <td>{user.name}</td>
                <td>{user.opco.name}</td>
                <td>{user.opco.region.name}</td>
                <td>
                {
                    this.isUser(user._id) ?
                    <TableCheckBoxAdmin
                        id={user._id}
                        checked={user.isAdmin}
                        onChange={handleInputChange}
                        disabled={true}
                    />
                    :
                    <TableCheckBoxAdmin
                    id={user._id}
                    checked={user.isAdmin}
                    onChange={handleInputChange}
                    disabled={false}
                    />
                }
                </td>
                <td>
                {
                    this.isUser(user._id) ?
                    <TableCheckBoxSuperAdmin
                        id={user._id}
                        checked={user.isSuperAdmin}
                        onChange={handleInputChange}
                        disabled={true}
                    />
                    :
                    currentUser.isSuperAdmin ?
                        <TableCheckBoxSuperAdmin
                        id={user._id}
                        checked={user.isSuperAdmin}
                        onChange={handleInputChange}
                        disabled={false}
                        />
                    :
                        <TableCheckBoxSuperAdmin
                        id={user._id}
                        checked={user.isSuperAdmin}
                        onChange={handleInputChange}
                        disabled={true}
                        />
                } 
                </td>
            </tr>
        );
    }
}

// ProjectRow.propTypes = {
//     color: propTypes.string.isRequired,
//     header: propTypes.string.isRequired
// };

export default UserRow;