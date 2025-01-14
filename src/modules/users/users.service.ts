import { TasksService } from './../tasks/tasks.service';
import { BadRequestException, forwardRef, HttpException, HttpStatus, Inject, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entities';
import { compareHashPasswordHelper, hashPasswordHelper } from 'src/helpers/util';
import { plainToClass, plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dto/response/user.responseDto';
import { CreateUserDto } from './dto/request/create-user.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { MailService } from 'src/mail/mail.service';
import { v4 as uuidv4 } from 'uuid';
import { RegisterUserDto } from './dto/request/register-user.dto';
import { Role } from '../roles/entities/role.entities';
import { RolesService } from '../roles/roles.service';
const bcrypt = require('bcrypt');

@Injectable()
export class UserService {
  /**
   * Here, we have used data mapper approch for this tutorial that is why we
   * injecting repository here. Another approch can be Active records.
   */
  // private verificationCodes = new Map<string, CreateUserDto>();
  private verificationCodesRegister = new Map<string, RegisterUserDto>();

  private readonly logger = new Logger(UserService.name)
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    // @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    private mailService: MailService,
    private rolesService: RolesService,

    @Inject(forwardRef(() => TasksService))
    private tasksService: TasksService,

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
    const userRole = await this.rolesService.findRoleUser();
    // Tạo đối tượng user bằng Spread Operator
    const user: User = {
      ...createUserDto,
      role: userRole,
      password: hashedPassword, // Ghi đè password sau khi hash

    } as User;
    const savedUser = await this.userRepository.save(user);

    return plainToInstance(UserResponseDto, savedUser, { excludeExtraneousValues: true });
  }

  // create user Admin

  async createUserAdmin(registerAuthDto: RegisterUserDto): Promise<Partial<UserResponseDto>> {

    const isTaken = await this.isEmailTaken(registerAuthDto.email);
    if (isTaken) {
      throw new BadRequestException(`Email ${registerAuthDto.email} is already taken`);
    }

    // Hash password
    const hashedPassword = await hashPasswordHelper(registerAuthDto.password);
    const adminRole = await this.rolesService.findRoleAdmin();
    // Tạo đối tượng user bằng Spread Operator
    const user: User = {
      ...registerAuthDto,
      role: adminRole,
      password: hashedPassword, // Ghi đè password sau khi hash

    } as User
    const savedUser = await this.userRepository.save(user);

    return plainToInstance(UserResponseDto, savedUser, { excludeExtraneousValues: true });
  }

  async findAllUser(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.find({ relations: ['role'] });
    if (users.length === 0) {
      throw new HttpException(
        "List users is empty",
        HttpStatus.NOT_FOUND,
      );
    }
    const userDTO = plainToInstance(
      UserResponseDto,
      users.map(user => ({
        ...user,
        role: user.role ? user.role.name : null, // Xử lý khi role là null
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
      where: { role: { name: 'admin' } }, // Điều kiện role
    });

    // Kiểm tra nếu danh sách admin rỗng
    if (admins.length === 0) {
      throw new HttpException(
        'No admin users found',
        HttpStatus.NOT_FOUND,
      );
    }
    // Chuyển đổi dữ liệu sang DTO
    const userDTO = plainToInstance(
      UserResponseDto,
      admins.map(user => ({
        ...user,
        role: user.role.name, // Lấy tên của role
      })),
      { excludeExtraneousValues: true },
    );
    return userDTO
  }
  // find all users role user

  async findAllRoleUser(): Promise<UserResponseDto[]> {
    // Tìm các user có role là 'admin'
    const users = await this.userRepository.find({
      where: { role: { name: 'user' } }, // Điều kiện role
    });

    // Kiểm tra nếu danh sách admin rỗng
    if (users.length === 0) {
      throw new HttpException(
        'Not found  users ',
        HttpStatus.NOT_FOUND,
      );
    }
    // Chuyển đổi dữ liệu sang DTO
    const userDTO = plainToInstance(
      UserResponseDto,
      users.map(user => ({
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

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<string> {
    // Lấy thông tin user hiện tại từ database
    const existingUser = await this.userRepository.findOne({ where: { id } });

    if (!existingUser) {
      throw new Error('User not found'); // Xử lý lỗi nếu user không tồn tại
    }

    // Kiểm tra nếu có mật khẩu mới (newPassword)
    if (updateUserDto.newPassword) {


      // Mã hóa mật khẩu mới
      updateUserDto.newPassword = await hashPasswordHelper(updateUserDto.newPassword);
    }

    // Tạo đối tượng cập nhật
    const updatedUser = {
      ...existingUser,
      ...updateUserDto,
      password: updateUserDto.newPassword || existingUser.password, // Cập nhật mật khẩu mới nếu có, nếu không giữ mật khẩu cũ
    };

    // Loại bỏ các trường không cần thiết
    // delete updatedUser.oldPassword;
    delete updatedUser.newPassword;

    // Lưu thông tin user
    const userDto = this.userRepository.save(updatedUser);
    return 'User has been updated successfully'
  }



  async removeUser(id: number): Promise<string> {
    const user = await this.userRepository.findOne({ where: { id }, relations: ['tasks'] })
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

    return `User with id ${id} deleted successfully.`
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
    await this.mailService.sendVerificationEmail(email, username, token);

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
      // role: 1,
      password: hashedPassword, // Ghi đè password sau khi hash

    } as User;
    await this.userRepository.save(user);

    this.verificationCodesRegister.delete(code);

    return 'Email verified. You can now login.';
  }

  async updateUserAvatar(userId: number, avatarPath: string): Promise<string> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }
    user.avatar = avatarPath;
    await this.userRepository.save(user);
    console.log("log==", avatarPath);

    // this.logger.log("logger==", avatarPath)
    return avatarPath
  }

}
