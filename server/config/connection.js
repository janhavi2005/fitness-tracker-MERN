const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://janhavi:janhavi@cluster0.b1zt8.mongodb.net/local", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}, err => {
  if (err) throw err;
  console.log('Connected to MongoDB!')
}

);

module.exports = mongoose.connection;
