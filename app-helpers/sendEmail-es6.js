import nodemailer from 'nodemailer';
import { authInfo, myAddresses } from '../private/mailAuthenticationInfo';

export default function sendEmail({ to, subject, html }) {
    // Not the movie transporter!
    let mailTransport = nodemailer.createTransport(authInfo);
    let emailInfo = Object.assign({}, myAddresses, {
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