require('dotenv').config()
const mongoose = require("mongoose");
const config = require("../config/database")

// Connect to MongoDB
CONNECTION_STRING = "mongodb+srv://nhash:<password>@mylibraryapp-n8rlv.mongodb.net/test?retryWrites=true&w=majority";
MONGO_URL = CONNECTION_STRING.replace("<password>", process.env.MONGO_PASSWORD);

console.log(MONGO_URL);


function connect() {
  return new Promise((resolve, reject) => {

    if (process.env.NODE_ENV === 'test') {
      const Mockgoose = require('mockgoose').Mockgoose;
      const mockgoose = new Mockgoose(mongoose);

      mockgoose.prepareStorage()
        .then(() => {
          mongoose.connect(MONGO_URL || config.database, { 
            useNewUrlParser: true, 
            useCreateIndex: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            dbName: "eportfolio"
          })
            .then(() => { resolve()})
            .catch((err) => { reject(err)})
        })
    } else {
        mongoose.connect(MONGO_URL || config.database, {
          useNewUrlParser: true,
          useCreateIndex: true,
          useUnifiedTopology: true,
          useFindAndModify: false,
          dbName: "eportfolio"
        })
          .then(() => { resolve()})
          .catch((err) => { reject(err)})
    }
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

module.exports = { connect, close };
