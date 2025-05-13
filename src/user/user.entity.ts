import { Logs } from '../logs/logs.entity';
import { Roles } from '../roles/roles.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
  OneToOne,
  AfterInsert,
  AfterRemove,
} from 'typeorm';
import { Profile } from './profile.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @OneToMany(() => Logs, (logs) => logs.user)
  logs: Logs[];

  @ManyToMany(() => Roles, (roles) => roles.users, {
    cascade: ['insert', 'update'],
  })
  @JoinTable({ name: 'users_roles' })
  roles: Roles[];

  @OneToOne(() => Profile, (profile) => profile.user, {
    cascade: true,
  })
  profile: Profile;

  @AfterInsert()
  afterInsert() {
    console.log('🚀 ~ User ~ afterInsert ~ this:', this);
  }

  @AfterRemove()
  afterRemove() {
    console.log('🚀 ~ User ~ afterRemove ~ this:', this);
  }
}
