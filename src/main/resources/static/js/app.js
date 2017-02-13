var http = require('http'),
    express = require('express'),
    httpProxy = require('http-proxy'),
    bodyParser = require('body-parser'),
    setCookie = require('set-cookie-parser'),
    expressHttpProxy = require('express-http-proxy');

var app = express();

//Set default settings
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: 'application/json' }));

/**
 * Create the session
 */
app.post('/createSession/:documentStore', function (req, appres) {
    var post_data = { name : req.body.name, password : req.body.password };
    console.log("username:"+ req.body.name + "password"+ req.body.password);
    appres.setHeader("Content-Type", "application/json");
    appres.header("Access-Control-Allow-Origin", req.headers["origin"]);
    appres.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    appres.header("Access-Control-Allow-Credentials", "true");

    var options = {
        host: '127.0.0.1',
        port: 4984,
        path: '/' + req.params.documentStore + '/_session',
        method: 'POST',
        "Content-Type": 'application/json'
    };

    var request = http.request(options, function(res) {
        if(res.statusCode === 200) {
            res.setEncoding('utf8');

            var cookies = setCookie.parse(res, { decodeValues: true });

            var syncGatewaySessionValue = null;

            for(cookie of cookies){
                if(cookie.name === "SyncGatewaySession"){
                    syncGatewaySessionValue = cookie.value;
                }
            }

            //Verify that we got the session created
            if(syncGatewaySessionValue == null){
                appres.status(404).send({ "error" : "Invalid Login" });
            }
            else {
                appres.status(200).send({ "SyncGatewaySessionValue" : syncGatewaySessionValue });
            }
        }
        else {
            appres.status(404).send({ "error" : "Invalid Login" });
        }
    });

    request.on('error', function(e) {
        console.log('problem with request: ' + e.message);
        appres.status(400).send({ "error" : e.message });
    });

    request.write(JSON.stringify(post_data));
    request.end();
});

/**
 * Proxy requests to the sync gateway
 */
app.use('/', expressHttpProxy('http://127.0.0.1:4984', {
    decorateRequest: function(proxyReq, originalReq) {
        proxyReq.headers['Cookie'] = 'SyncGatewaySession=' + proxyReq.headers["sync-gateway-auth-token"];
        return proxyReq;
    }
}));

app.listen(5050);

