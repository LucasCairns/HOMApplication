// Includes

var express = require('express');
var mongodb = require('mongodb').MongoClient;
var func = require('./functions');

// Database URL

var url = 'mongodb://localhost:27017/HOMApplication';

// Declare router object

var applicationRouter = express.Router();

function databaseFindMany(databaseUrl, collectionName, query, projection, callback) {
    //Connect to database
    mongodb.connect(databaseUrl, function (err, db) {
        if (!err) { // Check for an error connecting to the database
            var collection = db.collection(collectionName); // Access collection
            collection.find(query, projection).toArray( // Query collection
                function (err, results) {
                    if (!err) {
                        db.close();
                        callback(results);
                    } else {
                        // Display error page if unable to access collection
                        func.errorPage(res, 500, 'Error accessing collection', err);
                        db.close();
                    }
                });
        } else {
            // Display error page if unable to access database
            func.errorPage(res, 500, 'Unable to connect to database', err);
        }
    }); 
}

function databaseFindOne(databaseUrl, collectionName, query, projection, callback) {
    //Connect to database
    mongodb.connect(databaseUrl, function (err, db) {
        if (!err) { // Check for an error connecting to the database
            var collection = db.collection(collectionName); // Access collection
            collection.findOne(query, projection, // Query collection
                function (err, result) {
                    if (!err) {
                        db.close();
                        callback(result);
                    } else {
                        // Display error page if unable to access collection
                        func.errorPage(res, 500, 'Error accessing collection', err);
                        db.close();
                    }
                });
        } else {
            // Display error page if unable to access database
            func.errorPage(res, 500, 'Unable to connect to database', err);
        }
    });
}

function jsonToArray(json, tag) {
    var array = [];
    for (var i in json) {
        array.push(json[i][tag]);
    }
    console.write(array);
    return array;
}

var router = function () {

// Route for homepage

        applicationRouter.route('/')
            .get(function (req, res) {
                // Grab JobId from request url
                var JobId = req.query.JobId;
                // Initilize database query
                var query = {};
                var projection = {};

                // Check for query param
                if (JobId) {
                    // Set query based on param and add to query
                    query.ID = new RegExp(JobId, 'i');
                    var FilterText = 'using filter Job ID contains "' + JobId +'"';
                }

                databaseFindMany(url, 'jobs', query, projection, function (results) {
                    res.render('index', {
                        pageTitle: 'Job Search',
                        siteMap: func.createSiteMap(req),
                        JobId: JobId,
                        jobs: results,
                        FilterText: FilterText 
                    });
                });
            });

        // Route for applicant list

        applicationRouter.route('/applicants/:JobId')
            .get(function (req, res) {
                // Grab appId from request url
                var JobId = req.params.JobId.replace(/\-/g, '/');
                var AppId = req.query.AppId;
                var AppSurname = req.query.AppSurname;

                var JobQuery = { ID: JobId };
                var JobProjection = {};

                databaseFindOne(url, 'jobs', JobQuery, JobProjection, function (JobResults) {

                    var AppQuery = { Applications: { $elemMatch: { JobId: JobId} } };

                    if (AppId || AppSurname) {

                        var FilterText = 'using filter '; 

                        if (AppId) {
                            AppQuery.ID = new RegExp(AppId, 'i');
                            FilterText += 'ID contains ' + AppId + '"';
                        };

                        if (AppSurname) {
                            AppQuery.Surname = new RegExp(AppSurname, 'i');
                            if (AppId) {
                                FilterText += ' and ';
                            }
                            FilterText += 'Surname contains "' + AppSurname + '"';
                        };
                    }

                    var AppProjection = { ID: true, Name: true, Surname: true };

                    databaseFindMany(url, 'applicants', AppQuery, AppProjection, function (AppResults) {
                        res.render('applicants', {
                            pageTitle: 'Applicant Search',
                            siteMap: func.createSiteMap(req),
                            AppId: AppId,
                            AppSurname: AppSurname,
                            JobId: JobResults.ID,
                            JobTitle: JobResults.Title,
                            Applicants: AppResults,
                            FilterText: FilterText,
                            FilterAppId: req.query.AppId,
                            FilterAppSurname: req.query.Surname
                        });
                    });
                });
            });

        // Route for applicant details

        applicationRouter.route('/applicants/:JobId/view/:AppId')
            .get(function (req, res) {
                // Grab appId from request url
                var AppId = req.params.AppId.replace(/\-/g, '/');
                var JobId = req.params.JobId.replace(/\-/g, '/');

                var JobQuery = { ID: JobId };
                var JobProjection = { ID: true, Title: true };

                databaseFindOne(url, 'jobs', JobQuery, JobProjection, function (JobResults) {

                    var AppQuery = { ID: AppId };
                    var AppProjection = {};

                    databaseFindOne(url, 'applicants', AppQuery, AppProjection, function (AppResults) {
                        res.render('applicant', {
                            pageTitle: 'Applicant Details',
                            siteMap: func.createSiteMap(req),
                            JobId: JobId,
                            AppId: AppId,
                            JobTitle: JobResults.Title,
                            Name: AppResults.Name,
                            Surname: AppResults.Surname,
                            DOB: AppResults.DOB,
                            workExperience: AppResults.Employment
                        });
                    });
                });
            });

        return applicationRouter;
};

module.exports = router;