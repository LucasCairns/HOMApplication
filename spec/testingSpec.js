// Includes

var express = require('express');
var request = require('request');
var mongodb = require('mongodb').MongoClient;
var config = require('../config.json');

var url = require('url');
var http = require('http');

//--Testing Functions used to create navigation------------------------------------------

function initCap(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

createNav = function (url) {
    // Parse the URL from the request
    var path = url.parse(url).pathname.split("/");
    // Initialize the JSON object to store the nav links
    var jsonNav = [{ text: 'Home', link: '/' }];
    var link = '';
    var token = '';
    for (var i = 1; i < path.length; i++) {
        if (path[i] != '') {
            // Using page->param paired nature of the url, use modulus to process page names and params differently, push back in to the sitemap after each pair
            if (i % 2) {    // if even (page), set token
                token = initCap(path[i]);
            } else {           // if odd (param), generate the link and push in to nav links json
                for (var j = 1; j <= i; j++) {
                    link += '/';
                    link += path[j];
                }
                jsonNav.push({
                    text: token, link: link
                });
                link = '';
            }
        }
    }
    return jsonNav;
}

// Variable declarations

var app = express();

var port = process.env.PORT || config.port;


app.get('/first/param/second/param', function (res, req) {
    describe('Test to generate sitemap from req.url', function () {
        it('Use createNav to generate sitemap', function (done) {
            request.get('http://localhost:8080/first/param/second/param', function (err, res, body) {
                var expResult = [{ 'Home': '/' }, { 'First': '/first/param' }, { 'Second': '/first/param/second/param' }];
                var b = createNav(req);
                expect(b).toBe(expResult);
                done();
            });
        });   
    });
});

request.get('http://localhost:8080/first/param/second/param', function (err, res, body) {
});

//---------------------------------------------------------------------------------------

//--Testing Database Query Function------------------------------------------------------

var url = config.databaseUrl;
var jobs = config.databaseJobCollection;

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
                        // Display error if unable to access collection
                        console.error('An error occured accessing the collection');
                        db.close();
                    }
                });
        } else {
            // Display error page if unable to access database
            console.error('An error occured accessing the database');
        }
    });
}

describe('Query the database for a record in the jobs collection where the ID = "HOM/1024/16"', function () {
    it('Returns as desbribed in expResults', function (done) {
        var expResult = {
            ID: 'HOM/1024/16',
            Title: 'Home Office - Developer',
            CloseDate: '16/09/16',
        };

        databaseFindOne(url, jobs, { ID: 'HOM/1024/16' }, {_id: false, ID:true, Title:true, CloseDate:true}, function (result) {
            expect(result).toEqual(expResult);
            done();
        });
    });
});

//---------------------------------------------------------------------------------------

// listen on port 8080

if (!module.parent) {
    app.listen(port);
}
