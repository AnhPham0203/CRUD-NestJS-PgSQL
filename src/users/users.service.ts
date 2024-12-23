import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entities';
import { UpdateUserDto } from './dto/update-user.dto';
import { hashPasswordHelper } from 'src/helpers/util';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserService {  
  /**
   * Here, we have used data mapper approch for this tutorial that is why we
   * injecting repository here. Another approch can be Active records.
   */
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

 

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
        password: hashedPassword, // Ghi đè password sau khi hash
    } as User;
    await this.userRepository.save(user);

    return plainToInstance(User, user);
  }

 
  findAllUser(): Promise<User[]> {
    return this.userRepository.find();
  }

  
  viewUser(id: number): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }

  async findByEmail (email: string) : Promise<User | null>  {
    const user= await this.userRepository.findOne({where : {email:email}})
    return user
  }
  
  updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {

    const user: User = { id, ...updateUserDto } as User;
    return this.userRepository.save(user);
  }

  
  removeUser(id: number): Promise<{ affected?: number }> {
    return this.userRepository.delete(id);
  }

  
}
