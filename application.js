// Includes
var express = require('express');
var url = require('url');
var applicationRouter = require('./src/application-router')();
var testing = require('./src/testing');
var func = require('./src/functions');
var config = require('./config.json');

// Test Environment -----------------------------

var testEnvironment = config.testEnvironment;
if (testEnvironment) {
    console.log('Testing Enabled - injecting data');
    testing.injectTestData();
    config.testEnvironment = false;
}
//-----------------------------------------------

// Variable declarations
var app = express();
var port = process.env.PORT || config.port;

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