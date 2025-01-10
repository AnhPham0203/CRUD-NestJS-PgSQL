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
import { UpdateReportDto } from './dto/updateReport-user.dto';

@Injectable()
export class ReportsService {


  constructor(
    @InjectRepository(ReportUser)
    private readonly reportUserRepository: Repository<ReportUser>,

    private readonly usersService: UserService,
    private readonly tasksService: TasksService
  ) { }


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
      reporter: { id: reporter.id },
      reportedUser: { id: reportedUser.id },
      reason,
      status: 'pending', // Trạng thái mặc định
    });

    // Lưu vào database
    await this.reportUserRepository.save(report);

    // Trả về DTO
    return plainToInstance(ReportResponseDto, report, { excludeExtraneousValues: true });
  }

  async updateReportUser(
    reportId: number,
    updateReportDto: UpdateReportDto
  ): Promise<ReportUser> {
    const { status, reason, resolvedById, resolvedAt } = updateReportDto;

    // Tìm report dựa vào reportId
    const report = await this.reportUserRepository.findOne({
      where: { id: reportId },
      relations: ['reporter', 'reportedUser', 'resolvedBy'], // Nạp thông tin liên quan
    });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    // Cập nhật thông tin nếu có
    if (status) {
      report.status = status;
    }
    if (reason) {
      report.reason = reason;
    }
    if (resolvedById) {
      const resolvedBy = await this.usersService.findUserById(resolvedById);
      if (!resolvedBy) {
        throw new NotFoundException('Resolved user not found');
      }
      report.resolvedBy = resolvedBy;
    }
    if (resolvedAt) {
      report.resolveddAt = resolvedAt;
    }

    // Lưu report đã cập nhật vào database
    return await this.reportUserRepository.save(report);
  }


  async getAllReportUser(): Promise<ReportResponseDto[]> {
    // Tìm tất cả các báo cáo người dùng
    const reports = await this.reportUserRepository.find({
      relations: ['reportedUser', 'reporter'], // Join với các bảng liên quan (User)
    });
    // console.log("===reports===", reports);

    // Chuyển đổi đối tượng báo cáo thành DTO
    return reports.map((report) =>
      plainToInstance(ReportResponseDto, {
        ...report, // Spread toàn bộ các thuộc tính của report
        reportedUser: report.reportedUser.username, // Ghi đè thuộc tính `reportedUser`
        reporter: report.reporter.username, // Ghi đè thuộc tính `reporter`
        resolvedBy: report.resolvedBy?.username, // Ghi đè thuộc tính `reporter`
      })
    );
  }

}
