// Includes
var express = require('express');
var test = require('assert');
var mongodb = require('mongodb').MongoClient;

//---Start of test data------------------------------------------------------------------------

// Sample Job JSON

var jobs = [{
        ID: 'HOM/1024/16',
        Title: 'Home Office - Developer',
        CloseDate: '16/09/16',
        Applicants: [2, 5, 1, 3]
    }, {
        ID: 'HOM/1025/16',
        Title: 'Home Office - Junior Developer x 4',
        CloseDate: '09/10/16',
        Applicants: [2, 5, 4, 3]
    }, {
        ID: 'HOM/1026/16',
        Title: 'Home Office - Senior Developer',
        CloseDate: '23/09/16',
        Applicants: [4, 5, 1, 3]
    }];

// Sample applicants JSON

var applicants = [{
        ID: 'EXT/15013',
        Name: 'August',
        Surname: 'Slawson',
        DOB: '25/05/1988',
        Employment: [{
            Employer: 'Web Developer',
            StartDate: '01/08/2011',
            EndDate: 'Present',
            Role: 'Web Developer',
            Description: 'I work independantly designing and developing websites for small businesses. As the work is independent I am involved throughout the entire process, from initially liaising with the client to discuss the numerous design choices, through to the coding and graphic design and on to the publication of the website and SEO.'
        }, {
            Employer: 'Wyvill Arms',
            StartDate: '30/08/2011',
            EndDate: '30/09/2010',
            Role: 'Cook',
            Description: 'Working as part of a team in a busy, professional kitchen for a popular village pub, this included preparing food and working alongside the chef.'
        }],
        Applications: [{
            JobId: 'HOM/1024/16',
            Status: 'Pending'
        }, {
            JobId: 'HOM/1026/16',
            Status: 'Pending'
        }]
    }, {
        ID: 'INT/14520',
        Name: 'Scarlett',
        Surname: 'Carlton',
        DOB: '15/03/1975',
        Employment: [{
            Employer: 'Legal Aid Agency',
            StartDate: '09/01/2016',
            EndDate: 'Present',
            Role: 'Admin Assistant',
            Description: 'I work as part of a large team involved in the processing of Legal Aid applications, this involves completing tasks and managing daily workload to ensure key targets are met whilst maintaining strict professional standards'
        }, {
            Employer: 'Bolton Arms',
            StartDate: '01/06/2013',
            EndDate: '30/12/2015',
            Role: 'Cook',
            Description: 'I worked as part of a small team in the kitchens of a busy restaurant where strong communication skills, organisation and self-motivation ensure that key tasks and goals are met.'
        }, {
            Employer: 'Web Developer',
            StartDate: '01/08/2008',
            EndDate: '23/07/2013',
            Role: 'Web Developer',
            Description: 'I work independantly designing and developing websites for small businesses. As the work is independent I am involved throughout the entire process, from initially liaising with the client to discuss the numerous design choices, through to the coding and graphic design and on to the publication of the website and SEO.'
        }, {
            Employer: 'JD Wetherspoon',
            StartDate: '01/07/2008',
            EndDate: '21/07/2013',
            Role: 'Cook',
            Description: 'I worked as part of a small team in the kitchens of a busy restaurant where strong communication skills, organisation and self-motivation ensure that key tasks and goals are met.'
        }, {
            Employer: 'Wyvill Arms',
            StartDate: '15/09/2001',
            EndDate: '30/06/2008',
            Role: 'Cook',
            Description: 'Working as part of a team in a busy, professional kitchen for a popular village pub, this included preparing food and working alongside the chef.'
        }],
        Applications: [{
            JobId: 'HOM/1025/16',
            Status: 'Pending'
        }, {
            JobId: 'HOM/1024/16',
            Status: 'Pending'
        }]
    }, {
        ID: 'EXT/14903',
        Name: 'Carrie',
        Surname: 'Attersby',
        DOB: '19/08/1992',
        Employment: [{
            Employer: 'Web Developer',
            StartDate: '01/08/2011',
            EndDate: 'Present',
            Role: 'Web Developer',
            Description: 'I work independantly designing and developing websites for small businesses. As the work is independent I am involved throughout the entire process, from initially liaising with the client to discuss the numerous design choices, through to the coding and graphic design and on to the publication of the website and SEO.'
        }, {
            Employer: 'JD Wetherspoon',
            StartDate: '19/08/2010',
            EndDate: '30/07/2011',
            Role: 'Cook',
            Description: 'I worked as part of a small team in the kitchens of a busy restaurant where strong communication skills, organisation and self-motivation ensure that key tasks and goals are met.'
        }, {
            Employer: 'Wyvill Arms',
            StartDate: '30/06/2009',
            EndDate: '18/08/2010',
            Role: 'Cook',
            Description: 'Working as part of a team in a busy, professional kitchen for a popular village pub, this included preparing food and working alongside the chef.'
        }],
        Applications: [{
            JobId: 'HOM/1024/16',
            Status: 'Pending'
        }, {
            JobId: 'HOM/1026/16',
            Status: 'Pending'
        }, {
            JobId: 'HOM/1025/16',
            Status: 'Pending'
       }]
    }, {
        ID: 'EXT/14806',
        Name: 'Donnell',
        Surname: 'Mara',
        DOB: '14/01/1987',
        Employment: [{
            Employer: 'Legal Aid Agency',
            StartDate: '19/01/2015',
            EndDate: 'Present',
            Role: 'Admin Assistant',
            Description: 'I work as part of a large team involved in the processing of Legal Aid applications, this involves completing tasks and managing daily workload to ensure key targets are met whilst maintaining strict professional standards'
        }, {
            Employer: 'Bolton Arms',
            StartDate: '01/09/2015',
            EndDate: '01/01/2015',
            Role: 'Cook',
            Description: 'I worked as part of a small team in the kitchens of a busy restaurant where strong communication skills, organisation and self-motivation ensure that key tasks and goals are met.'
        }, {
            Employer: 'Web Developer',
            StartDate: '01/08/2008',
            EndDate: '01/06/2015',
            Role: 'Web Developer',
            Description: 'I work independantly designing and developing websites for small businesses. As the work is independent I am involved throughout the entire process, from initially liaising with the client to discuss the numerous design choices, through to the coding and graphic design and on to the publication of the website and SEO.'
        }],
        Applications: [{
            JobId: 'HOM/1025/16',
            Status: 'Pending'
        }, {
            JobId: 'HOM/1026/16',
            Status: 'Pending'
        }]
    }, {
        ID: 'EXT/14632',
        Name: 'Isa',
        Surname: 'Laughridge',
        DOB: '04/12/1994',
        Employment: [{
            Employer: 'Legal Aid Agency',
            StartDate: '20/01/15',
            EndDate: 'Present',
            Role: 'Admin Assistant',
            Description: 'I work as part of a large team involved in the processing of Legal Aid applications, this involves completing tasks and managing daily workload to ensure key targets are met whilst maintaining strict professional standards'
        }, {
            Employer: 'Bolton Arms',
            StartDate: '01/06/2014',
            EndDate: '30/09/2014',
            Role: 'Cook',
            Description: 'I worked as part of a small team in the kitchens of a busy restaurant where strong communication skills, organisation and self-motivation ensure that key tasks and goals are met.'
        }, {
            Employer: 'Web Developer',
            StartDate: '31/03/2012',
            EndDate: '30/05/2014',
            Role: 'Web Developer',
            Description: 'I work independantly designing and developing websites for small businesses. As the work is independent I am involved throughout the entire process, from initially liaising with the client to discuss the numerous design choices, through to the coding and graphic design and on to the publication of the website and SEO.'
        }, {
            Employer: 'JD Wetherspoon',
            StartDate: '01/02/2011',
            EndDate: '30/03/2012',
            Role: 'Cook',
            Description: 'I worked as part of a small team in the kitchens of a busy restaurant where strong communication skills, organisation and self-motivation ensure that key tasks and goals are met.'
        }],
        Applications: [{
            JobId: 'HOM/1024/16',
            TitStatus: 'Pending'
        }, {
            JobId: 'HOM/1025/16',
            Status: 'Pending'
        }, {
            JobId: 'HOM/1026/16',
            Status: 'Pending'
        }]
    }];

