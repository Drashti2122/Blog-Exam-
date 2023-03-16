const nodemailer = require('nodemailer');
const pug = require('pug');
const { convert } = require('html-to-text');
// const htmlToText = require('html-to-text');

// new Email(user, url).sendWelcome();

module.exports = class Email {
    constructor(user, url) {
        this.to = user.email;
        this.firstName = user.name.split(' ')[0];
        this.url = url;
        this.form = `<${process.env.EMAIL_FROM}>`;
    }

    newTransport() {
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }

    //send the actual email
    async send(template, subject) {
        //1)Render HTML Based on the pug template
        const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`,
            {
                firstName: this.firstName,
                url: this.url,
                subject
            }
        )

        //2)Define email options
        const mailOptions = {
            from: 'drashtikalathiya44@gmail.com',
            to: this.to,
            subject: subject,
            html: html,
            text: convert(html)
        };

        //3)create a transport and send email
        await this.newTransport().sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent:', info.response)
            }
        });
    }

    async sendWelcome() {
        await this.send('welcome', 'Welcome to our website!')
    }

    async sendNewBlogNotification() {
        await this.send('blogNotification', 'New blog is uploaded,please check out!')
    }
}
