import React, { Component } from 'react';
import propTypes from 'prop-types';

class TableCheckBox extends Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         id: '',
    //         checked: false
    //     };
    //     this.handleInputChange = this.handleInputChange.bind(this);
    //     //this.update = this.update.bind(this);
    // }

    // handleInputChange() {
    //     const temp_user = {
    //         id: this.props.id,
    //         checked: !this.state.checked
    //     };
    //     this.setState({
    //         id: temp_user.id,
    //         checked: temp_user.checked
    //     });
    // }

    // componentDidMount(){     
    //     this.setState({ 
    //         id: this.props.id,
    //         checked: this.props.checked
    //     });
    // }
    render(){
        return (
            <div className="form-check">
                <input
                    name={this.props.id}
                    type="checkbox"
                    className="form-check-input"
                    checked={this.props.checked}
                    onChange={this.props.onChange}
                    disabled={this.props.disabled}
                />
            </div>
        );
    }
};
TableCheckBox.propTypes = {
    id:propTypes.string.isRequired,
    checked:propTypes.bool.isRequired
};

export default TableCheckBox;
