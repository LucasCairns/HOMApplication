// Includes

var express = require('express');

var url = require('url');

var applicationRouter = require('./src/applicationRoutes');

// Variable declarations

var app = express();

var port = process.env.PORT || 8080;

// Use .html extension rather than .ejs

app.engine('.html', require('ejs').__express);

// Set static public directory, containing css/js/images

app.use(express.static(__dirname + '/web-content/public'));

// Set Views directory

app.set('views', __dirname + '/web-content/views');

app.set('view engine', 'html');

// Declare Router object

var applicantRouter = express.Router();

// Use the applicantRouter as the default router

app.use('/', applicationRouter);

// Listen on port 8080

if (!module.parent) {
    app.listen(port);
    console.log('EJS engine server initialised on port: ' + port);
}