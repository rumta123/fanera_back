import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import { User } from "../users/users.entity";

@Entity("roles")
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string; // например: "admin", "user"

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];
}
