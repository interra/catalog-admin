'use strict';
const Actions = require('./actions');
const Alert = require('../../../components/alert.jsx');
const Button = require('../../../components/form/button.jsx');
const ControlGroup = require('../../../components/form/control-group.jsx');
const LinkState = require('../../../helpers/link-state');
const React = require('react');
const Spinner = require('../../../components/form/spinner.jsx');
const TextControl = require('../../../components/form/text-control.jsx');
const TextAreaControl = require('../../../components/form/textarea-control.jsx');
const Slug = require('slug');
const Navigatable = require('react-router-component').NavigatableMixin
const Form = require('react-jsonschema-form').default;
require('./dataset-form.js');

const propTypes = {
    hydrated: React.PropTypes.bool,
    loading: React.PropTypes.bool,
    showSaveSuccess: React.PropTypes.bool,
    error: React.PropTypes.string,
    proc: React.PropTypes.string,
    hasError: React.PropTypes.object,
    help: React.PropTypes.object,
    slug: React.PropTypes.string,
    name: React.PropTypes.string,
    slugSuccess: React.PropTypes.bool,
    description: React.PropTypes.string
};

class DatasetForm extends React.Component {
    constructor(props) {

        super(props);

        this.state = {};

        // This would be a prop once everything is wired.
        this.state.editedformData = props.formData;

    }

    componentWillUpdate(nextProps, nextState) {
      console.log("componentWillUpdate");

      if (this.props.dataset.proc == "new") {

        // Sets slug for ID field from name field.
//        if (nextState.dataset.name != this.state.dataset.name) {
//          nextState.dataset.slug = Slug(nextState.dataset.name).toLowerCase();
//        }

        // Slugifies direct editing of the slug field.
  //      if (nextState.dataset.slug != this.state.dataset.slug) {
  //        nextState.dataset.slug = Slug(nextState.dataset.slug).toLowerCase();
    //    }
      }

    }

    componentWillReceiveProps(nextProps) {
      console.log("componentWillReceiveProps");

    }

    handleSubmit(event) {

        event.preventDefault();
        event.stopPropagation();

        if (this.props.dataset.proc == "new") {
            // This would stay but only with full dataset.
            Actions.saveDataset(this.props.site.slug, {
                _id: this.state.dataset.slug,
                name: this.state.dataset.name,
                users: [this.props.user.id],
                description: this.state.dataset.description
            });

        }
        else {
            Actions.updateDataset(this.props.site.slug, this.state.dataset.slug, {
              name: this.state.dataset.name,
              users: [this.props.user.id],
              description: this.state.dataset.description
            })

        }

    }

    onChange (data) {
      console.log('event', event);

      console.log(data);

      this.setState({"formData": data.formData});

//       data.formData.description = data.formData.title;

console.log("THIS STATE", this.state.formData);

     };



