'use strict';
const Moment = require('moment');
const React = require('react');
const ReactRouter = require('react-router');
const Actions = require('./actions');
const Store = require('./store');
const Sidebar = require('./sidebar.jsx');
const SitesForm = require('./sites-form.jsx');
const DeleteForm = require('../../../client/components/admin/delete-form.jsx');

const Link = ReactRouter.Link;

class EditSite extends React.Component {
    constructor(props) {
        super(props);

        Actions.getSite(props.params.id);
        Actions.getUser();
        this.state = Store.getState();
        this.state.site.redirect = false;
        this.state.site.proc = "edit";
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
    }

    render() {

        return (
            <section className="container site-admin">
                <div className="col-sm-2 left">
                    <Sidebar name={this.state.site.name} id={this.props.params.id} location={this.props.location} />
                </div>
                <div className="col-sm-10 center">
                    <h1>Edit Site</h1>
                    <SitesForm user={this.state.user} {...this.state.site} />
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
