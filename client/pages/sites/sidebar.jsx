'use strict';
const React = require('react');
const ReactRouter = require('react-router');
const ClassNames = require('classnames');


const Link = ReactRouter.Link;
const propTypes = {
    name: React.PropTypes.string,
    location: React.PropTypes.object
};


class Sidebar extends React.Component {
    constructor(props) {

        super(props);

        this.state = {
            sidebarOpen: false,
            name: ""
        };
    }

    componentWillReceiveProps() {

        this.setState({ sidebarOpen: false });
    }

    isPathActive(path) {

        return ClassNames({
            active: this.props.location.pathname === path
        });
    }

    toggleMenu() {

        this.setState({ sidebarOpen: !this.state.sidebarOpen });
    }

    render() {

        const sidebarCollapse = ClassNames({
            'navbar-collapse': true,
            collapse: !this.state.sidebarOpen
        });

        return (
            <div className="sidebar">
                  <h4>Hello {this.props.name}</h4>
                    <div className="sidebar-header">
                        <button
                            className="sidebar-toggle collapsed"
                            onClick={this.toggleMenu.bind(this)}>

                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                    </div>
                    <div className={sidebarCollapse}>
                        <ul className="nav navbar-nav">
                            <li className={this.isPathActive('/sites')}>
                                <a href="/account">Dashboard</a>
                            </li>
                            <li className={this.isPathActive('/sites/content')}>
                                <a href="/account/settings">Content</a>
                            </li>
                            <li className={this.isPathActive('/sites/:id/edit')}>
                                <a href="/account/settings">Settings</a>
                            </li>
                        </ul>
                    </div>
            </div>
        );
    }
}

Sidebar.propTypes = propTypes;


module.exports = Sidebar;
