import React from 'react';
import { connect } from 'react-redux';

class ProjectUsers extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { tab, users } = this.props
        return (
            <div className="tab-pane fade show" id={tab.id} role="tabpanel">
                <div className="row">
                    <div className="col-md-10 table-responsive mb-3">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>UserName</th>
                                    <th>expediter</th>
                                    <th>shipper</th>
                                    <th>warehouse</th>
                                    <th>inspector</th>
                                </tr>
                            </thead>
                            <tbody>

                            </tbody>
                        </table>
                    </div>
                    <div className="col-md-2 mb-3">
                        <h3>All Users</h3>
                        {users.items && (
                        <div className="list-group">
                        {users.items.map((user)=>(
                            <button
                                type="button"
                                className="list-group-item list-group-item-action"
                                key={user._id}
                                // onClick={this.addToProject(user)}
                            >
                            {user.firstName + " " + user.lastName}
                            </button>
                        ))}
                        </div>
                        )}
                    </div>
                </div>               
            </div>
        );
    }
}

export default ProjectUsers;