require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});


// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"BankSystem" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

//registration email
async function sendRegisterationEmail(userEmail,name){
    const subject = 'Welcome to BankSystem';
    const text = `Dear ${name},\n\nWelcome to BankSystem. Your account has been successfully created.\n\nYou can now access all banking services with your registered email and secure password. For security purposes, please do not share your login credentials with anyone.\n\nIf you did not create this account or have any concerns, please contact our support team immediately.\n\nBest regards,\nBankSystem Team`;

     const html = `<p>Dear ${name},</p>
     <p>Welcome to BankSystem. Your account has been successfully created.</p>
     <p>You can now access all banking services with your registered email and secure password. For security purposes, please do not share your login credentials with anyone.</p>
     <p>If you did not create this account or have any concerns, please contact our support team immediately.</p>
     <p>Best regards,<br>BankSystem Team</p>`;
     await sendEmail(userEmail, subject, text, html);
 }

// Transaction email 
async function sendTransactionEmail(userEmail,name,amount,toAccount){
    const subject = 'Transaction Notification';
    const text = `Dear ${name},\n\nA transaction of $${amount} has been successfully processed to account ${toAccount}.\n\nIf you did not initiate this transaction, please contact our support team immediately.\n\nBest regards,\nBankSystem Team`;

     const html = `<p>Dear ${name},</p>
     <p>A transaction of $${amount} has been successfully processed to account ${toAccount}.</p>
     <p>If you did not initiate this transaction, please contact our support team immediately.</p>
     <p>Best regards,<br>BankSystem Team</p>`;
     await sendEmail(userEmail, subject, text, html);
 }

 //Failue email
 async function sendFailureEmail(userEmail,name,amount,toAccount){
    const subject = 'Transaction Failure Notification';
    const text = `Dear ${name},\n\nWe regret to inform you that a transaction of $${amount} to account ${toAccount} has failed.
    \n\nPlease check your account balance and try again. If you continue to experience issues, please contact our support team for assistance.
    \n\nBest regards,\nBankSystem Team`;
    await sendEmail(userEmail, subject, text, null);
 }

module.exports = {
    sendRegisterationEmail,
    sendTransactionEmail,
    sendFailureEmail
    
};