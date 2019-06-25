import React, { Component } from 'react';
import propTypes from 'prop-types';
import { history } from '../../_helpers';
import TableCheckBoxAdmin from "../../_components/project-table/table-check-box-admin";
import TableCheckBoxSuperAdmin from "../../_components/project-table/table-check-box-spadmin";
const _ = require('lodash');

class UserRow extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.isUser = this.isUser.bind(this);
        this.checkBoxDisabled = this.checkBoxDisabled.bind(this);
    }


    isUser(id) {
        let user = JSON.parse(localStorage.getItem('user'));
        if (user.id == id) {
          return true;
        } else {
          return false;
        }
    }

    checkBoxDisabled(type) {
        const { user, currentUser } = this.props
        if (_.isEqual(user.id, currentUser.id)) {
            return true;
        } else if (type === 'isSuperAdmin' && !currentUser.isSuperAdmin) {
            return true;
        } else if (_.isEqual(currentUser.regionId, user.opco.regionId)) {
            return false;
        } else if (currentUser.isSuperAdmin) {
            return false;
        } else {
            return true;
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
                <td data-type="checkbox">
                    <TableCheckBoxAdmin
                        id={user._id}
                        checked={user.isAdmin}
                        onChange={handleInputChange}
                        disabled={this.checkBoxDisabled('isAdmin')}
                        data-type="checkbox"
                    />
                </td>
                <td data-type="checkbox">
                    <TableCheckBoxSuperAdmin
                        id={user._id}
                        checked={user.isSuperAdmin}
                        onChange={handleInputChange}
                        disabled={this.checkBoxDisabled('isSuperAdmin')}
                        data-type="checkbox"
                    />
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