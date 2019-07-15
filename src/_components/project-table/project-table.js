import React, { Component } from 'react';
import HeaderCheckBox from '../../_components/project-table/header-check-box';
import HeaderInput from '../../_components/project-table/header-input';
import HeaderSelect from '../../_components/project-table/header-select';
import NewRowCreate from '../../_components/project-table/new-row-create';
import NewRowCheckBox from '../../_components/project-table/new-row-check-box';
import NewRowInput from '../../_components/project-table/new-row-input';
import NewRowSelect from '../../_components/project-table/new-row-select';
import TableInput from '../../_components/project-table/table-input';
import TableSelect from '../../_components/project-table/table-select';
import TableCheckBox from '../../_components/project-table/table-check-box';
import TableSelectionRow from '../../_components/project-table/table-selection-row';
import TableSelectionAllRow from '../../_components/project-table/table-selection-all-row';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
class ProjectTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            header: {}
        };
        this.handleChangeHeader = this.handleChangeHeader.bind(this);  
    }

    handleChangeHeader(event) {
        const target = event.target;
        const name = target.name;
        const { header } = this.state;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({
            ...this.state,
            header:{
                ...header,
                [name]: value
            } 
        });
    }
    
    render() {
        const { screenHeaders } = this.props;
        const { header } = this.state;
        return (
            <div>
                <div className="row full-height ml-1">
                    <div className="full-height table-responsive"> 
                        <table className="table table-hover table-bordered table-sm">
                            <thead>
                                <tr>
                                    {screenHeaders && 
                                        screenHeaders.map(screenHeader => {
                                            switch (screenHeader.type) {
                                                case "String":
                                                    return ( 
                                                        <HeaderInput
                                                            type="text"
                                                            title={screenHeader.fields.custom}
                                                            name={screenHeader._id}
                                                            value={header[screenHeader._id]}
                                                            onChange={this.handleChangeHeader}
                                                            key={screenHeader._id}
                                                            textNoWrap={true}
                                                        />
                                                    );
                                                case "Number":
                                                    return ( 
                                                        <HeaderInput
                                                            type="number"
                                                            title={screenHeader.fields.custom}
                                                            name={screenHeader._id}
                                                            value={header[screenHeader._id]}
                                                            onChange={this.handleChangeHeader}
                                                            key={screenHeader._id}
                                                            textNoWrap={true}
                                                        />
                                                    );
                                                default: 
                                                    return ( 
                                                        <HeaderInput
                                                            type="text"
                                                            title={screenHeader.fields.custom}
                                                            name={screenHeader._id}
                                                            value={header[screenHeader._id]}
                                                            onChange={this.handleChangeHeader}
                                                            key={screenHeader._id}
                                                            textNoWrap={true}
                                                        />
                                                    );                                                                                                  
                                            }

                                        })
                                    }
                                </tr>
                            </thead>
                        </table>
                    </div>

                </div>
            </div>
        );
    }
}

export default ProjectTable;