// Includes
var express = require('express');
var func = require('./functions');
var config = require('../config.json');

// Declare router object

var applicationRouter = express.Router();

var router = function () {

    // Collection names from config
    var colJobs = config.databaseJobCollection;
    var colApplicants = config.databaseApplicantCollection;

        // Route for homepage
        applicationRouter.route('/')
            .get(function (req, res) {

                // Grab JobId from request url
                var jobId = req.query.JobId;

                // Initilize database query
                var query = {};
                var projection = {};

                // If filters used, add to the query string and construct filter text to be displayed on the page
                if (jobId) {
                    query.ID = new RegExp(jobId, 'i');
                    var filterText = 'using filter Job ID contains "' + jobId +'"';
                }
                // Query the database for records by Job ID
                func.databaseFindMany(colJobs, query, projection, function (results) {
                    // Render Page
                    res.render('index', {
                        pageTitle: 'Job Search',
                        siteMap: func.createSiteMap(req),
                        jobId: jobId,
                        jobs: results,
                        filterText: filterText 
                    });
                });
            });

        // Route for applicant list
        applicationRouter.route('/applicants/:JobId')
            .get(function (req, res) {

                // Grab appId from request url
                var jobId = req.params.JobId.replace(/\-/g, '/');
                var appId = req.query.AppId;
                var appSurname = req.query.AppSurname;

                // Prepare query and projection
                var jobQuery = { ID: jobId };
                var jobProjection = {};

                // Query the database to find a single record by Job ID
                func.databaseFindOne(colJobs, jobQuery, jobProjection, function (jobResults) {
                    if (jobResults) {

                        // Prepare query and projection
                        var appQuery = { Applications: { $elemMatch: { JobId: jobId} } };
                        var appProjection = { ID: true, Name: true, Surname: true };

                        // If filters used, add to the query string and construct filter text to be displayed on the page
                        if (appId || appSurname) {

                            var filterText = 'using filter '; 

                            if (appId) {
                                appQuery.ID = new RegExp(appId, 'i');
                                filterText += 'ID contains ' + appId + '"';
                            };

                            if (appSurname) {
                                appQuery.Surname = new RegExp(appSurname, 'i');
                                if (appId) {
                                    filterText += ' and ';
                                }
                                filterText += 'Surname contains "' + appSurname + '"';
                            };
                        }

                        // Query the database for records by App ID and any additional filters
                        func.databaseFindMany(colApplicants, appQuery, appProjection, function (appResults) {
                            if (appResults) {
                                // Render Page
                                res.render('applicant-search', {
                                    pageTitle: 'Applicant Search',
                                    siteMap: func.createSiteMap(req),
                                    appId: appId,
                                    appSurname: appSurname,
                                    jobId: jobResults.ID,
                                    jobTitle: jobResults.Title,
                                    applicants: appResults,
                                    filterText: filterText,
                                    filterAppId: req.query.AppId,
                                    filterAppSurname: req.query.Surname
                                });
                            } else {
                                    func.errorPage(res, 500, 'Database search failed', null);
                            }
                            });
                    } else {
                        func.errorPage(res, 500, 'Database search failed', null);
                    }
                });
            });

        // Route for applicant details
        applicationRouter.route('/applicants/:JobId/view/:AppId')
            .get(function (req, res) {

                // Grab appId from request url
                var appId = req.params.AppId.replace(/\-/g, '/');
                var jobId = req.params.JobId.replace(/\-/g, '/');

                // Prepare query and projection
                var jobQuery = { ID: jobId };
                var jobProjection = { ID: true, Title: true };

                // Query the database to find a single record by Job ID
                func.databaseFindOne(colJobs, jobQuery, jobProjection, function (jobResults) {
                    if (jobResults) {
                        // Prepare query and projection
                        var appQuery = { ID: appId };
                        var appProjection = {};

                        // Query the database to find a single record by App ID
                        func.databaseFindOne(colApplicants, appQuery, appProjection, function (appResults) {
                            if (appResults) {
                                // Render Page
                                res.render('applicant', {
                                    pageTitle: 'Applicant Details',
                                    siteMap: func.createSiteMap(req),
                                    jobId: jobId,
                                    appId: appId,
                                    jobTitle: jobResults.Title,
                                    name: appResults.Name,
                                    surname: appResults.Surname,
                                    DOB: appResults.DOB,
                                    workExperience: appResults.Employment
                                });
                            } else {
                                func.errorPage(res, 500, 'Database search failed', null);
                            }
                        });
                    } else {
                        func.errorPage(res, 500, 'Database search failed', null);
                    }
                });
            });

        // Return router object to be used
        return applicationRouter;
};

module.exports = router;