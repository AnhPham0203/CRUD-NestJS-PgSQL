import { TasksService } from './../tasks/tasks.service';
import { BadRequestException, forwardRef, HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entities';
import { hashPasswordHelper } from 'src/helpers/util';
import { plainToClass, plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dto/response/user.responseDto';
import { CreateUserDto } from './dto/request/create-user.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { MailService } from 'src/mail/mail.service';
import { v4 as uuidv4 } from 'uuid';
import { RegisterUserDto } from './dto/request/register-user.dto';
const bcrypt = require('bcrypt');

@Injectable()
export class UserService {
  /**
   * Here, we have used data mapper approch for this tutorial that is why we
   * injecting repository here. Another approch can be Active records.
   */
  // private verificationCodes = new Map<string, CreateUserDto>();
  private verificationCodesRegister = new Map<string, RegisterUserDto>();
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private mailService: MailService, 

    @Inject(forwardRef(() => TasksService))
    private tasksService: TasksService
  ) { }



  async isEmailTaken(email: string): Promise<boolean> {
    const count = await this.userRepository.count({ where: { email } });
    return count > 0;
  }

  async createUser(createUserDto: CreateUserDto): Promise<Partial<UserResponseDto>> {
 
    const isTaken = await this.isEmailTaken(createUserDto.email);
    if (isTaken) {
      throw new BadRequestException(`Email ${createUserDto.email} is already taken`);
    }

    // Hash password
    const hashedPassword = await hashPasswordHelper(createUserDto.password);

    // Tạo đối tượng user bằng Spread Operator
    const user: User = {
      ...createUserDto,
      // role: 'USER',
      password: hashedPassword, // Ghi đè password sau khi hash

    } as User;
   const savedUser =await this.userRepository.save(user);

    return plainToInstance(UserResponseDto, savedUser, { excludeExtraneousValues: true });
  }

  // create user Admin

  async createUserAdmin(createUserDto: CreateUserDto): Promise<Partial<UserResponseDto>> {
 
    const isTaken = await this.isEmailTaken(createUserDto.email);
    if (isTaken) {
      throw new BadRequestException(`Email ${createUserDto.email} is already taken`);
    }

    // Hash password
    const hashedPassword = await hashPasswordHelper(createUserDto.password);

    // Tạo đối tượng user bằng Spread Operator
    const user: User = {
      ...createUserDto,
      role: { name: 'admin' } ,
      password: hashedPassword, // Ghi đè password sau khi hash

    } as User
  const savedUser=  await this.userRepository.save(user);

    return plainToInstance(UserResponseDto, savedUser,{ excludeExtraneousValues: true });
  }

  async findAllUser(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.find( {relations: ['role']});
    if (users.length === 0) {
      throw new HttpException(
        "List users is empty",
        HttpStatus.NOT_FOUND,
      );
    }
    const userDTO= plainToInstance(
      UserResponseDto,
      users.map(user => ({
        ...user,
        role: user.role.name, // Lấy tên của role
      })),
      { excludeExtraneousValues: true },
    );
    return userDTO
  }


  async findUserById(id: number): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new HttpException(
        `User with id ${id} does not exist.`,
        HttpStatus.NOT_FOUND,
      );
    }
    return plainToInstance(UserResponseDto, user, { excludeExtraneousValues: true });
  }

  // find role admin
  async findAllAdminUsers(): Promise<UserResponseDto[]> {
    // Tìm các user có role là 'admin'
    const admins = await this.userRepository.find({
      where: { role: { name: 'admin' }  }, // Điều kiện role
    });
  
    // Kiểm tra nếu danh sách admin rỗng
    if (admins.length === 0) {
      throw new HttpException(
        'No admin users found',
        HttpStatus.NOT_FOUND,
      );
    }
    // Chuyển đổi dữ liệu sang DTO
    const userDTO= plainToInstance(
      UserResponseDto,
      admins.map(user => ({
        ...user,
        role: user.role.name, // Lấy tên của role
      })),
      { excludeExtraneousValues: true },
    );
    return userDTO
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
    const user = await this.userRepository.findOne({ where: { id },relations: ['tasks'] })
    if (!user) {
      throw new HttpException(
        `User with id ${id} does not exist.`,
        HttpStatus.NOT_FOUND,
      );
    }

    for (const task of user.tasks) {
      task.assignedTo = null; // Gán null cho khóa ngoại
      await this.tasksService.saveTask(task);
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
  async registerUser(registerUserDto: RegisterUserDto) {
    const { email, username } = registerUserDto;
    const existingUser = await this.userRepository.findOne({ where: { email } });

    if (existingUser) {
      throw new BadRequestException('Email already exists.');
    }
    
    const token = uuidv4(); // Tạo token xác minh
    this.verificationCodesRegister.set(token, registerUserDto);

    // Gửi email xác minh
    await this.mailService.sendVerificationEmail(email,username, token);

    return { message: 'Please check your email for verification.' };
  }

  async verifyCode(code: string): Promise<string> {
    console.log(this.verificationCodesRegister);
    
    const userDto = this.verificationCodesRegister.get(code);

    console.log(userDto);
    

    if (!userDto) {
      throw new BadRequestException('Invalid or expired verification code.');
    }

    // Hash password
    const hashedPassword = await hashPasswordHelper(userDto.password);

     // Tạo đối tượng user bằng Spread Operator
     const user: User = {
      ...userDto,
      // role: 'USER',
      password: hashedPassword, // Ghi đè password sau khi hash

    } as User;
    await this.userRepository.save(user);

    this.verificationCodesRegister.delete(code);

    return 'Email verified. You can now login.';
  }

}
