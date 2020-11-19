import React from 'react';

export class Modal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            clientXStart: 0,
            clientYStart: 0,
            topStart: 0,
            leftStart: 0,
        }
        this.onDragStart = this.onDragStart.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
    }

    onDragStart(event) {
        this.setState({
            clientXStart: event.clientX,
            clientYStart: event.clientY,
            topStart: Number(window.getComputedStyle(event.target).top.replace("px","")),
            leftStart: Number(window.getComputedStyle(event.target).left.replace("px","")),
        });
    }

    onDragEnd(event) {
        const { clientXStart, clientYStart, topStart, leftStart } = this.state;
        event.target.style.top = (topStart + event.clientY - clientYStart) + "px";
        event.target.style.left = (leftStart + event.clientX - clientXStart) + "px";
    }

    render() {
        if(!this.props.show){
            return null;
        }

        return (
            <div className="modal" tabIndex="-1" role="dialog">
                <div
                    className={this.props.size ? `modal-dialog ${this.props.size}` : 'modal-dialog'}
                    role="document"
                    draggable="true"
                    onDragStart={event => this.onDragStart(event)}
                    onDragEnd={event => this.onDragEnd(event)}
                >
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

// export default Modal;