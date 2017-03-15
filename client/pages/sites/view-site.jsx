'use strict';
const Moment = require('moment');
const React = require('react');
const ReactRouter = require('react-router');
const Actions = require('./actions');
const Store = require('./store');
const Sidebar = require('./sidebar.jsx');

const Link = ReactRouter.Link;

class ViewSite extends React.Component {
    constructor(props) {

        super(props);

        Actions.getSite(props.params.id);
        this.state = Store.getState();
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
            <section className="container site-admin">
                <div className="col-sm-2">
                    <Sidebar name={this.state.site.name} location={this.props.location} />
                </div>
              <div className="col-sm-10">
                    <div className="row">
                        <h1>Dashboard</h1>
                        <p>{this.state.site.description}</p>
                    </div>
              </div>
            </section>
        );
    }
}


module.exports = ViewSite;
