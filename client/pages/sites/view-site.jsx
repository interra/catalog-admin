'use strict';
const Moment = require('moment');
const React = require('react');
const ReactRouter = require('react-router');
const Actions = require('./actions');
const Store = require('./store');

const Link = ReactRouter.Link;
const Sites = (props) => {
    var sites = [];
    for (var i = 0; i < props.sites.sites.length; i++) {
        var site =  props.sites.sites[i];
        var extras = { };
        extras.href = '/sites/' + site._id;
        sites.push(<div key={i} className ="site-row"><a href="/site/"{... extras}><h3 className='title' key={i}>{site.name}</h3></a><div className="desc">{site.description}</div></div>);
    }
    return <div>{sites}</div>;
}

class ViewSite extends React.Component {
    constructor(props) {

        super(props);

        Actions.getSites();
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
            <section className="section-home container">
                <div className="row">
                    <h1>This awesome site</h1>
                    <Sites sites={this.state.sites}/>
                </div>
            </section>
        );
    }
}


module.exports = ViewSite;
