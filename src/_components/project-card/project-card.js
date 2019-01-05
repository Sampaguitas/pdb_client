import React, { Component } from 'react';
import { NavLink, Link } from 'react-router-dom';

// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './project-card.css'

class ProjectCard extends Component {
    constructor(props) {
        super(props);
        const { property } = this.props
        this.state = {
            filter: '',
            projects: property.projects
        };
        this.filterProject = this.filterProject.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    filterProject(value) {
        const { property } = this.props
        if (!value) {
            this.setState({
                projects: property.projects.items
            });
        } else {
            value = value.replace(/\W/g, "");
            this.setState({
                projects: property.projects.filter((project) => !!project.name.match(new RegExp(value, "i")))
            });
        }
    }
    handleChange(event) {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
        this.filterProject(value);
    }
    render() {
        const { property, type } = this.props;
        const { filter } = this.state;
        return (
            <div className="col-md-3">
                <div className="card">
                    <h5 className="card-header">
                        <div className="row">
                            <div className="col-8">
                                <NavLink to={{ pathname: this.props.type}} tag="a">
                                    {property.name}
                                </NavLink>
                            </div>
                            <div className="col-4 text-right">
                                <div className="modal-link">
                                    <FontAwesomeIcon icon="plus" className="red fa-icon" />
                                </div>
                            </div>
                        </div>
                    </h5>
                    <div className="card-body">
                        <div className="form-group input-group-lg">
                            <input className="form-control text-center" name="filter" value={filter} onChange={this.handleChange} placeholder="Filter projects..." />
                        </div>
                            <div className="list-group">
                            {this.state.projects ?
                                this.state.projects && this.state.projects.map((project)=> 
                                    <NavLink to={{ pathname: '/project' }} tag="a" className="list-group-item list-group-item-action" key={project._id}>
                                        <span className="ellipsis">{project.name}</span>
                                    </NavLink> 
                                    
                                    // <li
                                    //     className="list-group-item list-group-item-action"
                                    //     key={project._id}
                                    // >
                                    //     {project.name}
                                    // </li>
                                )
                                :property.projects && property.projects.map((project) =>
                                    <NavLink to={{ pathname: '/project' }} tag="a" className="list-group-item list-group-item-action" key={project._id}>
                                        <span className="ellipsis">{project.name}</span>
                                    </NavLink>
                                
                                // <li 
                                //     className="list-group-item list-group-item-action" 
                                //     key={project._id}
                                // >
                                //     {project.name}
                                // </li>
                            )}
                            </div>
                    </div>
                </div>
            </div>
            );
        }
    }
    export default ProjectCard;
    
