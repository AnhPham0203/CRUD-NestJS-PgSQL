import { TasksService } from './../tasks/tasks.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../tasks/entities/task.entities';
import { ReportTaskDto } from './dto/report-task.dto';
import { CreateReportUserDto } from './dto/report-user.dto';
import { plainToInstance } from 'class-transformer';
import { ReportResponseDto } from './dto/response/report-user.response.dto';
import { ReportUser } from './entities/report-user.entities';
import { UserService } from '../users/users.service';

@Injectable()
export class ReportsService {
  

    constructor(
      @InjectRepository(ReportUser)
        private readonly reportUserRepository: Repository<ReportUser>,

        private readonly usersService:UserService,
        private readonly tasksService:TasksService
      ) {}


    async getReportTasks(filters: ReportTaskDto): Promise<Task[]> {
       return this.tasksService.getReportTasksService(filters)
      }


      async createReportUser(createReportDto: CreateReportUserDto, reporterId: number): Promise<ReportResponseDto> {
        const { reportedUserId, reason } = createReportDto;
      
        // Lấy thông tin người báo cáo
        const reporter = await this.usersService.findUserById(reporterId);
        if (!reporter) {
          throw new NotFoundException('Reporter not found');
        }
      
        // Lấy thông tin người bị báo cáo
        const reportedUser = await this.usersService.findUserById(reportedUserId);
        if (!reportedUser) {
          throw new NotFoundException('Reported user not found');
        }
      
        // Tạo report
        const report = this.reportUserRepository.create({
          reporter,
          reportedUser,
          reason,
          status: 'pending', // Trạng thái mặc định
        });
      
        // Lưu vào database
        await this.reportUserRepository.save(report);
      
        // Trả về DTO
        return plainToInstance(ReportResponseDto, report, { excludeExtraneousValues: true });
      }
      
}
