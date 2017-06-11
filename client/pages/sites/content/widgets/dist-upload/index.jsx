'use strict';
const Actions = require('../../actions.js');
const DistActions = require('./actions.js');
const React = require('react');
const Navigatable = require('react-router-component').NavigatableMixin
const Form = require('react-jsonschema-form').default;
const Store = require('./store');

const Files = require('react-files').default;

const propTypes = {
    hydrated: React.PropTypes.bool,
    loading: React.PropTypes.bool,
    error: React.PropTypes.string,
    hasError: React.PropTypes.object,
    help: React.PropTypes.object
};

class DistUpload extends React.Component {

    constructor(props) {
        super(props);

        this.state = Store.getState();
        console.log(this.props);
    }

    removeFile(event) {
        let state = Store.getState();
        state.file.filename = ""

        this.setState(state);

        // Resets when there is no file.
        Actions.updateFormData({
            mediaType: '',
            mediaSize: '',
            downloadURL: '',
            format: ''
        });

    }

    onFilesChange(event) {
        let file = event.target.files[0];

        let siteId = window.location.pathname.split('/')[2];

        DistActions.submitFile(siteId, file);

        let format = this.humanReadableFormat(file.type);
        console.log(format);
        Actions.updateFormData({
            mediaType: file.type,
            mediaSize: file.size,
            format: format
        });

    }

    onFilesError(error, file) {
        console.log('error code ' + error.code + ': ' + error.message)
    }

    resetState(key, value) {
        let state = {
            distUpload: {
                upload: "",
                api: "",
                remote: ""
            },
            files: this.state.files
        }
        state.distUpload[key] = value
        return state;

    }

    componentDidMount() {

        this.unsubscribeStore = Store.subscribe(this.onStoreChange.bind(this));
    }

    componentWillUnmount() {

        this.unsubscribeStore();
    }

    onStoreChange() {

        this.setState(Store.getState());

    }

    componentWillUpdate(nextProps, nextState) {
        console.log("nextState", nextState);
        if (nextState.file.url) {
            Actions.updateFormData({
                downloadURL: nextState.file.url
            });
        }

    }

    onChange(event) {


        //const newState = this.resetState(event.target.name, event.target.value);


        //this.setState(newState);
//        Actions.updateFormData({accessURL: event.target.value});
//        Actions.getContent("test-this-make-it-work");

//        this.props.onChange(value: event.target.value);
//        this.setState({});

    }

    humanReadableFormat(type) {
        let format = "";
        switch (type) {
            case 'image/gif':
                format = 'gif';
                break;
            case 'image/bmp':
                format = 'bmp';
                break;
            case 'image/jpg':
            case 'image/jpeg':
                format = 'jpeg';
                break;
            case 'media/png':
                format = 'png';
                break;
            case 'video/webm':
            case 'video/ogg':
                format = 'video';
                break;
            case 'audio/midi':
            case 'audio/mpeg':
            case 'audio/webm':
            case 'audio/ogg':
            case 'audio/wav':
                format = 'audio';
                break;
            case 'application/pdf':
                format = 'pdf';
                break;
            case 'text/plain':
                format = 'text';
                break;
            case 'text/csv':
                format = 'csv';
                break;
            case 'application/zip':
                format = 'zip';
                break;
        }
        console.log(format);
        return format;

    }

    mediaIcon(type) {
        let icon = "";
        switch (type) {
            case 'image/gif':
            case 'image/bmp':
            case 'image/jpeg':
            case 'meda/png':
                icon = <i className="fa fa-image"></i>;
                break;
            case 'video/webm':
            case 'video/ogg':
                icon = <i className="fa fa-file-audio-o"></i>;
                break;
            case 'audio/midi':
            case 'audio/mpeg':
            case 'audio/webm':
            case 'audio/ogg':
            case 'audio/wav':
                icon = <i className="fa fa-file-audio-o"></i>;
                break;
            case 'application/pdf':
                icon = <i className="fa fa-file-pdf-o"></i>;
                break;
            case 'text/plain':
            case 'text/csv':
                icon = <i className="fa fa-file-text-o"></i>;
                break;
            case 'application/zip':
                icon = <i className="fa fa-file-zip-o"></i>;
                break;
            default:
                icon = <i className="fa fa-file-o"></i>;
        }
        return icon;
    }

    fileView() {
        console.log(this.state);
        if (this.state.file.loading == true && this.state.file.hydrated == false) {
            return(
                <div className="file-handler">
                    <i className="fa fa-spinner fa-spin"></i>
                </div>

            );
        }

        else if (this.state.file.filename) {
            return (
                <div className="file-handler">
                    <div className="file-preview">
                        {this.mediaIcon(this.state.file.type)} <span className="file-name">{ this.state.file.filename }</span>
                    </div>
                    <div className="file-remove">
                        <i className='fa fa-remove' onClick={this.removeFile.bind(this)}></i>
                    </div>
                </div>
            );
        }
        else {
            return(
                <div className="file-handler">
                    <input type="file" name="file" onChange={this.onFilesChange.bind(this)}/>
                </div>

            );
        }
    }

    render() {
        console.log("props", this.props);
        console.log("State", this.state);

        return (
            <div className="dist-upload-row">
                <ul className="nav nav-tabs" role="tablist" id="dist-upload-tabs">
                    <li role="presentation" className="active"><a href="#upload" aria-controls="upload" role="tab" data-toggle="tab">File Upload</a></li>
                    <li role="presentation"><a href="#api" aria-controls="api" role="tab" data-toggle="tab">API or Website</a></li>
                    <li role="presentation"><a href="#remote" aria-controls="remote" role="tab" data-toggle="tab">Remote File</a></li>
                </ul>

                <div className="tab-content">
                    <div role="tabpanel" className="tab-pane active" id="upload">
                        <br />
                        {this.fileView()}
                    </div>
                    <div role="tabpanel" className="tab-pane" id="api">
                        <br />
                            { this.state.file.filename ?
                                <span>
                                <input name="api" readOnly onChange={this.onChange.bind(this)} type="text" className="form-control" placeholder="http://example.com/api"></input>
                                <span className="form-description">Can't include API or Website if file is uploaded.</span>
                                </span>
                                :
                                <input name="api" onChange={this.onChange.bind(this)} type="text" className="form-control" placeholder="http://example.com/api"></input>
                            }
                    </div>
                    <div role="tabpanel" className="tab-pane" id="remote">
                        <br />
                            <input name="remote"  onChange={this.onChange.bind(this)} type="text" className="form-control" placeholder="http://example.com/filename.csv"></input>

                    </div>
                </div>
            </div>
      );
    }
}

DistUpload.propTypes = propTypes;


module.exports = DistUpload;
