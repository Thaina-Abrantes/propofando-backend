const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const cookieParser = require('cookie-parser')

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(routes);

module.exports = app;