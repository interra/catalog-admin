'use strict';
const Actions = require('./actions');
const Alert = require('../../../components/alert.jsx');
const Button = require('../../../components/form/button.jsx');
const ControlGroup = require('../../../components/form/control-group.jsx');
const LinkState = require('../../../helpers/link-state');
const React = require('react');
const Spinner = require('../../../components/form/spinner.jsx');
const Slug = require('slug');
const Navigatable = require('react-router-component').NavigatableMixin
const Form = require('react-jsonschema-form').default;
const Referenced = require('./widgets/referenced/index.jsx');
const DistUpload = require('./widgets/dist-upload/index.jsx');
const Image = require('./widgets/image/index.jsx');
const Store = require('./store');
const ObjectAssign = require('object-assign');

const propTypes = {
    hydrated: React.PropTypes.bool,
    loading: React.PropTypes.bool,
    showSaveSuccess: React.PropTypes.bool,
    error: React.PropTypes.string,
    proc: React.PropTypes.string,
    hasError: React.PropTypes.object,
    help: React.PropTypes.object,
    slug: React.PropTypes.string,
    name: React.PropTypes.string,
    slugSuccess: React.PropTypes.bool,
    description: React.PropTypes.string
};

class ContentForm extends React.Component {
    constructor(props) {

        super(props);

        this.state = {
            formData : {
            }
        };

    }

    onStoreChange() {

        this.setState(Store.getState());

    }

    componentWillUnmount() {
        Actions.clearData();
        this.unsubscribeStore();
    }

    handleSubmit(data) {

        // TODO: Add to state.
        let collection = window.location.pathname.split('/')[3];

        event.preventDefault();
        event.stopPropagation();

        if (this.props.content.proc == "new") {
            Actions.saveContent(this.props.site.slug, collection, data.formData);
        }
        else {
            Actions.updateContent(this.props.site.slug, collection, data.formData.identifier, data.formData);
        }

    }

    componentDidMount() {
        this.props = {};
        this.state = {};

        this.unsubscribeStore = Store.subscribe(this.onStoreChange.bind(this));

        // This is horrible but I am sick of looking at the descriptions and don't want to open up templates yet.
        setTimeout(function () {
          $('[data-toggle="popover"]').popover();
        }, 400);
    }

    onChange (event) {

        this.props.onChange(event.formData);
    };

    render() {

        const widgets = {
            referenced: Referenced,
            image: Image,
            distUpload: DistUpload
        };

        const CustomDescriptionField = ({id, description}) => {
            // This is the form description.
            if ( id == "root__description") {
                return <div id={id}>{description}</div>;
            }
            if (description) {
                return <i className="fa fa-question-circle-o fa-fw" title="" data-content={description} data-toggle="popover"></i>;
            }
            else {
                return <span></span>;
            }
        };

        const fields = {
          DescriptionField: CustomDescriptionField,
          distUpload: DistUpload

        };

        const log = (type) => console.log.bind(console, type);

        return (

          <Form schema={this.props.schema.schema}
            uiSchema={this.props.schema.uiSchema}
            formData={this.props.formData}
            onChange={this.onChange.bind(this)}
            widgets={widgets}
            fields={fields}
            onSubmit={this.handleSubmit.bind(this)}
            onError={log("errors")}
            />

        );
    }
}

ContentForm.propTypes = propTypes;


module.exports = ContentForm;
