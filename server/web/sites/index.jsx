'use strict';
const Layout = require('../layouts/plain.jsx');
const React = require('react');


class SitesPage extends React.Component {
    render() {

        const neck = [
            <link key="layout" rel="stylesheet" href="/public/layouts/default.min.css" />,
            <link key="page" rel="stylesheet" href="/public/pages/sites.min.css" />,
            <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.0/jquery.slim.min.js"></script>,
            <script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/js/bootstrap.min.js"></script>
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
