const nodemailer = require('nodemailer');

// Create a transporter object using the SMTP transport
const transporter = nodemailer.createTransport({
  service: 'Office365', // Optional: Specifies the service to use
  host: 'smtp.office365.com',
  port: 587,
  secure: false, // Use TLS
  auth: {
    user: 'careers@cloudprism.in', // Replace with your Microsoft 365 email
    pass: 'N*943984022602od' 
  }
});

// Set up email data
const mailOptions = {
  from: 'careers@cloudprism.in', // Sender address
  to: 'mukeshkumar@cloudprism.in', // List of recipients
  subject: 'Hello from Node.js', // Subject line
  text: 'Hello world?', // Plain text body
  html: '<b>Hello world?</b>' // HTML body
};

// Send mail with defined tra

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.log('Error:', error);
  }
  console.log('Message sent: %s', info.messageId);
});
