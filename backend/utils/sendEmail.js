const nodemailer = require('nodemailer');

/*
  How the email is sent (first match wins):
  1. BREVO_API_KEY is set  -> sends over HTTPS (works on Render's free plan, which blocks SMTP)
  2. EMAIL_USER + EMAIL_PASS are set -> sends through Gmail SMTP (works on your own computer)
  3. nothing is set -> prints the message in the terminal (good for testing)
*/
module.exports = async function sendEmail({ to, subject, text, html }) {
  const senderEmail = process.env.EMAIL_FROM || process.env.EMAIL_USER;

  // 1. Brevo HTTPS API
  if (process.env.BREVO_API_KEY) {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({
        sender: { name: 'Lab Equipment Portal', email: senderEmail },
        to: [{ email: to }],
        subject,
        textContent: text,
        htmlContent: html,
      }),
    });
    if (!res.ok) {
      throw new Error(`Brevo API error ${res.status}: ${await res.text()}`);
    }
    return;
  }

  // 2. Gmail SMTP (with timeouts so it can never hang for minutes)
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    });
    await transporter.sendMail({
      from: `"Lab Equipment Portal" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });
    return;
  }

  // 3. Not configured: print the email in the terminal
  console.log('\n--- Email is not configured, so nothing was sent. Message below ---');
  console.log('To:', to);
  console.log('Subject:', subject);
  console.log(text);
  console.log('--------------------------------------------------------------\n');
};