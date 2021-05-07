import ejs from 'ejs';

import sendgrid from '../../config/sendgrid';
import logger from '../../config/logger';

const from = {
    email: process.env.MAIL_FROM,
    name: process.env.NAME,
};

export async function sendSignupEmail(email, token) {
    if (process.env.TESTING) {
        return;
    }

    try {
        const msg = {
            from,
            to: email,
            subject: `Finish creating your account on ${process.env.NAME}`,
            html: await ejs.renderFile(`${__dirname}/templates/signup.ejs`, { token }),
        };

        await sendgrid.send(msg);
    } catch (err) {
        logger.error(err);
    }
}

export async function sendResetPasswordEmail(email, token) {
    if (process.env.TESTING) {
        return;
    }

    try {
        const msg = {
            from,
            to: email,
            subject: `Reset your password for ${process.env.NAME}`,
            html: await ejs.renderFile(`${__dirname}/templates/reset-password.ejs`, { token }),
        };

        await sendgrid.send(msg);
    } catch (err) {
        logger.error(err);
    }
}

export async function sendBanEmail(email, reason, duration) {
    if (process.env.TESTING) {
        return;
    }

    try {
        const msg = {
            from,
            to: email,
            subject: `Your ${process.env.NAME} account has been banned`,
            html: await ejs.renderFile(`${__dirname}/templates/ban.ejs`, { reason, duration }),
        };

        await sendgrid.send(msg);
    } catch (err) {
        logger.error(err);
    }
}

export async function sendInvites(emails, link, inviterName, inviterAvatar) {
    if (process.env.TESTING) return;

    try {
        const msg = {
            from,
            to: emails,
            subject: `You have been invited to AllSocial`,
            html: await ejs.renderFile(`${__dirname}/templates/invite.ejs`, { link, inviterName, inviterAvatar }),
        };

        await sendgrid.sendMultiple(msg);
    } catch (err) {
        logger.error(err);
    }
}
