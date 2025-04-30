import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Logs } from 'src/logs/logs.entity';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Logs)
    private readonly logsRepository: Repository<Logs>,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  find(username: string): Promise<User> {
    return this.userRepository.findOne({ where: { username } });
  }

  findOne(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }

  async create(user: User): Promise<User> {
    const userTmp = await this.userRepository.create(user);
    return this.userRepository.save(userTmp);
  }

  update(id: number, user: Partial<User>) {
    return this.userRepository.update(id, user);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
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
