import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Roles } from '../roles/roles.entity';

@Entity()
export class Menus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  path: string;

  @Column()
  order: number;

  @Column()
  acl: string;

  @ManyToMany(() => Roles, (roles) => roles.menus)
  @JoinTable({
    name: 'role_menus',
  })
  role: Roles;
}
