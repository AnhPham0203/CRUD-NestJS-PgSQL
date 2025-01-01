import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportTaskDto } from './dto/report-task.dto';
import { AuthGuard } from '@nestjs/passport';
import { ReportResponseDto } from './dto/response/report-user.response.dto';
import { CreateReportUserDto } from './dto/report-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  async getReportTasks(@Query() filters: ReportTaskDto) {
    return this.reportsService.getReportTasks(filters);
  }

  @Post()
  // @UseGuards(AuthGuard('jwt'))
  @UseGuards(JwtAuthGuard)
  async createReport(
    @Body() createReportDto: CreateReportUserDto,
    @Req() req: any, // Lấy thông tin user từ request
  ): Promise<ReportResponseDto> {
    const reporter = req.user; // ID của người báo cáo từ token
    const reporterId = req.user.sub; // ID của người báo cáo từ token
    return this.reportsService.createReportUser(createReportDto, reporterId);
  }


}
