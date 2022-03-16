const { generateUuid } = require('../helpers/handleUuid');
const { encryptPassword } = require('../helpers/handlePassword');

const { UserRepository } = require('../repositories/UserRepository');

const userRepository = new UserRepository();

exports.seed = async function (knex) {
  const encryptedPassword = await encryptPassword(process.env.SUPER_ADMIN_PWD);

  const superAdmin = {
    id: generateUuid(),
    name: process.env.SUPER_ADMIN_NAME,
    email: process.env.SUPER_ADMIN_EMAIL,
    password: encryptedPassword,
    userType: process.env.SUPER_ADMIN_USERTYPE, 
  };

  const { name, email, password, userType } = superAdmin;

  const registeredSuperAdmin = await userRepository.findOneBy({userType});

  if (!registeredSuperAdmin) {
    return await userRepository.insert(superAdmin);
  }

  await userRepository.update({id: registeredSuperAdmin.id, name, email, password});

};