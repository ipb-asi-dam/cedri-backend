const path = require('path')

const transporter = require('../../nodemailer')
const env = process.env.NODE_ENV || 'development'
const debug = require('debug')('mailer-wrap')
const mailerConfig = require('../../../config/config.json')[env]['mailer']

debug('sending email from: %s hostname: %s', mailerConfig.username,
  mailerConfig.host)

const ejs = require('ejs')

const mailer = {}

const templates = {
  recovery: path.join(__dirname, 'templates', 'recovery', 'index.ejs'),
  newUser: path.join(__dirname, 'templates', 'newUser', 'index.ejs')

}

mailer.sendRecoveryEmail = async (investigator) => {
  const email = {
    html: await ejs.renderFile(templates.recovery, investigator),
    subject: `Recuperação de senha`,
    from: mailerConfig.username,
    to: investigator.email
  }
  return transporter.sendMail(email)
}

mailer.newUserEmail = async (investigator) => {
  const email = {
    html: await ejs.renderFile(templates.newUser, investigator),
    subject: `Bem vindo ao CEDRI!`,
    from: mailerConfig.username,
    to: investigator.email
  }
  return transporter.sendMail(email)
}
module.exports = mailer
