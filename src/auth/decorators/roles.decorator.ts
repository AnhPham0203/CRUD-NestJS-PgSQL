// import { SetMetadata } from '@nestjs/common';

// export const Roles = (...roles: string[]) => SetMetadata('role', roles);


import { SetMetadata } from '@nestjs/common';

// Nhận vào một chuỗi đại diện cho vai trò duy nhất
export const Role = (role: string) => SetMetadata('role', role);

