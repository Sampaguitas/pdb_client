import React, {Component} from 'react';
import { SettingWidth } from './setting-width';
import _ from 'lodash';

function generateLayout(screenHeaders, settingsColWidth, clearWidth) {
    let tempArray = [];
    if (!_.isEmpty(screenHeaders)) {
        screenHeaders.map((screenHeader, index) => {
            if (!_.isEmpty(settingsColWidth) && settingsColWidth.hasOwnProperty(screenHeader._id)) {
                tempArray.push(
                    <SettingWidth
                        key={index}
                        id={screenHeader._id}
                        name={screenHeader._id}
                        title={screenHeader.fields.custom}
                        value={settingsColWidth[screenHeader._id]}
                        clearWidth={clearWidth}
                    />
                );
            }
    
        });
    }
    
    if (!_.isEmpty(tempArray)) {
        return (
            <div style={{borderStyle: 'solid', borderWidth: '1px', borderColor: '#ddd', height: '400px', overflowY: 'auto'}}>
                <div className="row ml-2 mr-2 mt-4">
                    {tempArray}
                </div>
            </div>
        );
    } else {
        return (
            <div style={{borderStyle: 'solid', borderWidth: '1px', borderColor: '#ddd', height: '400px', overflowY: 'auto'}}>
                <div className={`alert alert-warning ml-2 mr-2 mt-2`}>
                    None of the columns on this screen have custom width, Click on the save button if you would like update your user settings.
                </div>
            </div>
        );
    }
}

export class TabWidth extends Component{
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
        const { screenHeaders, settingsColWidth, clearWidth } = this.props;
        return (
            <div>
                <div className="row modal-btn-links mb-3">
                    <button
                        className="btn btn btn-link mr-2"
                        style={{fontSize: '12.5px'}}
                        onClick={event => clearWidth(event)}
                    >
                        Clear All
                    </button>
                </div>
                {generateLayout(screenHeaders, settingsColWidth, clearWidth)}
            </div>

        );
    }
}

// export default TabWidth;