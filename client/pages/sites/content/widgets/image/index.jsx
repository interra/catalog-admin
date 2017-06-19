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

class Image extends React.Component {

    constructor(props) {
        super(props);

        this.state = Store.getState();

    }

    removeFile(event) {
        let state = Store.getState();
        state.value = undefined ;
        state.file = {};
        this.setState(state);

        this.props.onChange(undefined);
    }

    onFilesChange(event) {
        let file = event.target.files[0];

        let siteId = window.location.pathname.split('/')[2];

        DistActions.submitFile(siteId, file);
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

        if (nextProps.value) {
            nextState.value = nextProps.value;
        }

        if (nextState.file.url && !nextState.value) {
            this.props.onChange(nextState.file.url);
            nextState.value = nextState.file.url;
            nextState.file = {};
        }
    }

    fileView() {

        if (this.state.file.loading == true && this.state.file.hydrated == false) {
            return(
                <div className="file-handler">
                    <i className="fa fa-spinner fa-spin"></i>
                </div>

            );
        }

        else if (this.state.value) {
            return (
                <div className="file-handler">
                    <div className="file-preview">
                        <img src={ this.state.value } alt="image preview"/>
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

        return (
            <div className="image-row">
                <br />
                {this.fileView()}
            </div>
      );
    }
}

Image.propTypes = propTypes;


module.exports = Image;
