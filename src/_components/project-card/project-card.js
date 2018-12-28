import React, { Component } from 'react';
import { NavLink, Link } from 'react-router-dom';

// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCog, faSignOutAlt, faBars, faPlus } from '@fortawesome/free-solid-svg-icons';
import './project-card.css'

class ProjectCard extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        return (
            <div className="col-md-3">
                <div className="card">
                    <h5 className="card-header">
                        <div className="row">
                            <div className="col-8">
                                <a>Header</a>
                            </div>
                            <div className="col-4 text-right">
                                <div className="modal-link">
                                    <FontAwesomeIcon icon={faPlus} className="red fa-icon" />
                                </div>
                            </div>
                        </div>
                    </h5>
                    <div className="card-body">
                        <div className="form-group input-group-lg">
                            <input className="form-control text-center" placeholder="Filter projects..." />
                        </div>
                            <div className="list-group">
                                <li className="list-group-item list-group-item-action">Petrofac</li>
                                <li className="list-group-item list-group-item-action">GASCO IGD</li>
                                <li className="list-group-item list-group-item-action">Total</li>
                            </div>
                    </div>
                </div>
            </div>
            );
        }
    }
    export default ProjectCard;
    
