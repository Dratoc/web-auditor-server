const express = require("express");
const bodyParser = require("body-parser");


const app = express();
const {API_VERSION} =require('./config');

//load routings
//....
const userRoutes = require('./routers/user');
const authRoutes = require('./routers/auth');


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//configure Header HTTP

// Router Basic
//...
app.use(`/api/${API_VERSION}`, authRoutes);
app.use(`/api/${API_VERSION}`, userRoutes);

module.exports = app;