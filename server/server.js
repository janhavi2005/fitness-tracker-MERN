const express = require("express");
const punycode = require('punycode');
const path = require("path");
const routes = require("./routes");
const db = require("./config/connection");

const PORT = process.env.PORT || 3001;
const app = express();
const _dirname = path.resolve();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve up static assets
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../client/build/index.html'));
// });

app.use(routes);
app.use(express.static(path.join(_dirname, "/client/dist")));
app.get('*',(_,res) => {
  res.sendFile(path.resolve(_dirname, "client", "dist", "index.html"));
});

db.once("open", () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});
