import React from 'react';
import PropTypes from 'prop-types';


class Modal extends React.Component {
  render() {
    if(!this.props.show){
        return null;
    }
    return (
        <div className="modal" tabIndex="-1" role="dialog" style={{display: 'block', overflowY: 'auto'}}> {/* style={{display: 'block', overflow: 'scroll'}} */}
            <div className={this.props.size ? `modal-dialog ${this.props.size}` : 'modal-dialog'} role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{this.props.title}</h5>
                        <button type="button" className="close" onClick={this.props.hideModal} data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        {this.props.children}
                    </div>     
                </div>
            </div> 
        </div>
    );
  }
}

// Modal.propTypes = {
// //   onClose: PropTypes.func.isRequired,
//   show: PropTypes.bool,
//   children: PropTypes.node
// };

export default Modal;