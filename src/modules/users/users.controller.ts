import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/request/create-user.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/auth/enums/role.enum';
import { RegisterUserDto } from './dto/request/register-user.dto';
// import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) { }

  /**
   * Post decorator represents method of request as we have used post decorator the method
   * of this API will be post.
   * so the API URL to create User will be
   * POST http://localhost:3000/users
   */
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    console.log('===create===', createUserDto);

    return await this.userService.createUser(createUserDto);
  }

  @Post('create-admin')
  async createAdmin(@Body() registerAuthDto: RegisterUserDto) {
    console.log('===createAdmin===', registerAuthDto);

    return await this.userService.createUserAdmin(registerAuthDto);
  }

  @Post('update-admin')
  async updateAdmin(@Body() registerAuthDto: RegisterUserDto) {
    console.log('===createAdmin===', registerAuthDto);

    return await this.userService.createUserAdmin(registerAuthDto);
  }

  @Get('admin')
  // @UseGuards( RolesGuard)
  // @Roles(Role.ADMIN) // Chỉ vai trò 'admin' mới truy cập được
  getAdminData() {
    return this.userService.findAllAdminUsers();
    return { message: 'This is admin data' };
  }

  @Get('user')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER) // Chỉ vai trò 'user' mới truy cập được
  getUserdata() {
    return { message: 'This is user data' };
  }

  /**
   * we have used get decorator to get all the user's list
   * so the API URL will be
   * GET http://localhost:3000/users
   */
  @Get()
  findAll(@Req() request: Request) {
    return this.userService.findAllUser();
  }

  @Get('role-user')
  findAllRoleUser(@Req() request: Request) {
    return this.userService.findAllRoleUser();
  }

  /**
   * we have used get decorator with id param to get id from request
   * so the API URL will be
   * GET http://localhost:3000/users/:id
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    const userId = Number(id);
    return this.userService.findUserById(userId);
  }

  /**
   * we have used patch decorator with id param to get id from request
   * so the API URL will be
   * PATCH http://localhost:3000/users/:id
   */
  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(+id, updateUserDto);
  }

  /**
   * we have used Delete decorator with id param to get id from request
   * so the API URL will be
   * DELETE http://localhost:3000/users/:id
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.removeUser(+id);
  }

  // test rolead
}
