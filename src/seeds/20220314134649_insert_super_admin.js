const { encryptPassword } = require('../helpers/handlePassword');

exports.seed = async function (knex) {
  const encryptedPassword = await encryptPassword(process.env.SUPER_ADMIN_PWD);

  const superAdmin = {
    id: process.env.SUPER_ADMIN_ID,
    name: process.env.SUPER_ADMIN_NAME,
    email: process.env.SUPER_ADMIN_EMAIL,
    password: encryptedPassword,
    userType: process.env.SUPER_ADMIN_USERTYPE, 
  };

  await knex('users').insert(superAdmin);

};