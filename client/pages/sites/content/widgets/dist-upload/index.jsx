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

        this.state.item = {};
        this.state.item.type = 'upload';
        this.state.item.source = '';

    }

    removeFile(event) {
        let state = Store.getState();
        state.file.filename = "";
        state.file.url = "";
        this.state.item.type = "";
        this.state.item.source = "";

        this.setState(state);

        // Resets when there is no file.
        Actions.updateFormData({
            mediaType: '',
            mediaSize: '',
            downloadURL: undefined,
            format: undefined
        });

    }

    onFilesChange(event) {
        let file = event.target.files[0];

        let siteId = window.location.pathname.split('/')[2];

        DistActions.submitFile(siteId, file);

        let format = this.humanReadableFormat(file.type);

        Actions.updateFormData({
            mediaType: file.type,
            mediaSize: file.size,
            format: format
        });
//        this.props.onChange({value:});

    }

    splitValue(nextState, nextProps) {
        // Because of the constraints of using the json-schema as a data stoe,
        // specifically that you can't overwrite an object or array, just a
        // single field, we want to store both the value and the tab/type in "value".
        nextState.value = nextProps.value;
        nextState.item = {};
        if (nextProps.value != undefined) {
            nextState.item.type = nextState.value.split('[]')[0];
            nextState.item.source = nextState.value.split('[]')[1];
            if (nextState.item.type == "upload") {
                nextState.file.filename = nextState.item.source;
                nextState.file.type = nextState.value.split('[]')[2];
            }
        }
        return nextState;

    }

    onFilesError(error, file) {
        console.log('error code ' + error.code + ': ' + error.message)
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

        if (nextState.value == undefined && nextProps.value != undefined) {
            nextState = this.splitValue(nextState, nextProps);
        }

        if (nextState.file.url && nextState.item.source == "") {
            Actions.updateFormData({
                downloadURL: nextState.file.url,
                accessURL: undefined,
                fileLocation:  "upload[]" + nextState.file.filename + "[]" + nextState.file.type

            });
            nextState.item.source = nextState.item.filename;
            nextState.item.type = 'upload';
        }
    }

    onChange(event) {

        this.setState({
            value: event.target.name + '[]' + event.target.value,
            item: {
                type: event.target.name,
                source: event.target.value
            }
        });

        if (event.target.name == 'api') {
            Actions.updateFormData({accessURL: event.target.value});

        }
        else if (event.target.name == 'remote') {
            Actions.updateFormData({downloadURL: event.target.value});
        }

        this.props.onChange(event.target.name + "[]" + event.target.value);

    }

    humanReadableFormat(type) {
        let format = undefined;
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

        return format;

    }

    mediaIcon(type) {
        let icon = "";
        switch (type) {
            case 'image/gif':
            case 'image/bmp':
            case 'image/jpg':
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
                    <input type="file" disabled={ this.state.item.type != "upload" && this.state.item.source != "" ? "readOnly" : null } name="file" onChange={this.onFilesChange.bind(this)}/>
                </div>

            );
        }
    }

    render() {

        return (
            <div className="dist-upload-row">
                <ul className="nav nav-tabs" role="tablist" id="dist-upload-tabs">
                    <li role="presentation"  className={this.state.item.type == "upload" ? "active" : null}><a href="#upload" aria-controls="upload" role="tab" data-toggle="tab">File Upload</a></li>
                    <li role="presentation" className={this.state.item.type == "api" ? "active" : null}><a href="#api" aria-controls="api" role="tab" data-toggle="tab">API or Website</a></li>
                    <li role="presentation" className={this.state.item.type == "remote" ? "active" : null}><a href="#remote" aria-controls="remote" role="tab" data-toggle="tab">Remote File</a></li>
                </ul>

                <div className="tab-content">
                    <div role="tabpanel" className={this.state.item.type == "upload" ? "active tab-pane" : "tab-pane"} id="upload">
                        <br />
                        {this.fileView()}
                    </div>
                    <div role="tabpanel" className={this.state.item.type == "api" ? "active tab-pane" : "tab-pane"} id="api">
                        <br />
                            <input name="api" readOnly={ this.state.item.type != "api" && this.state.item.source != "" ? "readOnly" : null } onChange={this.onChange.bind(this)} type="text" className="form-control" placeholder="http://example.com/api"></input>
                    </div>
                    <div role="tabpanel" className={this.state.item.type == "remote" ? "active tab-pane" : "tab-pane"} id="remote">
                        <br />
                            <input name="remote" readOnly={ this.state.item.type != "remote" && this.state.item.source != "" ? "readOnly" : null } value={this.state.item.type == "remote" ? this.state.item.source : ""} onChange={this.onChange.bind(this)} type="text" className="form-control" placeholder="http://example.com/filename.csv"></input>

                    </div>
                </div>
            </div>
      );
    }
}

DistUpload.propTypes = propTypes;


module.exports = DistUpload;
