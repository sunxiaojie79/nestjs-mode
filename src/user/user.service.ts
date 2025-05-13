import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Logs } from 'src/logs/logs.entity';
import { getUserDto } from './dto/get-user.dto';
import { conditionUtils } from 'src/utils/db.helper';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Logs)
    private readonly logsRepository: Repository<Logs>,
  ) {}

  findAll(query: getUserDto): Promise<User[]> {
    // SELECT * FROM user u, profile p, roles r WHERE u.id = p.userID AND u.id = r.userID
    // SELECT * FROM user u LEFT JOIN profile p ON u.id = p.userID LEFT JOIN roles r ON u.id = r.userID
    // 分页 SQL -> LIMIT 10 OFFSET 0
    // 排序 SQL -> ORDER BY username ASC

    // find方法
    const { page, limit, username, role, gender, sort } = query;
    const take = limit || 10;
    const skip = ((page || 1) - 1) * take;
    console.log('🚀 ~ UserService ~ findAll ~ skip:', skip, take);
    const order = sort === 'asc' ? 'ASC' : 'DESC';
    // return this.userRepository.find({
    //   select: {
    //     id: true,
    //     username: true,
    //     profile: {
    //       gender: true,
    //     },
    //   },
    //   relations: {
    //     profile: true,
    //     roles: true,
    //   },
    //   where: {
    //     username,
    //     roles: {
    //       id: role,
    //     },
    //     profile: {
    //       gender,
    //     },
    //   },
    //   skip,
    //   take,
    // });

    // 使用 createQueryBuilder 方法
    const obj = {
      'user.username': username,
      'roles.id': role,
      'profile.gender': gender,
    };
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .leftJoinAndSelect('user.roles', 'roles');
    const newQueryBuilder = conditionUtils(queryBuilder, obj);
    return newQueryBuilder
      .orderBy('user.username', order)
      .skip(skip)
      .take(take)
      .getMany();
  }

  find(username: string): Promise<User> {
    return this.userRepository.findOne({ where: { username } });
  }

  findOne(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }

  async create(user: User): Promise<User> {
    const userTmp = await this.userRepository.create(user);
    // try {
    const res = await this.userRepository.save(userTmp);
    return res;
    // } catch (error) {
    //   console.log('🚀 ~ UserService ~ create ~ error:', error);
    //   if (error.errno === 1062) {
    //     throw new HttpException(error.sqlMessage, 500);
    //   }
    // }
  }

  async update(id: number, user: Partial<User>) {
    // 只适合单模型的更新，不适合有关系的模型更新
    // return this.userRepository.update(id, user);
    const userTmp = await this.findProfile(id);
    const newUser = this.userRepository.merge(userTmp, user);
    return this.userRepository.save(newUser);
  }

  async remove(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    return this.userRepository.remove(user);
  }

  findProfile(id: number) {
    return this.userRepository.findOne({
      where: { id },
      relations: ['profile'],
    });
  }

  async findUserLogs(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    return this.logsRepository.find({
      where: { user },
      // relations: { user: true },
    });
  }

  async findLogsByGroup(id: number) {
    // SELECT logs.result as result, COUNT(logs.result) as count FROM logs, user WHERE user.id = logs.userID AND user.id = 1 GROUP BY logs.result
    const logs = await this.logsRepository
      .createQueryBuilder('logs')
      .select('logs.result', 'result')
      .addSelect('COUNT("logs.result")', 'count')
      .leftJoinAndSelect('logs.user', 'user')
      .where('user.id = :id', { id })
      .groupBy('result')
      .orderBy('result', 'DESC')
      .getRawMany();
    // const logs = await this.logsRepository.query(`SELECT * From logs`);
    return logs;
  }
}
