import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entities';
import { hashPasswordHelper } from 'src/helpers/util';
import { plainToClass, plainToInstance } from 'class-transformer';
import { UserResponeDto } from './dto/response/user.responseDto';
import { CreateUserDto } from './dto/request/create-user.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';
const bcrypt = require('bcrypt');

@Injectable()
export class UserService {
  /**
   * Here, we have used data mapper approch for this tutorial that is why we
   * injecting repository here. Another approch can be Active records.
   */
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
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
    // Tìm user bằng userId
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error('User not found'); // Hoặc bạn có thể dùng HttpException nếu đây là ứng dụng web
    }
  
    // Mã hóa mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 10);
  
    // Cập nhật mật khẩu
    user.password = hashedPassword;
  
    // Lưu lại vào database
    await this.userRepository.save(user);
  }

}
