import React from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';
import { projectActions } from '../../_actions';
import Layout from '../../_components/layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Duf extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            projectId: '',
            fileName: '' 
        };
        this.onKeyPress = this.onKeyPress.bind(this);
        this.handleUploadFile = this.handleUploadFile.bind(this);
        this.handleDownloadFile = this.handleDownloadFile.bind(this);
    }

    componentDidMount() {
        const { dispatch, location } = this.props
        var qs = queryString.parse(location.search);
        if (qs.id) {
            dispatch(projectActions.getById(qs.id));
        }
    }

    onKeyPress(event) {
        if (event.which === 13 /* prevent form submit on key Enter */) {
          event.preventDefault();
        }
    }

    handleUploadFile(event){
        event.preventDefault();
        const { projectId, fileName } = this.state
        if(this.fileInput.current.files[0] && projectId && fileName) {
            var data = new FormData()
            data.append('file', this.fileInput.current.files[0]);
            data.append('projectId', projectId);
            const requestOptions = {
                method: 'POST',
                headers: { ...authHeader()}, //, 'Content-Type': 'application/json'
                body: data
            }
            return fetch(`${config.apiUrl}/duf/upload`, requestOptions)
            // .then(handleSelectionReload);            
        }        
    }

    handleDownloadFile(event){
        event.preventDefault();
        const { projectId } = this.state
        if(projectId) {
            var data = new FormData()
            data.append('file', this.fileInput.current.files[0]);
            data.append('projectId', projectId);
            const requestOptions = {
                method: 'GET',
                headers: { ...authHeader(), 'Content-Type': 'application/json'},
            }
            return fetch(`${config.apiUrl}/duf/download`, requestOptions)
            .then(res => res.blob()).then(blob => saveAs(blob, 'Duf.xlsx'));         
        }  

    }

    render() {
        const { alert, selection } = this.props;
        const { fileName } = this.state;
        return (
            <Layout alert={this.props.alert} accesses={selection.project && selection.project.accesses}>
                {alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div>}
                <h2>Upload DUF : {selection.project ? selection.project.name : <FontAwesomeIcon icon="spinner" className="fa-pulse fa-1x fa-fw" />}</h2>
                <hr />
                <div id="duf" className="full-height">
                    <div className="action-row row ml-1 mb-3 mr-1" style={{height: '34px'}}>
                        <form
                            className="col-12"
                            encType="multipart/form-data"
                            onSubmit={this.handleUploadFile}
                            onKeyPress={this.onKeyPress}
                            style={{marginLeft:'0px', marginRight: '0px', paddingLeft: '0px', paddingRight: '0px'}}
                        >
                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" style={{width: '95px'}}>Select Template</span>
                                    <input
                                        type="file"
                                        name="fileInput"
                                        id="fileInput"
                                        ref={this.fileInput}
                                        className="custom-file-input"
                                        style={{opacity: 0, position: 'absolute', pointerEvents: 'none', width: '1px'}}
                                        onChange={this.handleFileChange}
                                        key={this.state.inputKey}
                                    />
                                </div>
                                <label type="text" className="form-control text-left" htmlFor="fileInput" style={{display:'inline-block', padding: '7px'}}>{fileName ? fileName : 'Choose file...'}</label>
                                <div className="input-group-append mr-2">
                                    <button type="submit" className="btn btn-outline-leeuwen-blue btn-lg">
                                        <span><FontAwesomeIcon icon="upload" className="fa-lg mr-2"/>Upload</span>
                                    </button>
                                    <button className="btn btn-outline-leeuwen-blue btn-lg" onClick={event => this.handleDownloadFile(event)}>
                                        <span><FontAwesomeIcon icon="download" className="fa-lg mr-2"/>Download</span>
                                    </button> 
                                </div>       
                            </div>
                        </form>                    
                    </div>
                    <div className="" style={{height: 'calc(100% - 44px)'}}>

                    </div>

                </div>
            </Layout>
        );
    }
}

function mapStateToProps(state) {
    const { alert, selection } = state;
    return {
        alert,
        selection
    };
}

const connectedDuf = connect(mapStateToProps)(Duf);
export { connectedDuf as Duf };