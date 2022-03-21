const nodemailer = require('../../configs/email.config');

async function sendMail(mailOptions) {
	return new Promise((resolve) => {
    nodemailer.sendMail(mailOptions, (error) => {
      if (error) {
        resolve(false);
      }

      resolve(true);
	  });
	});
}

module.exports = {
  sendMail,
};
