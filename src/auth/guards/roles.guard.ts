import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string>('role', context.getHandler());
    if (!requiredRoles) {
      return true; // Không yêu cầu vai trò nào
    }

    const { user } = context.switchToHttp().getRequest();
    console.log("User========", user);
    
    if (!user || !user.role) {
      throw new ForbiddenException('No roles found for the user');
    }

    const hasRole = requiredRoles.includes(user.role);
    if (!hasRole) {
      throw new ForbiddenException('You do not have the required roles');
    }

    return true;
  }
}
