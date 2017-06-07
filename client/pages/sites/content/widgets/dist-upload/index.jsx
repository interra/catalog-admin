'use strict';
const Actions = require('../../actions.js');
const React = require('react');
const Navigatable = require('react-router-component').NavigatableMixin
const Form = require('react-jsonschema-form').default;
const Store = require('../../store');

const propTypes = {
    hydrated: React.PropTypes.bool,
    loading: React.PropTypes.bool,
    error: React.PropTypes.string,
    hasError: React.PropTypes.object,
    help: React.PropTypes.object,
    titles: React.PropTypes.array
};

class DistUpload extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            distUpload: {
                upload: "",
                api: "",
                remote: ""
            }
        }

    }

    resetState(key, value) {
        let state = {
                distUpload: {
                upload: "",
                api: "",
                remote: ""
            }
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

    onChange(event) {

        console.log("FINDING IT HARD TO BELIVE", event);
        console.log("FINDING IT HARD 2", event.target);
        console.log("FINDING IT HARD 3", event.target.value);
//        const name = event.target.name;
//        this.setState( [name] :{value: event.target.value});

        const newState = this.resetState(event.target.name, event.target.value);
        console.log("here is the newness", newState);

        this.setState(newState);
        Actions.updateFormData({accessURL: event.target.value});
//        Actions.getContent("test-this-make-it-work");

//        this.props.onChange(value: event.target.value);
//        this.setState({});
        console.log(this);
    }

    options(titles) {

    }

    render() {
        console.log(this.state);


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
                            <input name="upload" value={this.state.distUpload.upload} onChange={this.onChange.bind(this)} className="form-control" type="file"></input>
                    </div>
                    <div role="tabpanel" className="tab-pane" id="api">
                        <br />
                            <input name="api" value={this.state.distUpload.api} onChange={this.onChange.bind(this)} type="text" className="form-control" placeholder="http://example.com/api"></input>
                    </div>
                    <div role="tabpanel" className="tab-pane" id="remote">
                        <br />
                            <input name="remote" value={this.state.distUpload.remote} onChange={this.onChange.bind(this)} type="text" className="form-control" placeholder="http://example.com/filename.csv"></input>

                    </div>
                </div>
            </div>
      );
    }
}

DistUpload.propTypes = propTypes;


module.exports = DistUpload;
