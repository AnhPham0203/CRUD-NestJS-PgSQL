import { JwtService } from '@nestjs/jwt';
import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';


@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    // constructor(
    //     private jwtService : JwtService
    // ) {
    //     super();
    // }
    // canActivate(context: ExecutionContext): boolean {
    //     const request = context.switchToHttp().getRequest();
    //     const token = request.cookies['access_token']; // Lấy token từ cookie
    //     if (!token) {
    //         throw new UnauthorizedException('No token found');
    //     }

    //     try {
    //         const user = this.jwtService.verify(token); // Giải mã token
    //         request.user = user;  // Gắn thông tin user vào request
    //         return true;
    //     } catch (error) {
    //         throw new UnauthorizedException('Invalid token');
    //     }
    // }

}
