import React, { Component } from 'react';
import propTypes from 'prop-types';

class ProjectRow extends Component {
    constructor(props) {
        super(props);
        this.state = {}
        
    }
    render() {
        const { project } = this.props;
        return (
            <tr key={project._id} >
                <td>{project.number}</td>
                <td>{project.name}</td>
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