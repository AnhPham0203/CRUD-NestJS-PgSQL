import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { User } from 'src/modules/users/entities/user.entities';
import { Permission } from 'src/modules/permissions/entities/permission.entities';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @OneToMany(() => User, (user) => user.role)
  users: User[];

  @ManyToMany(() => Permission, (permission) => permission.roles)
  @JoinTable() // Tạo bảng trung gian role_permissions
  permissions: Permission[];

  // @ManyToMany(() => Permission, (permission) => permission.roles)
  // @JoinTable({
  //   name: 'roles_permissions_permissions', // Name of the join table
  //   joinColumn: { name: 'rolesId', referencedColumnName: 'id' },
  //   inverseJoinColumn: { name: 'permissionsId', referencedColumnName: 'id' },
  // })
  // permissions: Permission[];
}
