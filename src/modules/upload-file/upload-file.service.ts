import { UserService } from 'src/modules/users/users.service';
import { Body, Injectable, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadFileService {

    constructor(
        private readonly usersService: UserService
    ) {

    }
    // @UseInterceptors(
    //     FileInterceptor('avatar', {
    //         storage: diskStorage({
    //             destination: './uploads/avatars',
    //             filename: (req, file, callback) => {
    //                 const uniqueSuffix = uuidv4() + extname(file.originalname);
    //                 callback(null, uniqueSuffix);
    //             },
    //         }),
    //         fileFilter: (req, file, callback) => {
    //             if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
    //                 return callback(new Error('Only image files are allowed!'), false);
    //             }
    //             callback(null, true);
    //         },
    //     }),
    // )
    // async uploadAvatar(
    //     @UploadedFile() file: Express.Multer.File,
    //     @Body('userId') userId: number, // Nhận ID người dùng từ body
    // ) {
    //     const avatarPath = `/uploads/avatars/${file.filename}`;

    //     // Lưu đường dẫn avatar vào database
    //     await this.usersService.updateUserAvatar(userId, avatarPath);

    //     return {
    //         message: 'Avatar uploaded successfully!',
    //         avatar: avatarPath,
    //     };
    // }

}
