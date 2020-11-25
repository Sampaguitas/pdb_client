import React, {Component} from 'react';
import _ from 'lodash';

function generateLayout(screenHeaders) {
    
    let tempArray = [];

    if (!_.isEmpty(screenHeaders)) {
        screenHeaders.map((screenHeader, index) => {
            tempArray.push(
                <div key={index} className="col-4">
                    <p>{index}. {screenHeader.fields.custom}</p>
                </div>
            );
        });
    }
    
    return (
        <div style={{borderStyle: 'solid', borderWidth: '1px', borderColor: '#ddd', height: '400px', overflowY: 'auto'}}>
            <div className="row ml-2 mr-2 mt-4">
                {tempArray}
            </div>
        </div>
    );
    
}

export class TabPosition extends Component{
    constructor(props) {
        super(props);
        this.handleClear = this.handleClear.bind(this);
    }

    handleClear(event) {
        event.preventDefault();
        const { handleClearInputSettings } = this.props;
        handleClearInputSettings();
    }

    render() {
        const { screenHeaders, resetPosition } = this.props;
        return (
            <div>
                <div className="row modal-btn-links mb-3">
                    <button
                        className="btn btn btn-link mr-2"
                        style={{fontSize: '12.5px'}}
                        onClick={event => resetPosition(event)}
                    >
                        Reset Positions
                    </button>
                </div>
                {generateLayout(screenHeaders)}
            </div>
        );
    }
}

// export default TabPosition;