import { Body, Controller, Get, NotFoundException, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportTaskDto } from './dto/report-task.dto';
import { AuthGuard } from '@nestjs/passport';
import { ReportResponseDto } from './dto/response/report-user.response.dto';
import { CreateReportUserDto } from './dto/report-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UpdateReportDto } from './dto/updateReport-user.dto';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  async getReportTasks(@Query() filters: ReportTaskDto) {
    return this.reportsService.getReportTasks(filters);
  }

  @Get('user')
  async getAllReportUser(): Promise<ReportResponseDto[]> {
    // Gọi phương thức service để lấy tất cả các báo cáo người dùng
    return this.reportsService.getAllReportUser();
  }

  @Post()
  // @UseGuards(AuthGuard('jwt'))
  // @UseGuards(JwtAuthGuard)
  async createReportUser(
    @Body() createReportDto: CreateReportUserDto,
    @Req() req: any, // Lấy thông tin user từ request
  ): Promise<ReportResponseDto> {
    // const reporter = req.user; // ID của người báo cáo từ token
    const reporterId = req.user.sub; // ID của người báo cáo từ token
    return this.reportsService.createReportUser(createReportDto, reporterId);
  }

  @Put(':id')
  async resolveReport(
    @Param('id') id: number,
    @Body() updateReportDto: UpdateReportDto,
  ) {
    // Gọi service để cập nhật report
    const updatedReport = await this.reportsService.updateReportUser(id, updateReportDto);

    if (!updatedReport) {
      throw new NotFoundException(`Report with ID ${id} not found.`);
    }

    return updatedReport;
  }


}
