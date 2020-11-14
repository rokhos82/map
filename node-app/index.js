const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const _ = require('lodash');
const path = require('path');

// Build the app object
const app = express();

// Setup the static web site
let staticPath = path.join(__dirname,"../dist");
console.log("Serving static path:",staticPath);
app.use(express.static(staticPath));

app.listen(8080,"0.0.0.0",() => {
  console.log('Listening on port 8080!');
});
