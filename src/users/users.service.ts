import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entities';
import { hashPasswordHelper } from 'src/helpers/util';
import { plainToClass, plainToInstance } from 'class-transformer';
import { UserResponeDto } from './dto/response/user.responseDto';
import { CreateUserDto } from './dto/request/create-user.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { MailService } from 'src/mail/mail.service';
import { v4 as uuidv4 } from 'uuid';
const bcrypt = require('bcrypt');

@Injectable()
export class UserService {
  /**
   * Here, we have used data mapper approch for this tutorial that is why we
   * injecting repository here. Another approch can be Active records.
   */
  private verificationCodes = new Map<string, CreateUserDto>();
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private mailService: MailService
  ) { }



  async isEmailTaken(email: string): Promise<boolean> {
    const count = await this.userRepository.count({ where: { email } });
    return count > 0;
  }

  async createUser(createUserDto: CreateUserDto): Promise<Partial<User>> {
 
    const isTaken = await this.isEmailTaken(createUserDto.email);
    if (isTaken) {
      throw new BadRequestException(`Email ${createUserDto.email} is already taken`);
    }

    // Hash password
    const hashedPassword = await hashPasswordHelper(createUserDto.password);

    // Tạo đối tượng user bằng Spread Operator
    const user: User = {
      ...createUserDto,
      role: 'USER',
      password: hashedPassword, // Ghi đè password sau khi hash

    } as User;
    await this.userRepository.save(user);

    return plainToInstance(User, user);
  }


  async findAllUser(): Promise<UserResponeDto[]> {
    const users = await this.userRepository.find();
    if (users.length === 0) {
      throw new HttpException(
        "List users is empty",
        HttpStatus.NOT_FOUND,
      );
    }
    return plainToInstance(UserResponeDto, users, { excludeExtraneousValues: true });
  }


  async viewUser(id: number): Promise<UserResponeDto> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new HttpException(
        `User with id ${id} does not exist.`,
        HttpStatus.NOT_FOUND,
      );
    }
    return plainToInstance(UserResponeDto, user, { excludeExtraneousValues: true });
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { email: email } })
    if (!user) return null;
    return user
  }

  updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {

    const user: User = { id, ...updateUserDto } as User;
    return this.userRepository.save(user);
  }


  async removeUser(id: number): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { id } })
    if (!user) {
      throw new HttpException(
        `User with id ${id} does not exist.`,
        HttpStatus.NOT_FOUND,
      );
    }
    await this.userRepository.delete(id);

    return { message: `User with id ${id} deleted successfully.` };
  }


  async updatePassword(userId: number, newPassword: string) {
    
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error('User not found'); 
    }
  
    // Mã hóa mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 10);
  
    // Cập nhật mật khẩu
    user.password = hashedPassword;
  
    // Lưu lại vào database
    await this.userRepository.save(user);
  }
 // register
  async registerUser(createUserDto: CreateUserDto) {
    const { email, username } = createUserDto;
    const existingUser = await this.userRepository.findOne({ where: { email } });

    if (existingUser) {
      throw new BadRequestException('Email already exists.');
    }
    
    const token = uuidv4(); // Tạo token xác minh
    this.verificationCodes.set(token, createUserDto);

    // Gửi email xác minh
    await this.mailService.sendVerificationEmail(email,username, token);

    return { message: 'Please check your email for verification.' };
  }

  async verifyCode(code: string): Promise<string> {
    const userDto = this.verificationCodes.get(code);

    if (!userDto) {
      throw new BadRequestException('Invalid or expired verification code.');
    }

    // Hash password
    const hashedPassword = await hashPasswordHelper(userDto.password);

     // Tạo đối tượng user bằng Spread Operator
     const user: User = {
      ...userDto,
      role: 'USER',
      password: hashedPassword, // Ghi đè password sau khi hash

    } as User;
    await this.userRepository.save(user);

    this.verificationCodes.delete(code);

    return 'Email verified. You can now login.';
  }

}
