import React, {Component} from 'react';
import SettingInput from './setting-input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


function getInputType(dbFieldType) {
    switch(dbFieldType) {
        case 'Number': return 'number';
        case 'Date': return 'date';
        default: return 'text'
    }
}


function generateLayout(settingsFilter, handleInputSettings) {
    let tempArray = [];
    
    if (!!settingsFilter) {
        settingsFilter.map(function (element, index){
            tempArray.push(
                <SettingInput
                    key={index}
                    type={getInputType(element.type)}
                    title={element.custom}
                    name={element._id}
                    value={element.value}
                    handleInputSettings={handleInputSettings}
                />
            );
        });
    }
    
    return (
        <div style={{borderStyle: 'solid', borderWidth: '1px', borderColor: '#ddd', height: '300px', overflowY: 'auto'}}>
            <div className="row ml-2 mr-2 mt-4">
                {tempArray}
            </div>
        </div>
    );
}

class TabFilter extends Component{
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
        const { settingsFilter, handleInputSettings } = this.props;
        return (
            <div>
                <div className="row modal-btn-links mb-3">
                    <button
                        className="btn btn btn-link mr-2"
                        style={{fontSize: '12.5px'}}
                        onClick={event => this.handleClear(event)}
                    >
                        Clear All
                    </button>
                </div>
                {generateLayout(settingsFilter, handleInputSettings)}
            </div>

        );
    }
}

export default TabFilter;