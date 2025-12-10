// src/users/users.service.ts
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./users.entity";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  // ✅ Реализуем findOne как асинхронный метод, возвращающий Promise<User>
  async findOne(user_id: number): Promise<User> {
    const user = await this.usersRepo.findOneBy({ id: user_id });
    if (!user) {
      throw new NotFoundException(`Пользователь с ID ${user_id} не найден`);
    }
    return user;
  }

  async create(name: string, email: string, password: string, phone: string) {
    const hash = await bcrypt.hash(password, 10);
    const user = this.usersRepo.create({ name, email, password: hash, phone });
    return this.usersRepo.save(user);
  }

  // ✅ Исправляем: ищем по полю `email`, а не по `user_id`
  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepo.findOneBy({ email });
  }
}
