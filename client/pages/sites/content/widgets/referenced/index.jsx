'use strict';
const Actions = require('./actions.jsx');
const React = require('react');
const Navigatable = require('react-router-component').NavigatableMixin
const Form = require('react-jsonschema-form').default;
const Store = require('./store');

const propTypes = {
    hydrated: React.PropTypes.bool,
    loading: React.PropTypes.bool,
    error: React.PropTypes.string,
    hasError: React.PropTypes.object,
    help: React.PropTypes.object,
    titles: React.PropTypes.array
};

class Referenced extends React.Component {
    constructor(props) {

        super(props);
        // I'm ashamed.
        let siteId = window.location.pathname.split('/')[2];

        Actions.getTitles(siteId, props.options.collection)

        this.state = {
            value: props.value,
            titles: {
                titles: []
            }
        };
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

        this.props.onChange(event.target.value);
        this.setState({value: event.target.value});

    }

    options(titles) {

    }

    render() {

        const createItem = (item, key) =>
            <option
                key={key}
                value={item.identifier}
             >
             {item.title}
        </option>;
        return (
            <select className="form-control"
                ref={(c) => (this.input = c)}
                multiple={this.props.multiple}
                value={this.state.value}
                onChange={this.onChange.bind(this)}>

                {this.state.titles.titles.map(createItem)}
            </select>
      );
    }
}

Referenced.propTypes = propTypes;


module.exports = Referenced;
