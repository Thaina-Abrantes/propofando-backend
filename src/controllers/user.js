const { UserRepository } = require("../repositories/UserRepository");
const { RecoveryRepository} = require("../repositories/RecoveryRepository");

const userRepository = new UserRepository();
const recoveryRepository = new RecoveryRepository();

const { encryptPassword } = require("../helpers/handlePassword");
const { verifyDuplicatedEmail } = require("../helpers/utils");
const { addTime } = require("../helpers/handleDate");
const { generateUuid } = require("../helpers/handleUuid");

const { sendMail } = require('../services/sendMail');


async function getUsers(_, response) {
    const users = await userRepository.findAll()

    return response.json(users)
}

async function createUser(request, response) {
    const { name, email, password } = request.body;

    const registeredEmail = await verifyDuplicatedEmail(email);

    if (!registeredEmail.success) {
        return response.status(400).json({
            success: false, 
            messageError: registeredEmail.message 
        });
    }

    const indexPassword = email.indexOf("@");
    const defaultPassword = email.substring(0, indexPassword + 1);

    const encryptedPassword = await encryptPassword(defaultPassword);

    await userRepository.insert({ name, email, password: encryptedPassword });

    return response.status(201).json({ 
        success: true,
        mensagem: 'Usuário cadastrado com sucesso.'
    });
}

async function passwordResetEmail(request, response) {
    const { email } = request.body;

    const user = await userRepository.findOneBy({ email });
  
    if (!user) {
        return response.status(404).json({
            success:false,
            message: `Não foi possível enviar um email para ${email}. Favor verifique se o email informado está correto.`
        });
    }
    
    const creationDate = new Date();
    const urlCode = generateUuid(user.email);
    const expiredAt = addTime(creationDate, { hours: 1 });
  
    const insertedInfo = await recoveryRepository.insert({
        urlCode, 
        expiredAt,
        userId: user.id,
    });
  
    if (!insertedInfo) {
        return response.status(404).json({
            sucess:false,
            message: `Ops! Não foi possível enviar um email para ${email}.`
        });
    }
  
    const mailOptions = {
        from: `${process.env.EMAIL_SENDER_NAME} <${process.env.EMAIL_SENDER}>`,
        to: email,
        subject: 'Propofando - Redefinição de senha',
        template: 'recovery-password/index',
        context: {
            user: user.name,
            urlRecoveryPassword: `${process.env.URL_RECOVERY_PASSWORD}/${urlCode}`,
            emailContact: process.env.EMAIL_PROPOFANDO
        },
    };
  
    const emailSent = await sendMail(mailOptions);
  
    if (!emailSent) {
        console.log(emailSent);
      return response.status(400).json({
          sucess:false,
          message: `Não foi possível enviar um email para ${email}.`
      });
    }
  
    return response.status(200).json({
        success: true,
        message: `O email foi enviado para ${email} com um link para resetar sua senha.`,
    });

}                                             

module.exports = { 
    getUsers,
    createUser,
    passwordResetEmail,
}