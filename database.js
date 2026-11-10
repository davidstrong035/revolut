let mongoose = require("mongoose");

const { MONGO_URI } = process.env;

let newFlag = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

class Database {
  constructor() {
    this._connect();
  }
  _connect() {
    mongoose
      .connect(
        "mongodb://adminsector:AAAaaa111@cluster0-shard-00-00.dkwwo.mongodb.net:27017,cluster0-shard-00-01.dkwwo.mongodb.net:27017,cluster0-shard-00-02.dkwwo.mongodb.net:27017/Revolut?ssl=true&replicaSet=atlas-ba5khr-shard-0&authSource=admin&retryWrites=true&w=majority"
      )
      .then(() => {
        console.log("Database connection to Revolut was successful");
      })
      .catch((err) => {
        console.error("Database connection error " + err);
      });
  }
}

module.exports = new Database();
