'use strict';
const Moment = require('moment');
const React = require('react');
const ReactRouter = require('react-router');
const Actions = require('./actions');
const Store = require('./store');
const Sidebar = require('../sidebar.jsx');
const DatasetForm = require('./dataset-form.jsx');
const DeleteForm = require('../../../../client/components/admin/delete-form.jsx');

const Link = ReactRouter.Link;

class EditSite extends React.Component {
    constructor(props) {
        super(props);

        Actions.getSite(props.params.id);
        Actions.getUser();
        Actions.getContent(props.params.id, props.params.collection, props.params.contentId);
        this.state = Store.getState();
        this.state.content.redirect = false;
        this.state.content.proc = "edit";
        this.state.collectionSchema.schema = {};
        this.state.collectionSchema.requested = false;
        this.state.content.formData = {type:''};

    }
    componentDidMount() {

        this.unsubscribeStore = Store.subscribe(this.onStoreChange.bind(this));
    }

    componentWillUnmount() {
        // Don't show success alert if leaving page.
        this.state.site.showSaveSuccess = false;

        this.unsubscribeStore();
    }

    onStoreChange() {

        this.setState(Store.getState());
        if (this.state.site.hydrated && !this.state.collectionSchema.requested) {
            Actions.getCollectionSchema(this.state.site.schema,this.props.params.collection);
        }
    }

    render() {

        return (
            <section className="container site-admin">
                <div className="col-sm-2 left">
                    <Sidebar name={this.state.site.name} id={this.props.params.id} location={this.props.location} />
                </div>
                <div className="col-sm-10 center">
                    <h1>Edit {this.state.content.formData.type}</h1>
                    <DatasetForm user={this.state.user}
                        site={this.state.site}
                        formData={this.state.formData}
                        content={this.state.content}
                        schema={this.state.collectionSchema}
                        uiSchema={this.state.collectionSchema.uiSchema}
                        />
                    <DeleteForm
                        {...this.state.delete}
                        action={Actions.delete.bind(Actions, this.props.params.id)}
                    />
                </div>
            </section>
        );
    }
}


module.exports = EditSite;
