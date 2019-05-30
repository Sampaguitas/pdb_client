import React, { Component } from 'react';
import propTypes from 'prop-types';
import { history } from '../../_helpers';

class ProjectRow extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleOnclick = this.handleOnclick.bind(this);
    }
    handleOnclick(event) {
        event.preventDefault();
        const { project } = this.props;
        history.push({
            pathname:'/dashboard',
            search: '?id=' + project._id
        });
    }
    render() {
        const { project } = this.props;
        return (
            <tr key={project._id} onClick={(event) => this.handleOnclick(event)}>
                <td>{project.number}</td>
                <td>{project.name}</td>
                <td>{project.opco.name}</td>
                <td>{project.erp.name}</td>
            </tr>
        );
    }
}

// ProjectRow.propTypes = {
//     color: propTypes.string.isRequired,
//     header: propTypes.string.isRequired
// };

export default ProjectRow;