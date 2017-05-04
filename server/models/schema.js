'use strict';
const Async = require('async');
const Bcrypt = require('bcrypt');
const Joi = require('joi');
const MongoModels = require('mongo-models');
const Uuid = require('node-uuid');
const fs = require('fs');
const YAML = require('yamljs');


// collections listed in config.yml
// config.yml
// name:
// collections:
//   datasets
//   resources:
//     file: distribution.yml
//   organization
//
//
//
// create custom widget "referece"
// when the form is created it grabs the referenced collections for the form
// when it is saved it saves (the entire reference)
// it also adds a form for creating a new referenced collection

class Schema {

  constructor(name) {
    this.name = name;
    this.dir = "./schemas/" + name + "/";

  }

  uischema(callback) {
    const configFile = this.dir + "UISchema.yml";
    YAML.load(configFile, function (data) {
        return callback(null, data);
    });
  }

  async addId(data) {
    data.properties._id = {
      'type': 'string',
      'description': "Unique Identifier for content",
      'title': 'Identifier'
    }
    return data;
  }

  collection(collection, callback) {
      const collectionFile = this.dir + collection + ".yml";
      YAML.load(collectionFile, function (data) {
          if (data) {
            // Need to add Identifier if not specified.
            if (typeof(data.properties.identifier) === undefined) {
              data.properties._id = {
                'type': 'string',
                'description': "Unique identifier.",
                'title': 'Identifier'
              }
            }

            return callback(null, data);
          }
          else {
            return callback("Colection not found");
          }
      });
  }

  config(callback) {
      const configFile = this.dir + "config.yml";
      YAML.load(configFile, function (data) {
          return callback(null, data);
      });
  }

  list(callback) {
      fs.readdir('./schemas', function (err, data) {
           if (err) {
                return callback(err);
           }
           callback(null, data);
      });
  }
}

Schema.register = function (server, options, next) {
    next();
}

Schema.register.attributes = {
    "name": "schema"
}

module.exports = Schema;
