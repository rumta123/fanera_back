import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Request,
  HttpCode,
  HttpStatus,
  Put,
  Delete,
  Param,
  Res,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./jwt.guard";
import { RegisterDto } from "../dto/register.dto";
import { LoginDto } from "../dto/login.dto";
import { Roles } from "./roles.decorator";
import { RolesGuard } from "./roles.guard";
import express from "express";
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.authService.register(registerDto);

    return {
      message: "User registered successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        roles: user.roles.map((role) => role.name),
      },
    };
  }

  @Post("login")
  @HttpCode(200)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const { access_token, user } = await this.authService.login(loginDto);

    // Устанавливаем токен в защищённый cookie
    res.cookie("access_token", access_token, {
      httpOnly: true, // ⛔ Нельзя прочитать через JS
      // secure: true, // ⛔ Только HTTPS
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict", // ⛔ Защита от CSRF
      maxAge: 1000 * 60 * 60 * 24, // 1 день
    });

    return { user };
  }

  @UseGuards(JwtAuthGuard)
  @Get("profile")
  getProfile(@Request() req) {
    return req.user as unknown;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "manager")
  @Get("users")
  async getAllUsers() {
    const users = await this.authService.findAllUsers();
    return users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      roles: user.roles.map((r) => r.name),
    }));
  }

  // 🔹 PUT — обновление пользователя
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "manager")
  @Put("update/:id")
  async updateUser(
    @Param("id") id: number,
    @Body() updateData: Partial<RegisterDto>,
  ) {
    const updatedUser = await this.authService.updateUser(id, updateData);
    return {
      message: "User updated successfully",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        roles: updatedUser.roles.map((role) => role.name),
      },
    };
  }

  // 🔹 DELETE — удаление пользователя
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @Delete("delete/:id")
  async deleteUser(@Param("id") id: number) {
    await this.authService.deleteUser(id);
    return { message: "User deleted successfully" };
  }
}
