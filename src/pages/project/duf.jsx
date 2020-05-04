import React from 'react';
import config from 'config';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import queryString from 'query-string';
import { accessActions, alertActions, projectActions } from '../../_actions';
import Layout from '../../_components/layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { authHeader } from '../../_helpers';
import _ from 'lodash';

class Duf extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            projectId: '',
            fileName: '',
            inputKey: Date.now(),
            uploading: false,
            downloading: false,
            responce:{},
            alert: {
                type:'',
                message:''
            }
        };
        this.handleClearAlert = this.handleClearAlert.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
        this.handleUploadFile = this.handleUploadFile.bind(this);
        this.handleDownloadFile = this.handleDownloadFile.bind(this);
        this.handleFileChange=this.handleFileChange.bind(this);
        this.dufInput = React.createRef();
        this.handleChange = this.handleChange.bind(this);
        this.generateRejectionRows = this.generateRejectionRows.bind(this);
    }

    handleClearAlert(event){
        event.preventDefault;
        const { dispatch } = this.props;
        this.setState({ 
            alert: {
                type:'',
                message:'' 
            } 
        });
        dispatch(alertActions.clear());
    }

    componentDidMount() {
        const { 
            dispatch,
            loadingAccesses,
            loadingSelection,
            location 
        } = this.props;

        var qs = queryString.parse(location.search);
        if (qs.id) {
            this.setState({projectId: qs.id});
            if (!loadingAccesses){
                dispatch(accessActions.getAll(qs.id));
            }
            if (!loadingSelection) {
                dispatch(projectActions.getById(qs.id));
            }
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
        if(this.dufInput.current.files[0] && projectId && fileName) {
            this.setState({uploading: true});
            var data = new FormData()
            data.append('file', this.dufInput.current.files[0]);
            data.append('projectId', projectId);
            const requestOptions = {
                method: 'POST',
                headers: { ...authHeader()}, //, 'Content-Type': 'application/json'
                body: data
            }
            return fetch(`${config.apiUrl}/duf/upload`, requestOptions)
            .then(responce => responce.text().then(text => {
                const data = text && JSON.parse(text);
                if (!responce.ok) {
                    if (responce.status === 401) {
                        localStorage.removeItem('user');
                        location.reload(true);
                    }
                    const error = (data && data.message) || responce.statusText;
                    this.setState({
                        uploading: false,
                        responce: {
                            rejections: data.rejections,
                            nProcessed: data.nProcessed,
                            nRejected: data.nRejected,
                            nAdded: data.nAdded,
                            nEdited: data.nEdited
                        },
                        alert: {
                            type: responce.status === 200 ? 'alert-success' : 'alert-danger',
                            message: data.message
                        }
                    });
                } else {
                    this.setState({
                        uploading: false,
                        responce: {
                            rejections: data.rejections,
                            nProcessed: data.nProcessed,
                            nRejected: data.nRejected,
                            nAdded: data.nAdded,
                            nEdited: data.nEdited
                        },
                    });
                }
            }));            
        }        
    }

    handleDownloadFile(event){
        event.preventDefault();
        const { projectId } = this.state
        if(projectId) {
            this.setState({downloading: true});
            const requestOptions = {
                method: 'GET',
                headers: { ...authHeader(), 'Content-Type': 'application/json'},
            }
            return fetch(`${config.apiUrl}/duf/download?projectId=${projectId}`, requestOptions)
            .then(responce => {
                if (!responce.ok) {
                    if (responce.status === 401) {
                        localStorage.removeItem('user');
                        location.reload(true);
                    }
                    this.setState({
                        downloading: false,
                        alert: {
                            type: responce.status === 200 ? 'alert-success' : 'alert-danger',
                            message: 'an error has occured'  
                        }
                    });
                } else {
                    this.setState({downloading: false});
                    responce.blob().then(blob => saveAs(blob, 'Duf.xlsx')); 
                }
            });        
        } 
    }

    handleFileChange(event){
        if(event.target.files.length > 0) {
            this.setState({
                ...this.state,
                fileName: event.target.files[0].name
            });
        }
    }

    handleChange(event) {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    }

    generateRejectionRows(responce){
        let temp =[]
        if (!_.isEmpty(responce.rejections)) {
            responce.rejections.map(function(r, index) {
                temp.push(
                <tr key={index}>
                    <td>{r.row}</td>
                    <td>{r.reason}</td>
                </tr>   
                );
            });
            return (temp);
        } else {
            return (
                <tr>
                    <td></td>
                    <td></td>
                </tr>
            );
        }
    }

    render() {
        const { accesses, selection } = this.props;
        
        const { 
            fileName,
            responce,
            downloading,
            uploading,
            projectId,
        } = this.state;

        const alert = this.state.alert ? this.state.alert : this.props.alert;
        return (
            <Layout alert={alert} accesses={accesses} selection={selection}>
                {alert.message && 
                    <div className={`alert ${alert.type}`}>{alert.message}
                        <button className="close" onClick={(event) => this.handleClearAlert(event)}>
                            <span aria-hidden="true"><FontAwesomeIcon icon="times"/></span>
                        </button>
                    </div>
                }
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <NavLink to={{ pathname: '/dashboard', search: '?id=' + projectId }} tag="a">Dashboard</NavLink>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">Data Upload File (DUF):</li>
                        <span className="ml-3 project-title">{selection.project ? selection.project.name : <FontAwesomeIcon icon="spinner" className="fa-pulse fa-lg fa-fw" />}</span>
                    </ol>
                </nav>
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
                                        name="dufInput"
                                        id="dufInput"
                                        ref={this.dufInput}
                                        className="custom-file-input"
                                        style={{opacity: 0, position: 'absolute', pointerEvents: 'none', width: '1px'}}
                                        onChange={this.handleFileChange}
                                        key={this.state.inputKey}
                                    />
                                </div>
                                <label type="text" className="form-control text-left" htmlFor="dufInput" style={{display:'inline-block', padding: '7px'}}>{fileName ? fileName : 'Choose file...'}</label>
                                <div className="input-group-append">
                                    <button type="submit" className="btn btn-outline-leeuwen-blue btn-lg">
                                        <span><FontAwesomeIcon icon={uploading ? "spinner" : "upload"} className={uploading ? "fa-pulse fa-fw fa-lg mr-2" : "fa-lg mr-2"}/>Upload</span>
                                    </button>
                                    <button className="btn btn-outline-leeuwen-blue btn-lg" onClick={event => this.handleDownloadFile(event)}>
                                        <span><FontAwesomeIcon icon={downloading ? "spinner" : "download"} className={downloading ? "fa-pulse fa-fw fa-lg mr-2" : "fa-lg mr-2"}/>Download</span>
                                    </button> 
                                </div>       
                            </div>
                        </form>                    
                    </div>
                    {!_.isEmpty(responce) &&
                        <div className="ml-1 mr-1" style={{height: 'calc(100% - 44px)'}}>
                            <div className="form-group table-resonsive" style={{height: '83px'}}>
                                <strong>Total Processed:</strong> {responce.nProcessed}<br />
                                <strong>Total records Added:</strong> {responce.nAdded}<br />
                                <strong>Total Records Edited:</strong> {responce.nEdited}<br />
                                <strong>Total Records Rejected:</strong> {responce.nRejected}<br />
                                <hr />
                            </div>
                            {!_.isEmpty(responce.rejections) &&
                                <div className="rejections" style={{height: 'calc(100% - 93px)'}}>
                                    <h3>Rejections</h3>
                                    <div className="" style={{height: 'calc(100% - 29px)'}}>
                                        <div className="table-responcive custom-table-container">
                                            <table className="table table-sm">
                                                <thead>
                                                    <tr>
                                                        <th style={{width: '10%'}}>Row</th>
                                                        <th style={{width: '90%'}}>Reason</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {this.generateRejectionRows(responce)}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    }
                </div>
            </Layout>
        );
    }
}

function mapStateToProps(state) {
    const { accesses, alert, selection } = state;
    const { loadingAccesses } = accesses;
    const { loadingSelection } = selection;
    return {
        accesses,
        alert,
        loadingAccesses,
        loadingSelection,
        selection
    };
}

const connectedDuf = connect(mapStateToProps)(Duf);
export { connectedDuf as Duf };