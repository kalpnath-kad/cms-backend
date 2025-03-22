import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async create(data: { name: string; email: string; password: string, role: 'user' | 'admin' }) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(data.password, salt);
    const user = this.repo.create({ ...data, password: hashedPassword });
    return this.repo.save(user);
  }

  async findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  async getUsers(
    page: number,
    limit: number,
    connectedTemple?: string,
  ) {
    const query = this.repo.createQueryBuilder('user');

    if (connectedTemple) {
      query.andWhere('user.connected_temple = :temple', { temple: connectedTemple });
    }

    const [data, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, total };
  }
}



