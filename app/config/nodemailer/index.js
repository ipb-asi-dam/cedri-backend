const nodemailer = require('nodemailer');
const env = process.env.NODE_ENV || 'development';
const mailerConfig = require('../../config/config.json')[env]['mailer'];
const isProduction = env === 'production';

const transporterConf = {
    host: mailerConfig.host,
    port: mailerConfig.port,
    secure: !isProduction, // true for 465, false for other ports
    auth: {
        user: mailerConfig.username,
        pass: mailerConfig.password,
    },
};

if (!isProduction) {
    transporterConf.service = 'gmail';
}

const transporter = nodemailer.createTransport(transporterConf);

module.exports = transporter;
