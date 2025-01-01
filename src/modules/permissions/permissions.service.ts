import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { Permission } from './entities/permission.entities';

@Injectable()
export class PermissionsService {

    constructor(
        @InjectRepository(Permission)
        private permissionRepository: Repository<Permission>,
      ) {}
    
      async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
        const {name} = createPermissionDto;
        const isExitName= await this.permissionRepository.find({where : {name}})
        if(isExitName.length!==0){
          throw new HttpException(
                 `Permission with name ${name} is duplicate.`,
                 HttpStatus.FORBIDDEN,
               );
          
        }

        const permission = this.permissionRepository.create(createPermissionDto);
        return this.permissionRepository.save(permission);
      }
    
      findAll(): Promise<Permission[]> {
        return this.permissionRepository.find();
      }
    
      findOne(id: number): Promise<Permission> {
        return this.permissionRepository.findOne({ where: { id } });
      }
    
      async delete(id: number): Promise<void> {
        await this.permissionRepository.delete(id);
      }

}
