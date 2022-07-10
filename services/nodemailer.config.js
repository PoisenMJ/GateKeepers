const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const { OAuth2 } = google.auth;

const USERNAME = process.env.EMAIL_USERNAME;
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;

const { ActivationEmail } = require('../email_templates/activation');
const { OrderConfirmation } = require('../email_templates/orderConfirmation');
const { PasswordRecovery } = require('../email_templates/passwordRecovery');
const { PasswordChange } = require('../email_templates/passwordChange');
const { CheckOrders } = require('../email_templates/checkOrders');

const createTransporter = async () => {
  const oauth2Client = new OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
  );
  oauth2Client.setCredentials({
    refresh_token: REFRESH_TOKEN,
  });

  const accessToken = await new Promise((resolve, reject) => {
    oauth2Client.getAccessToken((err, token) => {
      if (err) reject();
      resolve(token);
    });
  });

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: USERNAME,
      accessToken,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: REFRESH_TOKEN,
    },
  });

  return transporter;
};

module.exports.sendActivationEmail = async (email, activationCode) => {
  try {
    const transport = await createTransporter();
    const mailOptions = {
      from: USERNAME,
      to: email,
      subject: 'Gatekeepers.ACTIVATE',
      html: ActivationEmail(activationCode),
    };
    return await transport.sendMail(mailOptions);
  } catch (err) {
    console.log(err);
    return false;
  }
};

async function sendOrderConfirmationEmail(email, products, total) {
  try {
    const transport = await createTransporter();
    const mailOptions = {
      from: USERNAME,
      to: email,
      subject: 'Gatekeepers.Orders',
      html: OrderConfirmation(products, total),
    };
    return await transport.sendMail(mailOptions);
  } catch (err) {
    console.log(err);
    return err;
  }
}

module.exports.sendPasswordResetEmail = async (email, link) => {
  try {
    const transport = await createTransporter();
    return await transport.sendMail({
      from: USERNAME,
      to: email,
      subject: 'Password recovery',
      html: PasswordRecovery(link),
    });
  } catch (err) {
    console.log(err);
    return err;
  }
};

async function sendPasswordChangeEmail(email, link) {
  try {
    const transport = await createTransporter();
    return await transport.sendMail({
      from: USERNAME,
      to: email,
      subject: 'Gatekeepers.INFO',
      html: PasswordChange(link),
    });
  } catch (err) {
    console.log(err);
    return err;
  }
}

async function sendOrderToCreatorEmail(creatorEmail) {
  try {
    const transport = await createTransporter();
    await transport.sendMail({
      from: USERNAME,
      to: creatorEmail,
      subject: 'Gatekeepers.ORDERS',
      html: CheckOrders(),
    });
  } catch (err) {
    console.log(err);
  }
}

// sendOrderConfirmationEmail("maksjl01@gmail.com", [{name: "Chain Mask", price: 35,
// image: "images-1643138177183-791449753.jpeg"}], 35)
// sendPasswordChangeEmail("maksjl01@gmail.com", "https://www.google.com")

module.exports.sendOrderToCreatorEmail = sendOrderToCreatorEmail;
module.exports.sendPasswordChangeEmail = sendPasswordChangeEmail;
module.exports.sendOrderConfirmationEmail = sendOrderConfirmationEmail;
