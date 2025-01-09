import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareHashPasswordHelper } from 'src/helpers/util';
import { MailService } from 'src/mail/mail.service';
import { UserService } from 'src/modules/users/users.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { User } from 'src/modules/users/entities/user.entities';
import { CreateUserDto } from 'src/modules/users/dto/request/create-user.dto';
import { RegisterUserDto } from 'src/modules/users/dto/request/register-user.dto';
import { v4 as uuidv4 } from 'uuid';
import { Response } from 'express';
import { Res } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private mailSevice: MailService,
  ) { }

  private verificationCodes = new Map<string, CreateUserDto>();

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
  async registerUser(registerUserDto: RegisterUserDto) {
    return this.userService.registerUser(registerUserDto);
  }

  async verifyEmail(code) {
    return this.userService.verifyCode(code);
  }

  async signIn(
    email: string,
    pass: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('email invalid');
    }
    const isValidPassword = await compareHashPasswordHelper(
      pass,
      user.password,
    );

    if (!isValidPassword) {
      throw new UnauthorizedException('password invalid');
    }
    const payload = { id: user.id, username: user.username, role: user.role };
    const accessToken = await this.jwtService.signAsync(payload);

    // Đặt access_token vào cookie
    res.cookie('access_token', accessToken, {
      httpOnly: true, // Cookie chỉ có thể được truy cập qua HTTP (không thể truy cập qua JavaScript)
      secure: true, // Chỉ gửi cookie qua HTTPS (khi chạy trên môi trường production)
      sameSite: 'none', // Giới hạn cookie chỉ được gửi trên cùng một site
      maxAge: 3600000, // Thời gian tồn tại của cookie (1 giờ)
    });
    return {
      // access_token: await this.jwtService.signAsync(payload),
      user
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
    const token = uuidv4(); // Tạo token xác minh
    this.verificationCodes.set(token, user);
    // const token = this.jwtService.sign({ email }, { expiresIn: '15m' }); // Token hết hạn sau 15 phút

    // Gửi email
    await this.mailSevice.sendMailRePassword(token);

    return {
      message: 'The code to reset the password has been sent to your email.',
    };
  }

  async resetPassword(code: string, newPassword: string) {
    try {
      // const payload = this.jwtService.verify(token);
      // const user = await this.userService.findByEmail(payload.email);
      const userDto = this.verificationCodes.get(code);
      const user = await this.userService.findByEmail(userDto.email);
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
