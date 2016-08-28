var express = require('express');

var url = require('url');

var app = express();

var port = 8080;

app.engine('.html', require('ejs').__express);

app.use(express.static(__dirname + '/web-content/public'));

app.set('views', __dirname + '/web-content/views');

app.set('view engine', 'html');

function createSiteMap(req) {
    var path = url.parse(req.url).pathname.split("/");
    var jsonSiteMap = [{ text: 'Home', link: '/' }];
    return jsonSiteMap;
}

app.get('/', function (req, res) {
    res.render('index', {
        pageTitle: 'Index'
    });
});

app.get('/error', function (req, res) {
    res.render('error', {
        pageTitle: 'Error'
    });
});

app.get('/search', function (req, res) {
    res.render('search', {
        pageTitle: 'Search'
    });
});

app.get('/applicant/:appId', function (req, res) {   
    res.render('applicant', {
        pageTitle: 'Applicant: Name Here',
        siteMap: createSiteMap(req)
    });
});

if (!module.parent) {
    app.listen(8080);
    console.log('EJS engine server initialised on port 8080');
}