import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

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
    create(@Body() createUserDto: CreateUserDto) {
        console.log(createUserDto);

        return this.userService.createUser(createUserDto);
    }

    /**
     * we have used get decorator to get all the user's list
     * so the API URL will be
     * GET http://localhost:3000/users
     */
    @Get()
    findAll() {
        return this.userService.findAllUser();
    }

    /**
     * we have used get decorator with id param to get id from request
     * so the API URL will be
     * GET http://localhost:3000/users/:id
     */
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.userService.viewUser(+id);
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

}
