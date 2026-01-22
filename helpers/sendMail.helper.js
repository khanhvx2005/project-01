const nodemailer = require('nodemailer');
module.exports.sendMail = (email, subject, html) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Use the 'gmail' service
        auth: {
            user: process.env.EMAIL_USER, // Your Gmail address
            pass: process.env.EMAIL_PASSWORD, // Your Gmail App Password (CRUCIAL - see note below)
        },
    });

    // Step 3: Define the email options (who, what, where)
    const mailOptions = {
        from: process.env.EMAIL_USER, // Sender address
        to: email, // List of recipients
        subject: subject, // Subject line
        html: html, // HTML body
    };

    // Step 4: Send the email!
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error occurred:', error);
        } else {
            console.log('Email sent successfully!');
            console.log('Message ID:', info.messageId);
            // Preview only available when sending through an Ethereal account (see below)
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        }
    });
}