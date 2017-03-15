'use strict';
const Actions = require('./actions');
const React = require('react');
const Store = require('./store');
const SitesForm = require('./sites-form.jsx');

class CreateSite extends React.Component {
    constructor(props) {

        super(props);

        this.state = {};
        this.state.site = {
          // We are loading the form from scratch so no data lookup.
          hydrated: true,
          loading: false,
          showSaveSuccess: false,
          error: undefined,
          hasError: {},
          help: {},
        }
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

    render() {

        return (
            <section className="container">
                <h1 className="page-header">Create Site</h1>
                <div className="row">
                    <div className="col-sm-6">
                        <SitesForm {...this.state.site} />
                    </div>
                </div>
            </section>
        );
    }
}


module.exports = CreateSite;
