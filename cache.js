const redis = require('redis');

let redisClient;
let cacheConnected = false;

try{
    redisClient = redis.createClient();

    redisClient.on('connect', () => {
        console.log('Connected to Redis');
        cacheConnected = true;
    });
    //.on('error', function (err) {console.log(err);});
    redisClient.connect();
} catch(err) {
    console.log(err)
}


module.exports = {
    redisClient,
    cacheConnected
}