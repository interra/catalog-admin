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

        let dashboardPath = '/sites/' + this.props.id;
        let editPath = '/sites/' + this.props.id + '/edit';
        let datasetSearchPath = '/sites/' + this.props.id + '/content';

        return (
            <div className="sidebar">
                  <div id="hello-card">
                    <small>Welcome,</small>
                    <h4>{this.props.name}</h4>
                  </div>
                  <div className={sidebarCollapse}>
                      <ul className="nav nav-sidebar">
                          <li className={this.isPathActive(dashboardPath)}>
                              <Link to={dashboardPath}><i className="fa fa-dashboard fa-fw"></i> Dashboard</Link>
                          </li>
                          <li className={this.isPathActive(datasetSearchPath)}>
                              <Link to={datasetSearchPath}><i className="fa fa-edit fa-fw"></i> Content</Link>
                          </li>
                          <li className={this.isPathActive(editPath)}>
                              <Link to={editPath}><i className="fa fa-sliders fa-fw"></i> Settings</Link>
                          </li>
                      </ul>
                </div>
            </div>
        );
    }
}

Sidebar.propTypes = propTypes;


module.exports = Sidebar;
