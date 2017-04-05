'use strict';
const Async = require('async');
const Bcrypt = require('bcrypt');
const Joi = require('joi');
const MongoModels = require('mongo-models');
const Uuid = require('node-uuid');
const fs = require('fs');

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
  }

  collections(callback) {
    const config = this.getConfig(function (err, data) {
      if (err) {
        return callback(err);
      }
      return callback(data);
    });

    // look through yml
    //


  }

  collection(collection, callback) {

  }

  getConfig(callback) {
    const dir = "./schemas/" + this.name;
    const configFile = dir + "/config.yml";
    fs.readFile(dir, function (err, data) {

      if (err) {
        return callback(err);
      }

      return callback(data);

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
