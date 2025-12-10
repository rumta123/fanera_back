import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsArray,
  IsIn,
  IsPhoneNumber,
} from "class-validator";

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsPhoneNumber() // Валидация номера телефона
  phone?: string;

  @IsString()
  @IsOptional() // или @IsNotEmpty(), если обязательно
  name?: string;

  @IsOptional()
  @IsArray()
  @IsIn(["user", "admin", "manager", "technolog"], { each: true })
  roles?: string[];
}