//---End of test data--------------------------------------------------------------------------

exports.injectTestData = function () {

            // MongoDB database url
            var url = 'mongodb://localhost:27017/HOMApplication';

            // Connect to MongoDB using url in order to add applicants
            mongodb.connect(url, function (err, db) {
                if (!err) { // Check for an error connecting to the database
                        console.log('Successfully connected to database, preparing to inject test data in to collection (applicants)');

                        // Initialize collection variable
                        var collection = db.collection('applicants');

                        // insertMany using the applicants JSON object, send results using res.send and close connection to the database.
                        collection.insertMany(applicants,
                            function (err, results) {
                                if (err) {                                    
                                    func.errorPage(res, 500, 'Failed to inject in to database');
                                    return false;
                                } else {
                                    console.log('Data successfully injected in to collection (applicants)');
                                }
                                db.close();
                            });
                } else {
                    // Display error page if unable to access database
                    func.errorPage(res, 500, 'Unable to connect to database');
                    return false;
                }
            });


                    // Connect to MongoDB using url in order to add jobs
            mongodb.connect(url, function (err, db) {
                if (!err) { // Check for an error connecting to the database
                        console.log('Successfully connected to database, preparing to inject test data in to collection (jobs)');

                        // Initialize collection variable
                        var collection = db.collection('jobs');

                        // insertMany using the applicants JSON object, send results using res.send and close connection to the database.
                        collection.insertMany(jobs,
                            function (err, results) {
                                if (err) {
                                    func.errorPage(res, 500, 'Failed to inject in to database');
                                    return false;
                                } else {
                                    console.log('Data successfully injected in to collection (jobs)');
                                }
                                db.close();
                            });
                } else {
                    // Display error page if unable to access database
                    func.errorPage(res, 500, 'Unable to connect to database');
                    return false;
                }
            });
            return true;
};