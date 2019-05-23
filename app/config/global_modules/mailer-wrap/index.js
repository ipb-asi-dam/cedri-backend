const transporter = require('../../nodemailer');
const env = process.env.NODE_ENV || 'development';
const debug = require('debug')('mailer-wrap');
const mailerConfig = require('../../../config/config.json')[env]['mailer'];

debug('sending email from: %s hostname: %s', mailerConfig.username,
    mailerConfig.host);

const ejs = require('ejs');

const mailer = {};

const templates = {
    recovery: __dirname+'/templates/recovery/index.ejs',
    newUser: __dirname+'/templates/newUser/index.ejs',

};

mailer.sendRecoveryEmail = async (investigator) => {
    try{
        const email = {
            html: await ejs.renderFile(templates.recovery, investigator),
            subject: `Recuperação de senha`,
            from: mailerConfig.username,
            to: investigator.user.email,
        };
        return transporter.sendMail(email);
    } catch(err){
        console.log(err)
    }
};

mailer.newUserEmail = async (investigator) => {
    try{
        const email = {
            html: await ejs.renderFile(templates.newUser, investigator),
            subject: `Bem vindo ao CEDRI!`,
            from: mailerConfig.username,
            to: investigator.email,
        };
        return transporter.sendMail(email);
    } catch(err){
        console.log(err)
    }
};
module.exports = mailer;
