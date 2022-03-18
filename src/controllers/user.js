const { UserRepository } = require("../repositories/UserRepository");
const { RecoveryRepository} = require("../repositories/RecoveryRepository");

const userRepository = new UserRepository();
const recoveryRepository = new RecoveryRepository();

const { encryptPassword } = require("../helpers/handlePassword");
const { verifyDuplicatedEmail } = require("../helpers/utils");
const { addTime, checkIsValidDate } = require("../helpers/handleDate");
const { generateUuid } = require("../helpers/handleUuid");

const { sendMail } = require('../services/sendMail');
const { generateTransaction } = require("../helpers/handleTransaction");


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

    const user = await userRepository.findOneBy({ email, userType: 'student' });
  
    if (!user) {
        return response.status(404).json({
            message: `Não foi possível enviar um email para ${email}. Favor verifique se o email informado está correto.`
        });
    }
    
    const creationDate = new Date();
    const resetToken = generateUuid(user.email);
    const expiredAt = addTime(creationDate, { hours: 1 });

    const transaction = await generateTransaction();

    const insertedInfo = await recoveryRepository.withTransaction(transaction).insert({
        token: resetToken, 
        expiredAt,
        userId: user.id,
    });
  
    if (!insertedInfo) {
        return response.status(400).json({
            message: `Ops! Não foi possível enviar um email para ${email}.`
        });
    }
  
    const mailOptions = {
        from: 'Propofando <não-responda@propofando.com>',
        to: email,
        subject: 'Redefinição de senha',
        template: 'recovery-password/index',
        context: {
            user: user.name,
            urlRecoveryPassword: `${process.env.URL_RECOVERY_PASSWORD}/${resetToken}`,
            emailContact: process.env.EMAIL_PROPOFANDO
        },
    };
  
    const emailSent = await sendMail(mailOptions);
  
    if (!emailSent) {
      return response.status(400).json({
          message: `Não foi possível enviar um email para ${email}. Verifique o email fornecido.`
      });
    }

    transaction.commit();
  
    return response.status(200).json({
        message: `O email foi enviado para ${email} com um link para resetar sua senha.`,
    });

}   

async function updatePassword(request, response) {
    const { token } = request.query;
    const { password } = request.body;
  
    const registeredToken = await recoveryRepository.findOneBy({ token });
  
    if (!registeredToken) {
        return response.status(404).json({
            message: 'Ação inválida. Solicite novamente uma nova senha.'
        });
    }
  
    const tokenExpired = await checkIsValidDate(new Date(), registeredToken.expiredAt);
  
    if (tokenExpired) {
        return response.status(400).json({
            message: 'Solicitação expirada. Solicite novamente uma nova senha.'
        });
    }
  
    const encryptedPassword = await encryptPassword(password);
  
    const updatedPassword = await userRepository.update({
        id: registeredToken.userId, password: encryptedPassword
    });
  
    if (!updatedPassword) {
      return response.status(400).json({message: 'Não foi possível realizar a troca de senha.'});
    }
  
    return response.status(200).json({message: 'Senha atualizada!'});
  }

module.exports = { 
    getUsers,
    createUser,
    passwordResetEmail,
    updatePassword,
}