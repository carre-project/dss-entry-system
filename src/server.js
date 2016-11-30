'use strict';

var express = require('express'),
    cors = require('cors'),
    compression = require('compression'),
    Promise = require("bluebird"),
    request = Promise.promisifyAll(require("request")),
    app = express(),
    bodyParser = require('body-parser'),
    fallback = require('express-history-api-fallback');

// express middleware plugins
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(cors());
app.use(compression());

    
    
/* CONFIG */
var SERVER_PORT = process.env.PORT||3002;
var PASSWORD = process.env.PASSWORD||'demo1234';

// NOT_USED_FOR_NOW
app.get('/config.js',(req,res)=> {
    res.set('Content-Type', 'text/javascript');

    res.status(200).send(
        'window.CARRE_ENTRY_SYSTEM_CONFIGURATION = {' +
        'language:"' + (process.env.CARRE_ENTRY_SYSTEM_LANGUAGE || 'en') + '",' +
        'api_url:"' + (process.env.CARRE_ENTRY_SYSTEM_API_URL || 'https://devices.duth.carre-project.eu/ws/') + '",' +
        'cache_url:"NO_CACHE",' +
        'authentication_url:"' + (process.env.CARRE_ENTRY_SYSTEM_AUTH_URL || 'https://devices.duth.carre-project.eu/devices/accounts/') + '",' +
        'graph_url:"' + (process.env.CARRE_ENTRY_SYSTEM_GRAPH_URL || 'http://carre.kmi.open.ac.uk') +
        '"};');
      
});


// redirect all the other routes to index.html
var root = __dirname;
app.use(express.static(root));
console.log("Root folder is: "+root)
app.use(fallback('index.html', { root: root }));


app.listen(SERVER_PORT, function() {
    console.log('Entry system server listening on port: ', SERVER_PORT);
});



/* MAIN FUNCTIONS */ 

