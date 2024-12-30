// import { UserService } from './../users/users.service';
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { emit } from 'process';

@Injectable()
export class MailService {
  jwtService: any;
  configService: any;
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(email: string) {
    await this.mailerService
      .sendMail({
        to: `${email}`, // list of receivers
        // from: 'noreply@nestjs.com', // sender address
        subject: 'Testing Nest MailerModule ✔', // Subject line
        // text: 'welcome', // plaintext body
        // html: '<b>Hello world AnhPham 95</b>', // HTML body content
        template: './test.hbs',
        context: {
          // ✏️ filling curly brackets with content
          name: 'Anh Pham',
          activationCode: 123456789,
          email:email
        },
      })
      .then(() => {})
      .catch((error) => {
        console.error('Error sending email:', error);
      });
  }


  // xác thực email
  async sendVerificationEmail(email: string, username: string, token: string) {
    this.mailerService
      .sendMail({
        to: `${email}`, // list of receivers
        subject: 'Testing Nest MailerModule ✔', // Subject line
        template: './register.hbs',
        context: {
          // ✏️ filling curly brackets with content
          activationCode: `${token}`,
          email: email,
          username: username,
          // url : `http://localhost:3000/auth/verify?token=${token}`,
        },
      })
      .then(() => {})
      .catch(() => {});
  }

  public sendMailRePassword(token: string): void {
    this.mailerService
      .sendMail({
        to: 'ngocanh.qn2015@gmail.com', // list of receivers
        // from: 'noreply@nestjs.com', // sender address
        subject: 'Testing Nest MailerModule ✔', // Subject line
        // text: 'welcome', // plaintext body
        // html: '<b>Hello world AnhPham 95</b>', // HTML body content
        template: './test.hbs',
        context: {
          // ✏️ filling curly brackets with content
          name: 'Anh Pham',
          activationCode: token,
          email: 'ngocanh.qn2015@gmail.com'
        },
      })
      .then(() => {})
      .catch(() => {});
  }
}
