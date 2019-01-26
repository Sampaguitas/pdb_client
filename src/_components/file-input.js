import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class MobileItem extends Component {
    constructor(props) {
        super(props);
        this.setUploadFile=this.setUploadFile.bind(this);
    }


    render() {
        const { uploadFileName } = this.props
        return (
            <div className="input-group mb-3">
                <div className="custom-file">
                    <input
                        type="file"
                        className="custom-file-input"
                        onChange={this.setUploadFile}
                        id="upload-file-input"
                    />
                    <label 
                        className="custom-file-label"
                        htmlFor="inputGroupFile01"
                    >
                        {uploadFileName}
                    </label>
                </div>
                <div className="input-group-append">
                    <button
                        className="btn btn-leeuwen"
                        type="button"
                        onClick={this.clearUploadFile}
                    >
                        <FontAwesomeIcon
                            icon="trash-alt"
                            name="trash-alt"
                        />
                    </button>
                    <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={this.startUploadFile}
                    >
                        {uploading ?
                            <FontAwesomeIcon
                            icon="spinner"
                            name="spinner"
                            />
                        :
                            <FontAwesomeIcon
                                icon="upload"
                                name="upload"
                            />
                        }
                        Upload
                    </button>
                    <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={this.getExample}
                    >
                        {uploading ?
                            <FontAwesomeIcon
                            icon="spinner"
                            name="spinner"
                            />
                        :
                            <FontAwesomeIcon
                                icon="download"
                                name="download"
                            />
                        }
                        Download
                    </button>
                </div>
            </div>
        );
    }
}
export default MobileItem;