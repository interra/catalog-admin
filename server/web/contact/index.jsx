'use strict';
const Layout = require('../layouts/default.jsx');
const React = require('react');


class ContactPage extends React.Component {
    render() {

        const feet = <script src="/public/pages/contact.min.js"></script>;

        return (
            <Layout
                title="Contact us"
                feet={feet}
                activeTab="contact">

                <div className="row">
                    <div className="col-sm-6" id="app-mount"></div>
                    <div className="col-sm-6 text-center">
                        <h1 className="page-header">Contact Interra Data</h1>
                        <p className="lead">
                            Let us know if you have any questions or would like to contribute.
                        </p>
                    </div>
                </div>
            </Layout>
        );
    }
}


module.exports = ContactPage;
