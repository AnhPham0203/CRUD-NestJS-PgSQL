import { UserService } from 'src/modules/users/users.service';
import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UploadFileService } from './upload-file.service';
import { FileInterceptor, MulterModule } from '@nestjs/platform-express';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { diskStorage } from 'multer';
import * as fs from 'fs'; // 

@Controller('upload')
export class UploadFileController {
  constructor(
    private readonly usersService: UserService
  ) {

  }

  @Post('avatar')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './uploads/avatars',
        filename: (req, file, callback) => {
          const filePath = `./uploads/avatars/${file.originalname}`;
          
          // Kiểm tra nếu file đã tồn tại
          if (fs.existsSync(filePath)) {
            // Ghi đè file cũ (tự động lưu file mới)
            console.log(`File ${file.originalname} đã tồn tại, sẽ ghi đè.`);
          }
        
          callback(null, file.originalname); // Dùng tên file gốc
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
    }),
  )
  uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Body('userId') userId: number, // Nhận ID người dùng từ body
  ) {
    console.log("file==", file);

    const avatarPath = `/uploads/avatars/${file.filename}`;

    // Lưu đường dẫn avatar vào database
    this.usersService.updateUserAvatar(userId, avatarPath);

    return avatarPath


  }
}
