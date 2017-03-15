'use strict';
const Layout = require('../layouts/plain.jsx');
const React = require('react');


class SitesPage extends React.Component {
    render() {

        const neck = [
            <link key="layout" rel="stylesheet" href="/public/layouts/default.min.css" />,
            <link key="page" rel="stylesheet" href="/public/pages/sites.min.css" />
        ];
        const feet = <script src="/public/pages/sites.min.js"></script>;

        return (
            <Layout
                title="Sites"
                neck={neck}
                feet={feet}>

                <div id="app-mount"></div>
            </Layout>
        );
    }
}


module.exports = SitesPage;
