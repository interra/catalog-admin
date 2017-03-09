'use strict';
const Code = require('code');
const Config = require('../../../config');
const Lab = require('lab');
const Site = require('../../../server/models/site');


const lab = exports.lab = Lab.script();
const mongoUri = Config.get('/hapiMongoModels/mongodb/uri');
const mongoOptions = Config.get('/hapiMongoModels/mongodb/options');


lab.experiment('Site Class Methods', () => {

    lab.before((done) => {

        Site.connect(mongoUri, mongoOptions, (err, db) => {

            done(err);
        });
    });


    lab.after((done) => {

        Site.deleteMany({}, (err, count) => {

            Site.disconnect();

            done(err);
        });
    });


    lab.test('it returns a new instance when create succeeds', (done) => {

        Site.create('slugabug', 'Test Dataset', 'You must describe to survive.', ['mockuserid'], (err, result) => {

            Code.expect(err).to.not.exist();
            Code.expect(result).to.be.an.instanceOf(Site);

            done();
        });
    });


    lab.test('it returns an error when create fails', (done) => {

        const realInsertOne = Site.insertOne;
        Site.insertOne = function () {

            const args = Array.prototype.slice.call(arguments);
            const callback = args.pop();

            callback(Error('insert failed'));
        };

        Site.create('slugabug', 'Test Dataset', 'You must describe to survive.', ['mockuserid'], (err, result) => {

            Code.expect(err).to.be.an.object();
            Code.expect(result).to.not.exist();

            Site.insertOne = realInsertOne;

            done();
        });
    });
});
