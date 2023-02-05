
const { MongoClient } = require("mongodb");
const config = require('./config')

const client = new MongoClient(config.db.uri);
/*async function connection(){
  try {
     return client.connect();
    console.log("Database connected successfully");
  } catch (error) {
    console.log("Database failed to connect because ${error}");
  }
}*/

module.exports = client;

