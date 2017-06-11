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
const Store = require('./store');

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

        // This would be a prop once everything is wired.
        this.state.editedformData = props.formData;
        this.state.schema = props.schema.schema;

    }

    componentWillUpdate(nextProps, nextState) {

        if (nextProps.schema.requested == true && nextProps.schema.loading == false) {

            // Passing formData from children. "There's got to be a better way".
            for (var key in nextProps.formData) {
                // Ignore the defaults.
                if (key !== 'title' && key != 'identifier')
                nextState.formData[key] = nextProps.formData[key];
            }
        }


    }
    onStoreChange() {

        this.setState(Store.getState());

    }

    componentWillReceiveProps(nextProps) {

        // Don't pass the formData until we have a schema.
        if (nextProps.schema.requested == true && nextProps.schema.loading == false) {

            this.state.schema = nextProps.schema.schema;
        }
    }

    handleSubmit(data) {

        // TODO: Add to state.
        let collection = window.location.pathname.split('/')[3];

        event.preventDefault();
        event.stopPropagation();

        if (this.props.content.proc == "new") {
            Actions.saveContent(this.props.site.slug, collection, this.state.formData);

        }
        else {
            Actions.updateContent(this.props.site.slug, collection, this.state.formData.identifier, this.state.formData);
        }

    }

    componentDidMount() {
        // This is horrible but I am sick of looking at the descriptions and don't want to open up templates yet.
        setTimeout(function () {
          $('[data-toggle="popover"]').popover();
        }, 400);
    }

    onChange (event) {

        this.setState({
            formData: event.formData
        });

    };

    render() {

        const widgets = {
            referenced: Referenced,
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
        console.log("ultimately the form data", this.state.formData);

        return (

          <Form schema={this.state.schema}
            uiSchema={this.props.schema.uiSchema}
            formData={this.state.formData}
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
