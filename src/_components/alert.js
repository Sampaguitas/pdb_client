import React, { Component } from 'react';

class Alert extends Component {
    render() {
        const { alert } = this.props
        return (
            <div className="fixed-bottom">
                {
                    alert.message &&
                    <div className={`alert ${alert.type}`}>{alert.message}</div>
                }
            </div>
        )
    }
}

export default Alert;