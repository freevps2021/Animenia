const NodeMailer = require('nodemailer');


async function send (options){

    let testAccount = await NodeMailer.createTestAccount();

    const transporter = await NodeMailer.createTransport({
        host: 'smtp.googlemail.com',
        port: 465,
        secure: true,
        auth:{
            user: process.env.GMAIL_ACCOUNT,
            pass: process.env.GMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: options.from,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html
    };

    transporter.sendMail(mailOptions);
}

module.exports = send;