    render() {
      const schema = {
  "$schema": "http://json-schema.org/draft-04/schema#",
  "id": "https://project-open-data.cio.gov/v1.1/schema/dataset.json#",
  "title": "Project Open Data Dataset",
  "description": "The metadata format for all federal open data. Validates a single JSON object entry (as opposed to entire Data.json catalog).",
  "type": "object",
  "required": [
    "bureauCode",
    "programCode",
    "title",
    "description",
    "keyword",
    "modified",
    "publisher",
    "contactPoint",
    "identifier",
    "accessLevel"
  ],
  "properties": {
    "@type": {
      "title": "Metadata Context",
      "description": "IRI for the JSON-LD data type. This should be dcat:Dataset for each Dataset",
      "type": "string",
      "enum": [
        "dcat:Dataset"
      ]
    },
    "accessLevel": {
      "description": "The degree to which this dataset could be made publicly-available, regardless of whether it has been made available. Choices: public (Data asset is or could be made publicly available to all without restrictions), restricted public (Data asset is available under certain use restrictions), or non-public (Data asset is not available to members of the public)",
      "title": "Public Access Level",
      "type": "string",
      "enum": [
        "public",
        "restricted public",
        "non-public"
      ]
    },
    "rights": {
      "title": "Rights",
      "description": "This may include information regarding access or restrictions based on privacy, security, or other policies. This should also provide an explanation for the selected \"accessLevel\" including instructions for how to access a restricted file, if applicable, or explanation for why a \"non-public\" or \"restricted public\" data assetis not \"public,\" if applicable. Text, 255 characters.",
      "type": "string",
      "anyOf": [
        {
          "type": "string",
          "minLength": 1,
          "maxLength": 255
        },
        {
          "type": "null"
        }
      ]
    },
    "accrualPeriodicity": {
      "title": "Frequency",
      "description": "Frequency with which dataset is published.",
      "type": "string",
      "anyOf": [
        {
          "enum": [
            "irregular"
          ]
        },
        {
          "type": "string",
          "pattern": "^R\\/P(?:\\d+(?:\\.\\d+)?Y)?(?:\\d+(?:\\.\\d+)?M)?(?:\\d+(?:\\.\\d+)?W)?(?:\\d+(?:\\.\\d+)?D)?(?:T(?:\\d+(?:\\.\\d+)?H)?(?:\\d+(?:\\.\\d+)?M)?(?:\\d+(?:\\.\\d+)?S)?)?$"
        },
        {
          "type": "null"
        },
        {
          "type": "string",
          "pattern": "^(\\[\\[REDACTED).*?(\\]\\])$"
        }
      ]
    },
    "bureauCode": {
      "title": "Bureau Code",
      "description": "Federal agencies, combined agency and bureau code from <a href='http://www.whitehouse.gov/sites/default/files/omb/assets/a11_current_year/app_c.pdf'>OMB Circular A-11, Appendix C</a> in the format of <code>015:010</code>.",
      "type": "array",
      "items": {
        "type": "string",
        "pattern": "[0-9]{3}:[0-9]{2}"
      },
      "minItems": 1,
      "uniqueItems": true
    },
//    "contactPoint": {
//      "$ref": "vcard.json"
//    },
    "describedBy": {
      "title": "Data Dictionary",
      "description": "URL to the data dictionary for the dataset or API. Note that documentation other than a data dictionary can be referenced using Related Documents as shown in the expanded fields.",
      "type": "string",
      "format": "uri"
    },
    "describedByType": {
      "title": "Data Dictionary Type",
      "description": "The machine-readable file format (IANA Media Type or MIME Type) of the distribution’s describedBy URL",
      "type": "string",
      "anyOf": [
        {
          "pattern": "^[-\\w]+/[-\\w]+(\\.[-\\w]+)*([+][-\\w]+)?$",
          "type": "string"
        },
        {
          "type": "null"
        },
        {
          "type": "string",
          "pattern": "^(\\[\\[REDACTED).*?(\\]\\])$"
        }
      ]
    },
    "conformsTo": {
      "title": "Data Standard",
      "description": "URI used to identify a standardized specification the dataset conforms to",
      "type": "string",
      "format": "uri"

    },
    "dataQuality": {
      "title": "Data Quality",
      "description": "Whether the dataset meets the agency’s Information Quality Guidelines (true/false).",
      "type": "boolean",
      "anyOf": [
        {
          "type": "boolean"
        },
        {
          "type": "null"
        },
        {
          "type": "string",
          "pattern": "^(\\[\\[REDACTED).*?(\\]\\])$"
        }
      ]
    },
    "description": {
      "title": "Description",
      "description": "Human-readable description (e.g., an abstract) with sufficient detail to enable a user to quickly understand whether the asset is of interest.",
      "type": "string",
      "minLength": 1
    },
    "distribution": {
      "title": "Distribution",
      "description": "A container for the array of Distribution objects",
      "type": "array",
      "items": {
//          "$ref": "distribution.json",
        "minItems": 1,
        "uniqueItems": true
      }

    },
    "identifier": {
      "title": "Unique Identifier",
      "description": "A unique identifier for the dataset or API as maintained within an Agency catalog or database.",
      "type": "string",
      "minLength": 1
    },
    "issued": {
      "title": "Release Date",
      "description": "Date of formal issuance.",
      "type": "string",
      "format": "date-time",
      "pattern": "^([\\+-]?\\d{4}(?!\\d{2}\\b))((-?)((0[1-9]|1[0-2])(\\3([12]\\d|0[1-9]|3[01]))?|W([0-4]\\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\\d|[12]\\d{2}|3([0-5]\\d|6[1-6])))([T\\s]((([01]\\d|2[0-3])((:?)[0-5]\\d)?|24\\:?00)([\\.,]\\d+(?!:))?)?(\\17[0-5]\\d([\\.,]\\d+)?)?([zZ]|([\\+-])([01]\\d|2[0-3]):?([0-5]\\d)?)?)?)?$"
    },
    "keyword": {
      "title": "Tags",
      "description": "Tags (or keywords) help users discover your dataset; please include terms that would be used by technical and non-technical users.",
      "type": "array",
      "items": {
        "type": "string",
        "minLength": 1
      },
      "minItems": 1
    },
    "landingPage": {
      "title": "Homepage URL",
      "description": "Alternative landing page used to redirect user to a contextual, Agency-hosted “homepage” for the Dataset or API when selecting this resource from the Data.gov user interface.",
      "type": "string",
      "format": "uri"
    },
    "language": {
      "title": "Language",
      "description": "The language of the dataset.",
      "type": "array",
      "items": {
        "type": "string",
        "pattern": "^(((([A-Za-z]{2,3}(-([A-Za-z]{3}(-[A-Za-z]{3}){0,2}))?)|[A-Za-z]{4}|[A-Za-z]{5,8})(-([A-Za-z]{4}))?(-([A-Za-z]{2}|[0-9]{3}))?(-([A-Za-z0-9]{5,8}|[0-9][A-Za-z0-9]{3}))*(-([0-9A-WY-Za-wy-z](-[A-Za-z0-9]{2,8})+))*(-(x(-[A-Za-z0-9]{1,8})+))?)|(x(-[A-Za-z0-9]{1,8})+)|((en-GB-oed|i-ami|i-bnn|i-default|i-enochian|i-hak|i-klingon|i-lux|i-mingo|i-navajo|i-pwn|i-tao|i-tay|i-tsu|sgn-BE-FR|sgn-BE-NL|sgn-CH-DE)|(art-lojban|cel-gaulish|no-bok|no-nyn|zh-guoyu|zh-hakka|zh-min|zh-min-nan|zh-xiang)))$"
      }
    },
    "license": {
      "title": "License",
      "description": "The license dataset or API is published with. See <a href=\"https://project-open-data.cio.gov/open-licenses/\">Open Licenses</a> for more information.",
      "type": "string",
      "format": "uri"
    },
    "modified": {
      "title": "Last Update",
      "description": "Most recent date on which the dataset was changed, updated or modified.",
      "type": "string",
      "format": "date-time",
      "pattern": "^([\\+-]?\\d{4}(?!\\d{2}\\b))((-?)((0[1-9]|1[0-2])(\\3([12]\\d|0[1-9]|3[01]))?|W([0-4]\\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\\d|[12]\\d{2}|3([0-5]\\d|6[1-6])))([T\\s]((([01]\\d|2[0-3])((:?)[0-5]\\d)?|24\\:?00)([\\.,]\\d+(?!:))?)?(\\17[0-5]\\d([\\.,]\\d+)?)?([zZ]|([\\+-])([01]\\d|2[0-3]):?([0-5]\\d)?)?)?)?$"
    },
    "primaryITInvestmentUII": {
      "title": "Primary IT Investment UII",
      "description": "For linking a dataset with an IT Unique Investment Identifier (UII)",
      "type": "string",
      "pattern": "[0-9]{3}-[0-9]{9}"
    },
    "programCode": {
      "title": "Program Code",
      "description": "Federal agencies, list the primary program related to this data asset, from the <a href=\"http://goals.performance.gov/sites/default/files/images/FederalProgramInventory_FY13_MachineReadable_091613.xls\">Federal Program Inventory</a>. Use the format of <code>015:001</code>",
      "type": "array",
      "items": {
        "type": "string",
        "pattern": "[0-9]{3}:[0-9]{3}"
      },
      "minItems": 1,
      "uniqueItems": true
    },
    "publisher": {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "id": "https://project-open-data.cio.gov/v1.1/schema/organization.json#",
        "title": "Project Open Data Organization",
        "description": "A Dataset Publisher Organization as a foaf:Agent object",
        "type": "object",
        "required": [
          "name"
        ],
        "properties": {
          "@type": {
            "title": "Metadata Context",
            "type": "string",
            "description": "IRI for the JSON-LD data type. This should be org:Organization for each publisher",
            "enum": [
              "org:Organization"
            ]
          },
          "name": {
            "title": "Publisher Name",
            "description": "A full formatted name, eg Firstname Lastname",
            "type": "string",
            "minLength": 1
          },
          "subOrganizationOf": {
            "title": "Parent Organization",
            "type": "string"
          }
        }
    },
    "references": {
      "title": "Related Documents",
      "description": "Related documents such as technical information about a dataset, developer documentation, etc.",
      "type": "array",
      "items": {
            "type": "string",
            "format": "uri"
      },
      "minItems": 1,
      "uniqueItems": true
    },
    "spatial": {
      "title": "Spatial",
      "description": "The range of spatial applicability of a dataset. Could include a spatial region like a bounding box or a named place.",
      "type": "string",
      "minLength": 1
    },
    "systemOfRecords": {
      "title": "System of Records",
      "description": "If the systems is designated as a system of records under the Privacy Act of 1974, provide the URL to the System of Records Notice related to this dataset.",
      "type": "string",
      "minLength": 1
    },
    "temporal": {
      "title": "Temporal",
      "description": "The range of temporal applicability of a dataset (i.e., a start and end date of applicability for the data).",
      "type": "string",
      "pattern": "^([\\+-]?\\d{4}(?!\\d{2}\\b))((-?)((0[1-9]|1[0-2])(\\3([12]\\d|0[1-9]|3[01]))?|W([0-4]\\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\\d|[12]\\d{2}|3([0-5]\\d|6[1-6])))([T\\s]((([01]\\d|2[0-3])((:?)[0-5]\\d)?|24\\:?00)([\\.,]\\d+(?!:))?)?(\\17[0-5]\\d([\\.,]\\d+)?)?([zZ]|([\\+-])([01]\\d|2[0-3]):?([0-5]\\d)?)?)?)?(\\/)([\\+-]?\\d{4}(?!\\d{2}\\b))((-?)((0[1-9]|1[0-2])(\\3([12]\\d|0[1-9]|3[01]))?|W([0-4]\\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\\d|[12]\\d{2}|3([0-5]\\d|6[1-6])))([T\\s]((([01]\\d|2[0-3])((:?)[0-5]\\d)?|24\\:?00)([\\.,]\\d+(?!:))?)?(\\17[0-5]\\d([\\.,]\\d+)?)?([zZ]|([\\+-])([01]\\d|2[0-3]):?([0-5]\\d)?)?)?)?$"
    },
    "isPartOf": {
      "title": "Collection",
      "description": "The collection of which the dataset is a subset",
      "type": "string",
      "minLength": 1
    },
    "theme": {
      "title": "Category",
      "description": "Main thematic category of the dataset.",
      "type": "array",
      "items": {
        "type": "string",
        "minLength": 1
      },
      "minItems": 1,
      "uniqueItems": true
    },
    "title": {
      "title": "Title",
      "description": "Human-readable name of the asset. Should be in plain English and include sufficient detail to facilitate search and discovery.",
      "type": "string",
      "minLength": 1
    }
  }
};
      const uiSchema = {
        "description": {
          "ui:widget": "textarea"
        }

      }




        const log = (type) => console.log.bind(console, type);
        console.log(schema);

        return (
          <Form schema={schema}
            uiSchema={uiSchema}
            formData={this.state.formData}
            onChange={this.onChange.bind(this)}
            onSubmit={log("submitted")}
            onError={log("errors")} />

        );
    }
}

DatasetForm.propTypes = propTypes;


module.exports = DatasetForm;
