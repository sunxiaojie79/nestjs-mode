import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Repository } from 'typeorm';
import { Roles } from './roles.entity';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Roles)
    private readonly rolesRepository: Repository<Roles>,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    const role = await this.rolesRepository.create(createRoleDto);
    return this.rolesRepository.save(role);
  }

  findAll() {
    return this.rolesRepository.find();
  }

  findOne(id: number) {
    return this.rolesRepository.findOne({ where: { id } });
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const role = await this.findOne(id);
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    const updatedRole = this.rolesRepository.merge(role, updateRoleDto);
    return this.rolesRepository.save(updatedRole);
  }

  remove(id: number) {
    return this.rolesRepository.delete(id);
  }
}
