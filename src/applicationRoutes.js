// Includes

var express = require('express');
var func = require('./functions');

// Declare router object

var applicationRouter = express.Router();

// Sample applicant JSON

var applicant = [{
        ID: 1234,
        Name: 'Lucas',
        Surname: 'Cairns',
        DOB: '19/01/1989'
    }];

// Sample work experience JSON

var workExperience = [{
        Employer: 'Legal Aid Agency',
        StartDate: '20/01/15',
        EndDate: 'Present',
        Role: 'Admin Assistant',
        Description: 'I work as part of a large team involved in the processing of Legal Aid applications, this involves completing tasks and managing daily workload to ensure key targets are met whilst maintaining strict professional standards'
    }, {
        Employer: 'JD Weatherspoon',
        StartDate: '21/12/14',
        EndDate: '30/08/11',
        Role: 'Cook',
        Description: 'I worked as part of a small team in the kitchens of a busy restaurant where strong communication skills, organisation and self-motivation ensure that key tasks and goals are met.'
    }, {
        Employer: 'Wyvill Arms',
        StartDate: '30/06/2010',
        EndDate: '30/09/2010',
        Role: 'Cook',
        Description: 'Working as part of a team in a busy, professional kitchen for a popular village pub, this included preparing food and working alongside the chef.'
    }];

// Sample Job JSON

    var jobs = [{
        ID: 1,
        Title: 'Home Office - Junior Developer x 4',
        CloseDate: '02/09/16'
    }, {
        ID: 2,
        Title: 'Home Office - Junior Developer x 4',
        CloseDate: '02/09/16'
    }, {
        ID: 3,
        Title: 'Home Office - Junior Developer x 4',
        CloseDate: '02/09/16'
    }];

// Sample applicants JSON

    var applicants = [{
        ID: 1,
        Name: 'Lucas',
        Surname: 'Cairns',
        DOB: '19/01/1989'
    }, {
        ID: 2,
        Name: 'Lucas',
        Surname: 'Cairns',
        DOB: '19/01/1989'
    }, {
        ID: 3,
        Name: 'Lucas',
        Surname: 'Cairns',
        DOB: '19/01/1989'
    }];

// Route for homepage

applicationRouter.route('/')
    .get(function (req, res) {
        // Database Code To Go Here
        res.render('search', {
            pageTitle: 'Job Search',
            siteMap: func.createSiteMap(req),
            jobs: jobs
        })
    });

// Route for applicant list

applicationRouter.route('/applicants/:jobId')
    .get(function (req, res) {
        // Grab appId from request url
        var jobId = req.params.jobId;
        // Database Code To Go Here
        res.render('applicants', {
            pageTitle: 'Applicant Search',
            siteMap: func.createSiteMap(req),
            jobId: jobId,
            applicants: applicants

        })
    });

// Route for applicant details

applicationRouter.route('/applicants/:jobId/view/:appId')
    .get(function (req, res) {
        // Grab appId from request url
        var appId = req.params.appId;
        var jobId = req.params.jobId;
        // Database Code To Go Here
        res.render('applicant', {
            pageTitle: 'Applicant Details',
            siteMap: func.createSiteMap(req),
            jobId: jobId,
            ID: appId,
            Name: applicant[0].Name,
            Surname: applicant[0].Surname,
            DOB: applicant[0].DOB,
            workExperience: workExperience
        })
    });

// If no route exists default to 404 error page

applicationRouter.route('/*')
    .get(function (req, res) {
        func.errorPage(res, 404, 'Page not found')
    });

module.exports = applicationRouter;