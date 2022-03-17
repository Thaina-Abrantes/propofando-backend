const path = require('path');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_PORT === 465,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

transporter.use('compile', hbs({
  viewEngine: {
    extName: '.html',
    partialsDir: path.resolve('./src/templates-emails'),
    defaultLayout: false,
  },
  viewPath: path.resolve('./src/templates-emails'),
  extName: '.html',
}));

module.exports = transporter;
