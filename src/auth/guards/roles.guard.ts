
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';
import { Role } from '../enums/role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { jwtConstants } from '../constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();

    // Lấy token từ header Authorization
    const authorization = request.headers['authorization'];
    if (!authorization || !authorization.startsWith('Bearer ')) {
      console.log('Authorization header is missing or invalid.');
      return false;
    }

    const token = authorization.split(' ')[1];


    try {
      // Giải mã JWT
      const decoded = jwt.verify(token, jwtConstants.secret); // Đổi 'yourSecretKey' thành secret bạn dùng để ký token
      console.log('Decoded Token:', decoded);
  
      // Gán user vào request (nếu cần)
      request.user = decoded;
  
      if (!requiredRoles) {
        return true;
      }
  
      // Kiểm tra role từ đối tượng decoded
      const userRoles = Array.isArray(decoded['role']) ? decoded['role'] : [decoded['role']];
  
      // Lấy quyền từ đối tượng Role (giả sử mỗi role có tên 'name')
      const userRoleNames = userRoles.map((role) => role.name.toUpperCase()); // role.name nếu là đối tượng Role
  
      // Kiểm tra quyền của người dùng có trong requiredRoles không
      return requiredRoles.some((role) =>
        userRoleNames.includes(role.toUpperCase())
      );
    } catch (err) {
      console.log('Invalid or expired token:', err.message);
      return false;
    }
  }
}
