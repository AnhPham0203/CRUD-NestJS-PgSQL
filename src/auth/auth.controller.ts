import { Controller, Post, Body, Get, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { MailService } from 'src/mail/mail.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { CreateUserDto } from 'src/modules/users/dto/request/create-user.dto';
import { RegisterUserDto } from 'src/modules/users/dto/request/register-user.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailService: MailService,
  ) { }

  @Post('login')
  login(
    @Body() loginAuthDto: LoginAuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    // console.log("======", createAuthDto);
    // return "ok"
    return this.authService.signIn(
      loginAuthDto.email,
      loginAuthDto.password,
      res,
    );
  }

  @Post('test-email')
  testMail(@Body('email') email: string) {
    console.log('====EMIL::===', email);

    this.mailService.sendMail(email);

    return 'send email ok lan nua';
  }

  @Post('register')
  register(@Body() registerAuthDto: RegisterUserDto) {
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
    console.log('==resetPasswordDto===', resetPasswordDto);

    return await this.authService.resetPassword(
      resetPasswordDto.code,
      resetPasswordDto.newPassword,
    );
  }
}
