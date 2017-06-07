'use strict';
const React = require('react');
const ReactRouter = require('react-router');


const Link = ReactRouter.Link;
const propTypes = {
    data: React.PropTypes.array
};


class Results extends React.Component {

    render() {

        let mapping = this.props.map.data.vcard;

        // Replace keys defined in the schema with those that are required via
        // map.yml definition.
        const v = o => Object.assign(...Object.keys(o).map(k => ({ [mapping[k] || k]: o[k] })));

        const rows = this.props.data.map((item) => {

            let record = {};
            if (mapping) {
                record = v(item)
            }
            else {
                record = item;
            }

            return (
                <tr key={record.identifier}>
                    <td>
                        <Link
                            className="btn btn-default btn-sm"
                            to={`/sites/${record.siteId}/${record.type}/${record.identifier}/edit`}>

                            Edit
                        </Link>
                    </td>
                    <td>{record.title}</td>
                    <td>{record.type}</td>
                    <td className="nowrap">{record.identifier}</td>
                </tr>
            );
        });

        return (
            <div className="table-responsive">
                <table className="table table-striped table-results">
                    <thead>
                        <tr>
                            <th></th>
                            <th className="stretch">title</th>
                            <th>type</th>
                            <th>identifier</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
            </div>
        );
    }
}

Results.propTypes = propTypes;


module.exports = Results;
