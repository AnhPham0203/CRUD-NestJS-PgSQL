import { forwardRef, HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entities';
import { Task } from './entities/task.entities';
import { UserService } from '../users/users.service';
import { plainToInstance } from 'class-transformer';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UserResponseDto } from '../users/dto/response/user.responseDto';
import { TaskResponseDto } from './dto/response/taskResponseDto';
import { ReportTaskDto } from '../reports/dto/report-task.dto';

@Injectable()
export class TasksService {

    constructor(
        @InjectRepository(Task)
        private readonly taskRepository: Repository<Task>,

        @Inject(forwardRef(() => UserService))
        private readonly usersService: UserService,
      ) {}
      
      // async findAllTasks(): Promise<TaskResponseDto[]> {
      //   const tasks = await this.taskRepository.find({
      //     relations: ['assignedTo'], // Load thông tin User liên quan
      //   });
      
      //   return plainToInstance(TaskResponseDto, tasks, { excludeExtraneousValues: true });
      // }

      async findAllTasks(): Promise<TaskResponseDto[]> {
        const tasks = await this.taskRepository.find({
          relations: ['assignedTo'], // Load thông tin User liên quan
        });
      
        // Chuyển đổi từng task, đảm bảo `assignedTo` là `UserResponseDto`
        const tasksWithUserResponse = tasks.map((task) => {
          const taskDto = plainToInstance(TaskResponseDto, task, { excludeExtraneousValues: true });
      
          if (task.assignedTo) {
            taskDto.assignedTo = plainToInstance(UserResponseDto, task.assignedTo, { excludeExtraneousValues: true });
          }
      
          return taskDto;
        });
      
        return tasksWithUserResponse;
      }

      //get report task
      async getReportTasksService(filters: ReportTaskDto): Promise<Task[]> {
        const query = this.taskRepository.createQueryBuilder('task');
    
        if (filters.startDate) {
          query.andWhere('task.createdAt >= :startDate', { startDate: filters.startDate });
        }
        if (filters.endDate) {
          query.andWhere('task.createdAt <= :endDate', { endDate: filters.endDate });
        }
        if (filters.status) {
          query.andWhere('task.status = :status', { status: filters.status });
        }
    
        return query.getMany();
      }
      

      async findOne(id: number): Promise<Task> {
        const task = await this.taskRepository.findOne({ where: { id }, relations: ['assignedTo'] });
        if (!task) {
          throw new NotFoundException(`Task with ID ${id} not found`);
        }
        return task;
      }
      //Save task
      async saveTask(taskData: Partial<Task>): Promise<Task> {
        return this.taskRepository.save(taskData);
      }

        // Tạo một task mới
    async createTask(taskData: Partial<Task>, assignedUserId?: number): Promise<Task> {
      // const task = this.taskRepository.create(taskData);

      if (assignedUserId) {
        const userDto = await this.usersService.findUserById(assignedUserId);
        if (!userDto) {
          throw new NotFoundException(`User with ID ${assignedUserId} not found`);
        }
        // const user = plainToInstance(UserResponseDto, userDto);
        
        taskData.assignedTo = userDto;
    }

    return this.taskRepository.save(taskData);
  }

   // Cập nhật task
   async updateTask(id: number, updateData: UpdateTaskDto): Promise<string> {
    const task = await this.findOne(id);
    Object.assign(task, updateData);

    if (updateData.assignedTo) {
      const userDto = await this.usersService.findUserById(updateData.assignedTo);
      if (!userDto) {
        throw new NotFoundException(`User with ID ${updateData.assignedTo} not found`);
      }

      const user = plainToInstance(UserResponseDto, userDto);
      task.assignedTo = user;
    }
      task.updatedAt= new Date()
     this.taskRepository.save(task);
     return `Task with id ${id} updated successfully.`
  }

  // Xóa task
  async deleteTask(id: number): Promise<{ message: string }> {
    const task = await this.findOne(id);
      if (!task) {
          throw new HttpException(
            `Task with id ${id} does not exist.`,
            HttpStatus.NOT_FOUND,
          );
        }
    await this.taskRepository.remove(task);
    return { message: `Task with id ${id} deleted successfully.` };
  }
  
}
