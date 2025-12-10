import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-jwt";
import { Request } from "express";
import { UsersService } from "../users/users.service";

// Функция для получения JWT из cookie
const cookieExtractor = (req: Request): string | null => {
  const cookies = req.cookies as Record<string, string> | undefined;

  if (cookies && typeof cookies.access_token === "string") {
    return cookies.access_token;
  }

  return null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: cookieExtractor, // <-- Берём токен из cookies
      secretOrKey: "jwt_secret_key",
    });
  }

  async validate(payload: any) {
    const user = await this.usersService.findByEmail(payload.email);

    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    const roles = user.roles.map((role) => role.name);

    return {
      id: payload.sub,
      userId: user.id,
      email: user.email,
      roles,
    };
  }
}
