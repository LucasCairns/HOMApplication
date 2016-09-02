// Includes

var url = require('url');
var mongodb = require('mongodb').MongoClient;
var config = require('../config.json');

// Helper function to initialize the leading character of a string
function initCap(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Function used to create JSON object containing the sitemap

exports.createSiteMap = function (req) {
    // Parse the URL from the request
    var path = url.parse(req.url).pathname.split("/");
    // Initialize the JSON object to store the sitemap
    var jsonSiteMap = [{ text: 'Home', link: '/' }];
    var link = '';
    var token = '';
    for (var i = 1; i < path.length; i++) {
        if (path[i] != '') {
            // Using page->param paired nature of the url, use modulus to process page names and params differently, push back in to the sitemap after each pair
            if (i % 2) {    // if even (page), set token
                token = initCap(path[i]);
            } else {           // if odd (param), generate the link and push in to jsonSiteMap
                for (var j = 1; j <= i; j++) {
                    link += '/';
                    link += path[j];
                }
                jsonSiteMap.push({
                    text: token, link: link
                });
                link = '';
            }
        }
    }
    return jsonSiteMap;
}

// Function to render error pages

exports.errorPage = function (res, code, message, err) {
        res.render('error', {
            pageTitle: Error + " - " + code,
            errorCode: code,
            errorMessage: message
        })
}

// Database URL

var database = config.databaseUrl;

// Query database, return many records in json array.

exports.databaseFindMany = function (collectionName, query, projection, callback) {

    //Connect to database
    mongodb.connect(database, function (err, db) {
        if (!err) { // Check for an error connecting to the database
            var collection = db.collection(collectionName); // Access collection
            collection.find(query, projection).toArray( // Query collection
                function (err, results) {
                    if (!err) {
                        db.close();
                        callback(results);
                    } else {
                        // Display error page if unable to access collection
                        errorPage(res, 500, 'Error accessing collection', err);
                        db.close();
                    }
                });
        } else {
            // Display error page if unable to access database
            errorPage(res, 500, 'Unable to connect to database', err);
        }
    });
}

// Query database, return a record as json object

exports.databaseFindOne = function(collectionName, query, projection, callback) {
    //Connect to database
    mongodb.connect(database, function (err, db) {
        if (!err) { // Check for an error connecting to the database
            var collection = db.collection(collectionName); // Access collection
            collection.findOne(query, projection, // Query collection
                function (err, result) {
                    if (!err) {
                        db.close();
                        callback(result);
                    } else {
                        // Display error page if unable to access collection
                        errorPage(res, 500, 'Error accessing collection', err);
                        db.close();
                    }
                });
        } else {
            // Display error page if unable to access database
            errorPage(res, 500, 'Unable to connect to database', err);
        }
    });
}