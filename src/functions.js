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