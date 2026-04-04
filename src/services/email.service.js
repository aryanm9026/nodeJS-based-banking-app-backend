import nodemailer from'nodemailer';

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

transporter.verify((error, success) => {
    if (error) {
        console.error('Error connecting to email server:', error);
    } else {
        console.log('Email server is ready to send messages');
    }
});


const sendEmail = async (to, subject, text, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"Banking Practice" <${process.env.EMAIL_USER}>`, // sender address
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

async function sendRegistrationEmail(userEmail, name) {
    const subject = 'Welcome to Banking Services';

    const text = `Hello ${name}, \n\nThank you for registering at our services.`;

    const html = `<p>Hello ${name}</p>`;

    await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionEmail(userEmail, name, amount, toAccount) {
    const subject = 'Transaction Successful';

    const text = `Hello ${name}, \n\nYour transaction of $${amount} to account ${toAccount} is successful.`

    const html = `<p>Hello ${name}</p>`;

    await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionFailedEmail(userEmail, name, amount, toAccount) {
    const subject = 'Transaction Unuccessful';

    const text = `Hello ${name}, \n\nYour transaction of $${amount} to account ${toAccount} is unsuccessful.`

    const html = `<p>Hello ${name}</p>`;

    await sendEmail(userEmail, subject, text, html);
}

export  { sendRegistrationEmail, sendTransactionEmail, sendTransactionFailedEmail};