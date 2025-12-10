// src/user-workshops/user-workshop.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserWorkshop } from "./user-workshop.entity";
import { AssignUserWorkshopDto } from "./dto/assign-user-workshop.dto";
import { UsersService } from "../users/users.service";
import { WorkshopService } from "../workshops/workshops.service";

@Injectable()
export class UserWorkshopService {
  constructor(
    @InjectRepository(UserWorkshop)
    private userWorkshopRepository: Repository<UserWorkshop>,
    private UsersService: UsersService, // для проверки существования
    private workshopService: WorkshopService, // пользователя и цеха
  ) {}

  async assignToWorkshop(dto: AssignUserWorkshopDto): Promise<UserWorkshop> {
    // Проверяем, что пользователь и цех существуют
    await this.UsersService.findOne(dto.user_id);
    await this.workshopService.findOne(dto.workshop_id);

    // Проверяем, не назначено ли уже
    const existing = await this.userWorkshopRepository.findOneBy({
      user_id: dto.user_id,
      workshop_id: dto.workshop_id,
      position: dto.position,
    });

    if (existing) {
      throw new BadRequestException("Пользователь уже привязан к этому цеху");
    }

    const relation = this.userWorkshopRepository.create(dto);
    return this.userWorkshopRepository.save(relation);
  }

  async removeAssignment(user_id: number, workshop_id: number): Promise<void> {
    const result = await this.userWorkshopRepository.delete({
      user_id,
      workshop_id,
    });
    if (result.affected === 0) {
      throw new NotFoundException("Привязка не найдена");
    }
  }

  async getWorkshopsByUserId(user_id: number): Promise<UserWorkshop[]> {
    return this.userWorkshopRepository.findBy({ user_id });
  }

  async getUsersByWorkshopId(workshop_id: number): Promise<UserWorkshop[]> {
    return this.userWorkshopRepository.findBy({ workshop_id });
  }
}
