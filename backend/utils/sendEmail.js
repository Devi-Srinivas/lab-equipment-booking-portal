const nodemailer = require('nodemailer');

// If EMAIL_USER / EMAIL_PASS are not set, the email is printed in the terminal
// instead of being sent. This is handy for testing.
module.exports = async function sendEmail({ to, subject, text, html }) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('\n--- Email is not configured, so nothing was sent. Message below ---');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log(text);
    console.log('--------------------------------------------------------------\n');
    return;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  await transporter.sendMail({
    from: `"Lab Equipment Portal" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  });
};
