import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class NewRowCreate extends Component {
    render(){
        const {onClick, creatingNewRow} = this.props
        return (
            <td
                style={{
                    width: '30px',
                    minWidth: '30px',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
            <div onClick={onClick}>
                <FontAwesomeIcon
                    icon={creatingNewRow ? "spinner" :"plus"}
                    className={creatingNewRow ? "fa-pulse fa-fw fa-lg" : "fa fa-lg"}
                    style={{
                        color: '#adb5bd',
                        padding: 'auto',
                        textAlign: 'center',
                        width: '100%',
                        margin: '0px',
                        verticalAlign: 'middle',
                        cursor: 'pointer'
                    }}  
                />
            </div>
        </td>
        );
    }
};

export default NewRowCreate;
