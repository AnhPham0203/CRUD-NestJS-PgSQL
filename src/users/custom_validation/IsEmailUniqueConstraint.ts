import { User } from './../entities/user.entities';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, ValidationError } from 'class-validator';
import { UserService } from '../users.service';  // Import service để kiểm tra email trong DB

@Injectable()
@ValidatorConstraint({ async: true })
export class IsEmailUniqueConstraint implements ValidatorConstraintInterface {
    constructor(
        @Inject(forwardRef(() => UserService)) private readonly userService: UserService,  // Sử dụng forwardRef để inject UserService
    ) { }

    async validate(value: string, args: ValidationArguments): Promise<boolean> {
        // Kiểm tra trong cơ sở dữ liệu nếu email đã tồn tại
        const user = await this.userService.findByEmail(value);
        return !user;  // Nếu có user trả về null, nghĩa là email chưa trùng
    }

    defaultMessage(args: ValidationArguments): string {
        return 'Email is already in use';
    }
}
