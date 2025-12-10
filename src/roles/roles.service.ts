import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Role } from "./role.entity";

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepo: Repository<Role>,
  ) {}

  async create(name: string) {
    const role = this.rolesRepo.create({ name });
    return this.rolesRepo.save(role);
  }

  async findByName(name: string) {
    return this.rolesRepo.findOne({ where: { name } });
  }

  async findAll() {
    return this.rolesRepo.find();
  }
}
