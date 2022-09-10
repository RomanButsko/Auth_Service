import nodemailer from 'nodemailer';

class mailService {

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
              user: 'artlend.media@gmail.com', 
              pass: 'mdcalgrenftwkxtb',
            },
          });
    }
    async sendActivationLink(to ,link) {
            await this.transporter.sendMail({
            from: process.env.DB_AUTH_EMAIL,
            to, // list of receivers
            subject: "Активация аккаунта ✔", // Subject line
            text: "Hello world?", // plain text body
            html: 
                `
                    <h1>Hello world</h1>
                    </br>
                    <b>We are waiting for you on our website ${link}</b>`,
        });

    }
}

export default new mailService();