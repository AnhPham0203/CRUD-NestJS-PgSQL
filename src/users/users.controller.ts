import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/request/create-user.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { Role } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
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
  async create(@Body() createUserDto: CreateUserDto) {
    // hash password

    return await this.userService.createUser(createUserDto);
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role('ADMIN') // Chỉ vai trò 'admin' mới truy cập được
  getAdminData() {
    
    return { message: 'This is admin data' };
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

  /**
   * we have used get decorator with id param to get id from request
   * so the API URL will be
   * GET http://localhost:3000/users/:id
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    const userId = Number(id);
    return this.userService.viewUser(userId);
  }

  

  /**
   * we have used patch decorator with id param to get id from request
   * so the API URL will be
   * PATCH http://localhost:3000/users/:id
   */
  @Patch(':id')
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
