import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Documents extends React.Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         selectedTemplate:'',
    //         selectedRows: [],
    //         selectAllRows: false
    //     }
    //     this.handleChangeTemplate = this.handleChangeTemplate.bind(this);
    //     this.toggleSelectAllRow = this.toggleSelectAllRow.bind(this);
    // }

    // handleChangeTemplate(event) {
    //     const target = event.target;
    //     const name = target.name;
    //     const value = target.type === 'checkbox' ? target.checked : target.value;
    //     this.setState({
    //         ...this.state,
    //         [name]: value,
    //         selectedRows: [],
    //         selectAllRows: false
    //     });
    // }
    
    // toggleSelectAllRow() {
    //     const { selectAllRows } = this.state;
    //     const { selection } = this.props;
    //     if (selection.project) {
    //         if (selectAllRows) {
    //             this.setState({
    //                 selectedRows: [],
    //                 selectAllRows: false
    //             });
    //         } else {
    //             this.setState({
    //                 selectedRows: this.filterName(selection.project.docdefinition).map(s => s._id),
    //                 selectAllRows: true
    //             });
    //         }         
    //     }
	// }

    render() {

        // const { 
        //     tab,
        // } = this.props
        
        // const {
        //     selectedTemplate,
        //     selectAllRows,
        // } = this.state;

        
        return (<div></div>
            // <div className="tab-pane fade show full-height" id={tab.id} role="tabpanel">
            //     <div className="row full-height">
            //         <div className="table-responsive full-height">
            //             <thead>
            //                 <tr className="text-center">
            //                     <th colSpan="6" >
            //                         <div className="form-group">
            //                             <div className="input-group-prepend">
            //                                 <span className="input-group-text">Select Template</span>
            //                             </div>
            //                             <select className="form-control" name="selectedTemplate" value={selectedTemplate} onChange={this.handleChangeTemplate}>
            //                             {/*Options*/}
            //                             </select>
            //                         </div>
            //                     </th>
            //                 </tr>
            //                 <tr>
            //                     <th style={{ width: '30px', alignItems: 'center', justifyContent: 'center'}}>
            //                         <TableSelectionAllRow
            //                             selectAllRows={selectAllRows}
            //                             toggleSelectAllRow={this.toggleSelectAllRow}
            //                             selectedTemplate={selectedTemplate}
            //                         />
            //                     </th>                                
            //                 </tr>
            //             </thead>
            //         </div>
            //     </div>    
            // </div>
            );
    }
}

export default Documents;