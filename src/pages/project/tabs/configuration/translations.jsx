import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Translations extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { tab } = this.props
        return (
            <div className="tab-pane fade show" id={tab.id} role="tabpanel">
                <div className="row">
                    <div className="col-md-6">
                        <h3>Translations</h3>
                    </div>
                    <div className="col-md-6">
                        <div className="text-right">
                            <button className="btn btn-success" type="button">
                                <FontAwesomeIcon icon="save" name="save"/> Save Changes
                            </button>
                            <button className="btn btn-outline-leeuwen" hidden>
                                <FontAwesomeIcon icon="plus" name="plus"/> Add Field
                            </button>
                            <button className="btn btn-outline-leeuwen" type="button">
                                <FontAwesomeIcon icon="plus" name="plus"/> Add Language
                            </button>
                        </div>
                    </div>
                </div>
                <hr />
                <div className="form-group">
                    <input className="form-control" placeholder="Filter..." />
                </div>
                <div className="table-responsive">
                    <table className="table table-hover table-sm table-bordered">
                        <thead>
                            <tr>
                                <th>Label</th> 
                            </tr>
                        </thead>
                    </table>
                </div>              
            </div>
        );
    }
}

export default Translations;