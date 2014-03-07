var fs       = require('fs'),
    argv     = require('optimist').argv,
    xpush    = require('../node-xpush/index');


if (!argv.config) {
  return console.error(" --config is not existed !! ");
}

var config = {};

try {
  var data = fs.readFileSync(argv.config);
  config = JSON.parse(data.toString());
} catch (ex) {
  console.log('Error starting xpush server: ' + ex);
  process.exit(1);
}

config.host = 'stalk.xpush.io';
config.port = 8000;

var server = xpush.createSessionServer(config);


server.once('connected', function (url, port){
  console.log('listen - '+url+':'+port);
});




server.on('oauth', function (data){
  // data.request.user.displayName
  
  data.response.send('Welcome ' + data.request.user.displayName);
});


server.static(/\/public\/?.*/, {
  directory: __dirname
});




/* default xpush oauth providers */
// FACEBOOK Auth Url : /auth/facebook
// FACEBOOK Callback Url : /auth/facebook/callback



server.get('/signup', function (req, res, next) {
  
  console.log(req);
      
  res.send({status : req.params.email});

  next();

});




server.get('/hello', function (req, res, next) {
  console.log("hello world");

  console.log(req.params);

  res.send({status : 'hello world'});

  next();

});


server.get('/test', function (req, res, next) {
  res.send({status : 'pong'});
  next();
});

