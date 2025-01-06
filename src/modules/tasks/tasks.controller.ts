import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskResponseDto } from './dto/response/taskResponseDto';

@Controller('tasks')
export class TasksController {


  constructor(private readonly tasksService: TasksService) { }

  @Get()
  async getAllTasks(): Promise<TaskResponseDto[]> {
    return this.tasksService.findAllTasks();
  }


  @Post()
  async createTask(@Body() createTaskDto: CreateTaskDto) {
    console.log("===creating task===", createTaskDto);

    const { assignedTo, ...taskData } = createTaskDto;
    return this.tasksService.createTask(taskData, assignedTo);
  }

  @Get(':id')
  async getTaskById(@Param('id') id: number) {
    return this.tasksService.findOne(id);
  }
  // @Put(':id')
  // async updateTask(@Param('id') id: number, @Body() updateTaskDto: UpdateTaskDto) {
  //   return this.tasksService.updateTask(id, updateTaskDto);
  // }

  @Put(':id')
  async updateTask(
    @Param('id', ParseIntPipe) id: number, // Parse id từ string sang number
    @Body() updateTaskDto: UpdateTaskDto
  ) {
    return this.tasksService.updateTask(id, updateTaskDto);
  }

  @Delete(':id')
  async deleteTask(@Param('id') id: number) {
    return this.tasksService.deleteTask(id);
  }
}
