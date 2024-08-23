const nodemailer = require('nodemailer');

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: 'mail.cloudprism.in',
  port: 465, // SMTP Port for SSL
  secure: true, // true for 465, false for other ports
  auth: {
    user: 'smt@cloudprism.in',
    pass: 'Y$wnpCjz{o2@' // Use the email account's password
  },
//   auth: {
//     user: 'careers@codingcommando.in',
//     pass: 'Cloudprism@24' // Use the email account's password
//   },
  tls: {
    rejectUnauthorized: false
  },
  debug: true // Enable debug output
});

// Setup email data
const mailOptions = {
  from: '"Your Name" <careers@codingcommando.in>', // sender address
  to: 'mukeshkumar@cloudprism.in', // list of receivers
  subject: 'Test Email', // Subject line
  text: 'This is a test email sent using Node.js and Nodemailer!', // plain text body
  html: '<p>This is a test email sent using <b>Node.js</b> and <b>Nodemailer</b>!</p>' // html body
};

// Send mail with defined transport object
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.log('Error occurred:', error);
  }
  console.log('Message sent: %s', info.messageId);
});
