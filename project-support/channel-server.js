var fs      = require('fs'),
    argv    = require('optimist').argv,
    xpush   = require('../node-xpush/index'),
    redis   = require('redis');


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

//config.host = 'stalk.xpush.io';
config.port = argv.port || 8000;
config.host = argv.host;

var server = xpush.createChannelServer(config);

var redisClient;

if(config.redis.address){
  redisClient = redis.createClient(config.redis.address.split(':')[1], config.redis.address.split(':')[0]);
}else{
  redisClient = redis.createClient();
}


server.once('connected', function (url, port) {
  console.log('stalk channel server [listen - '+url+']');
});


server.on('channel', function (data) {

  var _key = data.channel.split('^')[0];
  var _value = data.channel;

  if(data.event == 'update'){
    if(data.count > 0){
      redisClient.hset(_key, _value, data.count); 
    }else{
      redisClient.hdel(_key, _value);
    } 

  }else if(data.event == 'remove'){
    redisClient.hdel(_key, _value);
  } 

});


server.session_on('listChannel', function (params, callback) {

  redisClient.hgetall(params.key, function (err, data) {

    console.log(data);

    var results = [];

    for(var key in data){
      var result = {};
      result[key] = JSON.parse(data[key]);
      results.push(result);
    }

    if(callback) callback({
      status: 'ok',
      result: results
    });

  });

});
