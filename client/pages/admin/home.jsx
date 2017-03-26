'use strict';
const React = require('react');
const Moment = require('moment');


class HomePage extends React.Component {
    constructor(props) {

        super(props);

    }



    render() {

        return (
            <section className="section-home container">
                <div className="row">
                    <div className="col-sm-7">
                        <h1 className="page-header">Admin</h1>
                        <p>Welcome. As an Admin you have great power.</p>
                    </div>
                </div>
            </section>
        );
    }
}


module.exports = HomePage;
