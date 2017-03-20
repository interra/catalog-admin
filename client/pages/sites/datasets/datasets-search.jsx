'use strict';
const Moment = require('moment');
const React = require('react');
const ReactRouter = require('react-router');
const Actions = require('./actions');
const Store = require('./store');
const Sidebar = require('../sidebar.jsx');

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

        let createDataset = "/sites/" + this.state.site.slug + "/datasets/new"

        return (
            <section className="container site-admin">
                <div className="col-sm-2 left">
                    <Sidebar name={this.state.site.name} id={this.props.params.id} location={this.props.location} />
                </div>
                <div className="col-sm-10 center">
                    <h1>Datasets</h1>
                    <div className="btn-group" role="group">
                        <button type="button" className="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Create New
                            <span className="caret"></span>
                        </button>
                        <ul className="dropdown-menu">
                            <li><Link to={createDataset}>Dataset</Link></li>
                            <li><a href="#">Group</a></li>
                            <li><a href="#">Page</a></li>
                        </ul>
                    </div>
                </div>
            </section>
        );
    }
}


module.exports = DatasetSearchSite;
