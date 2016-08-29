// Includes

var url = require('url');

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
            if (isNaN(path[i])) { // if path[i] is not a number, set token
                token = initCap(path[i]);
            }
            if (!isNaN(path[i])) { // if path[i] is a number, generate the link and push in to jsonSiteMap
                for (var j = 1; j <= i; j++) {
                    link += '/';
                    link += path[j];
                }
                // Debug
                //console.log('Pushing to jsonSiteMap, text = ' + token + ' link = ' + link);
                jsonSiteMap.push({
                    text: token, link: link
                });
                link = '';
            }
        }
    }
    // Debug
    //console.log('var path = ' + path);
    //console.log('var jsonSiteMap = ' + JSON.stringify(jsonSiteMap));
    return jsonSiteMap;
}

// Function to render error pages

exports.errorPage = function(res, code, message) {
    return res.render('error', {
        pageTitle: Error + " - " + code,
        errorCode: code,
        errorMessage: message
    })
}