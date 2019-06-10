import React from 'react';
import { connect } from 'react-redux';

class Templates extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { tab } = this.props
        return ( <div></div>
            // <div className="tab-pane fade show" id={tab.id} role="tabpanel">
            //     <div className="form-group row">
            //         <label htmlFor="ProjectName" className="col-sm-2 col-form-label">Project Name</label>
            //         <div className="col-sm-10">
            //             <input type="text" className="form-control" id="projectName"></input>
            //         </div>
            //     </div>
            //     <div className="form-group row">
            //         <label htmlFor="projectCustomer" className="col-sm-2 col-form-label">Customer</label>
            //         <div className="col-sm-10">
            //             <select className="form-control" id="projectCustomer">
            //             </select>
            //         </div>
            //     </div>               
            // </div>
        );
    }
}

export default Templates;