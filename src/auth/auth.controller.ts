import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { MailService } from 'src/mail/mail.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { CreateUserDto } from 'src/users/dto/request/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailService: MailService,
  ) {}

  @Post('login')
  login(@Body() createAuthDto: CreateAuthDto) {
    // console.log("======", createAuthDto);
    // return "ok"
    return this.authService.signIn(createAuthDto.email, createAuthDto.password);
  }

  @Post('test-email')
   testMail(@Body('email') email: string) {
    console.log('====EMIL::===', email);

     this.mailService.sendMail(email);

    return 'send email ok lan nua';
  }

  // @Post('verify-email')
  // async verifyMail(@Body('email') email: string) {

  //   return await this.authService.sendVerifyEmail(email)
  //   return "send email ok1"
  // }

  @Post('register')
  register(@Body() registerAuthDto: CreateUserDto) {
    console.log('===Register===', registerAuthDto);
    // return "ok"
    return this.authService.registerUser(registerAuthDto);
  }

  @Post('verify-email')
  async verifyEmail(@Body('code') code: string) {
    console.log('===code===', code);

    return this.authService.verifyEmail(code);
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    console.log('====Email====', email);

    return await this.authService.sendResetPasswordEmail(email);
  }

  @Post('reset-password')
  async resetPassword(
    @Body() resetPasswordDto: { code: string; newPassword: string },
  ) {
    console.log("==resetPasswordDto===",resetPasswordDto);
    
    return await this.authService.resetPassword(
      resetPasswordDto.code,
      resetPasswordDto.newPassword,
    );
  }
}
