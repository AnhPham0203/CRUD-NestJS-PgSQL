import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from '../permissions/entities/permission.entities';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from './entities/role.entities';
import { User } from '../users/entities/user.entities';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    @InjectRepository(Permission)
    private usersRepository: Repository<User>,
  ) { }

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const permissions = await this.permissionRepository.findByIds(createRoleDto.permissionIds);
    const { name } = createRoleDto;
    const isExitName = await this.roleRepository.find({ where: { name } })
    if (isExitName.length !== 0) {
      throw new HttpException(
        `Role with name ${name} is duplicate.`,
        HttpStatus.FORBIDDEN,
      );

    }

    const role = this.roleRepository.create({ ...createRoleDto, permissions });
    return this.roleRepository.save(role);
  }

  findAll(): Promise<Role[]> {
    return this.roleRepository.find({ relations: ['permissions'] });
  }

  findOne(id: number): Promise<Role> {
    return this.roleRepository.findOne({ where: { name: 'admin' } });
  }

  findRoleAdmin(): Promise<Role> {
    return this.roleRepository.findOne({ where: { name: 'admin' } });
  }

  findRoleUser(): Promise<Role> {
    return this.roleRepository.findOne({ where: { name: 'user' } });
  }

  async update(id: number, updateRoleDto: CreateRoleDto): Promise<Role> {
    const permissions = await this.permissionRepository.findByIds(updateRoleDto.permissionIds);
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) throw new Error('Role not found');
    Object.assign(role, { ...updateRoleDto, permissions });
    return this.roleRepository.save(role);
  }

  async delete(id: number): Promise<void> {
    const users = await this.usersRepository.find({ where: { role: { id } }, relations: ['roles', 'roles.permissions'] });
    // Gán role của mỗi user thành null
    for (const user of users) {
      user.role = null; // Đặt role của user thành null
      await this.usersRepository.save(user); // Lưu lại
    }
  }

}
