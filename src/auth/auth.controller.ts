import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { MailService } from 'src/mail/mail.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
    private readonly mailService: MailService
  ) { }

  @Post('login')
  create(@Body() createAuthDto: CreateAuthDto) {
    console.log("======", createAuthDto);
    // return "ok"
    return this.authService.signIn(createAuthDto.email, createAuthDto.password)
  }

  @Get('email')
  // @Public()
  testMail() {
    this.mailService.example()
    return "send email ok1"
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    return await this.authService.sendResetPasswordEmail(email);
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: { token: string; newPassword: string }) {
    return await this.authService.resetPassword(resetPasswordDto.token, resetPasswordDto.newPassword);
  }


}
