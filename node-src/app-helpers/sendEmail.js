import nodemailer from 'nodemailer';

const host = process.env.EMAIL_HOST,
      port = process.env.EMAIL_PORT,
      fromAddress = process.env.EMAIL_FROM,
      authPass = process.env.EMAIL_PASSWORD,
      authUser = process.env.EMAIL_USER;

let authInfo = {
    host,
    secureConnection: false, // TLS requires secureConnection to be false
    port, // port for secure SMTP
    auth: {
        user: authUser, // Your email id
        pass: authPass // Your password
    }
    //tls: {
    //    ciphers:'SSLv3'
    //}
};


export default function sendEmail({ to, subject, html }) {
    // Not the movie transporter!
    let mailTransport = nodemailer.createTransport(authInfo);
    let emailInfo = Object.assign({}, {from: fromAddress}, {
        to,
        subject,
        html
    });

    return new Promise((res, rej) => {
        mailTransport.sendMail(emailInfo, function (err, info) {
            if (err) {
                console.log(err);
                rej(err);
            } else {
                console.log(info.response);
                res(info.response);
            }
        });
    });
}