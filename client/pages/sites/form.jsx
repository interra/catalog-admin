'use strict';
const React = require('react');
const Actions = require('./actions');
const Store = require('./store');
const Slug = require('slug');

const propTypes = {
  slug: React.PropTypes.string
}

class Form extends React.Component {
    constructor(props) {

        super(props);

        this.state = {
          slug: props.name,
          slugSuccess: ""
        }
    }

    slug(e) {
      this.setState({slug: Slug(e.target.value).toLowerCase()});
    }

    render() {

        return (
            <section className="section-form container">
                <div className="row">
                    <h1>Create Site</h1>
                    <form>
                        <div className="form-group">
                            <label for="inputName">Name</label>
                            <input name="name" type="text" className="form-control" aria-describedby="nameHelp" placeholder="Enter a site name" onChange={this.slug.bind(this)}></input>
                            <small id="nameHelp" className="form-text text-muted">This should be the name of the site, eg "City of Philadelphia".</small>
                        </div>
                        <div className="form-group {this.state.slugSuccess}">
                            <label for="slug">Site ID</label>
                            <input type="text" className="form-control form-control-success" aria-describedby="idHelp" value={this.state.slug} />
                            <small id="idHelp" className="form-text text-muted">This must be unique.</small>
                        </div>
                        <div className="form-group">
                            <label for="inputDescription">Description</label>
                            <textarea className="form-control" rows="5"></textarea>
                        </div>
                    </form>
                </div>
            </section>
        );
    }
}


module.exports = Form;
