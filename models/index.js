require('dotenv').config()
const mongoose = require("mongoose");
const config = require("../config/database");
const Grid = require('gridfs-stream');

// Connect to MongoDB
CONNECTION_STRING = "mongodb+srv://nhash:<password>@mylibraryapp-n8rlv.mongodb.net/eportfolio?retryWrites=true&w=majority";
MONGO_URL = CONNECTION_STRING.replace("<password>", process.env.MONGO_PASSWORD);

console.log(MONGO_URL);

function connect() {
  return new Promise((resolve, reject) => {
    mongoose.connect(MONGO_URL || config.database, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      dbName: "eportfolio"
    })
        .then(() => { resolve()})
        .catch((err) => { reject(err)})
  });
}

function close() {
  return mongoose.disconnect();
}

const db = mongoose.connection;
db.on("error", err => {
  console.error(err);
  process.exit(1);
});

db.once("open", async () => {
  console.log("Mongo connection started on " + db.host + ":" + db.port);
});

require("./user");
require("./education");
require("./experience");
require("./document");
require("./comment");
require("./blog");
require("./skill");
require("./links");
require("./report")

module.exports = {
  connect,
  close,
  MONGO_URL,
};
