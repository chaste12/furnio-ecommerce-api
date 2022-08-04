const { MongoClient } = require("mongodb");

let connection;

const uri =
  "mongodb+srv://admin:pass12@cluster0.r9utypq.mongodb.net/?retryWrites=true&w=majority";
// const uri = "mongodb://localhost:27017";

module.exports = {
  connectToDb: (cb) => {
    MongoClient.connect(uri)
      .then((client) => {
        connection = client.db();
        return cb();
      })
      .catch((err) => {
        console.log(err);
        return cb();
      });
  },
  getToDb: () => connection,
};
