'use strict';
const Moment = require('moment');
const React = require('react');
const ReactRouter = require('react-router');
const Actions = require('./actions');
const Store = require('./store');
const Sidebar = require('./sidebar.jsx');

const Link = ReactRouter.Link;

class DatasetSearchSite extends React.Component {
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
                  <div className="col-sm-2 left">
                      <Sidebar name={this.state.site.name} id={this.props.params.id} location={this.props.location} />
                  </div>
              <div className="col-sm-10 center">
                <h1>This is a thing</h1>
              </div>
            </section>
        );
    }
}


module.exports = DatasetSearchSite;
