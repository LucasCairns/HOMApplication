// Includes

var express = require('express');

var url = require('url');

var applicationRouter = require('./src/applicationRouter')();
var testing = require('./src/testing');
var func = require('./src/functions');

// Test Environment -----------------------------
var testEnvironment = false;
if (testEnvironment) {
    console.log('Testing Enabled');
    testing.injectTestData();
}
//-----------------------------------------------

// Variable declarations

var app = express();

var port = process.env.PORT || 8080;

// Use .html extension rather than .ejs

app.engine('.html', require('ejs').__express);

// Set static public directory, containing css/js/images

app.use(express.static(__dirname + '/web-content/public'));

app.use('/bower_components', express.static(__dirname + '/bower_components'));

// Set Views directory

app.set('views', __dirname + '/web-content/views');

app.set('view engine', 'html');

// Use the applicantRouter as the default router

app.use('/', applicationRouter);

// Handle 404 Errors
app.use(function (req, res) {
    func.errorPage(res, 404, 'Page not found', null);
});

// Handle 500 Errors
app.use(function (err, req, res, next) {
    func.errorPage(res, 500, 'Internal server error', err);
    console.error('[ERROR] 500 -' + err + ' )');
});

// listen on port 8080

if (!module.parent) {
    app.listen(port);
    console.log('EJS engine server initialised on port: ' + port);
}