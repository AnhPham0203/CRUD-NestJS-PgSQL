import { UserService } from './../users/users.service';
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  jwtService: any;
  configService: any;
  constructor(private readonly mailerService: MailerService, private readonly userService: UserService) { }

  public example(): void {
    this.mailerService
      .sendMail({
        to: 'ngocanh.qn2015@gmail.com', // list of receivers
        // from: 'noreply@nestjs.com', // sender address
        subject: 'Testing Nest MailerModule ✔', // Subject line
        // text: 'welcome', // plaintext body
        // html: '<b>Hello world AnhPham 95</b>', // HTML body content
        template: './register.hbs',
        context: { // ✏️ filling curly brackets with content
          name: "Anh Pham",
          activationCode: 123456789,
        },
      })
      .then(() => { })
      .catch(() => { });

  }

<<<<<<< HEAD

=======
  public sendMailRePassword(token : string): void {
    this.mailerService
      .sendMail({
        to: 'ngocanh.qn2015@gmail.com', // list of receivers
        // from: 'noreply@nestjs.com', // sender address
        subject: 'Testing Nest MailerModule ✔', // Subject line
        // text: 'welcome', // plaintext body
        // html: '<b>Hello world AnhPham 95</b>', // HTML body content
        template: './register.hbs',
        context: { // ✏️ filling curly brackets with content
          name: "Anh Pham",
          activationCode: token,
        },
      })
      .then(() => { })
      .catch(() => { });

  }
>>>>>>> 50232f7b693783da4eb37ec1b459ef976a94ed35
}