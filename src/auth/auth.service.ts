import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareHashPasswordHelper } from 'src/helpers/util';
import { MailService } from 'src/mail/mail.service';
import { UserService } from 'src/users/users.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { User } from 'src/users/entities/user.entities';
import { CreateAuthDto } from './dto/create-auth.dto';
import { CreateUserDto } from 'src/users/dto/request/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private mailSevice: MailService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findByEmail(username);
    const isValidPassword = await compareHashPasswordHelper(
      pass,
      user.password,
    );

    if (!isValidPassword) return null;

    return user;
  }
  // register
  async registerUser(registerUserDto: CreateUserDto) {
    return this.userService.registerUser(registerUserDto);
  }

  async verifyEmail(code) {
    return this.userService.verifyCode(code);
  }

  async signIn(email: string, pass: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    const isValidPassword = await compareHashPasswordHelper(
      pass,
      user.password,
    );

    if (!isValidPassword) {
      throw new UnauthorizedException('email/password invalid');
    }
    const payload = { sub: user.id, username: user.username, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async sendVerifyEmail(email: string) {
    console.log('==email===', email);

    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new HttpException('Email not found', HttpStatus.NOT_FOUND);
    }

    // const token = this.jwtService.sign({ email }, { expiresIn: '15m' }); // Token hết hạn sau 15 phút

    // Gửi email
    // this.mailSevice.sendMail()

    return {
      message: 'The code to verify email has been sent to your email.',
    };
  }

  async sendResetPasswordEmail(email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new HttpException('Email not found', HttpStatus.NOT_FOUND);
    }

    const token = this.jwtService.sign({ email }, { expiresIn: '15m' }); // Token hết hạn sau 15 phút

    // Gửi email
    await this.mailSevice.sendMailRePassword(token);

    return {
      message: 'The code to reset the password has been sent to your email.',
    };
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.userService.findByEmail(payload.email);
      if (!user) {
        throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
      }

      // const hashedPassword = await bcrypt.hash(newPassword, 10);

      await this.userService.updatePassword(user.id, newPassword);

      return { message: 'Password has been updated successfully.' };
    } catch (err) {
      throw new HttpException(
        'Invalid or expired token',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
