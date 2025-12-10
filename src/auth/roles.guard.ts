import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";

interface RequestUser {
  id: number;
  email: string;
  roles: string[];
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      "roles",
      context.getHandler(),
    );
    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest<{ user: RequestUser }>();
    const user = request.user;

    if (!user || !user.roles) {
      throw new ForbiddenException("User not found or roles missing");
    }

    const hasRole = user.roles.some((role) => requiredRoles.includes(role));
    if (!hasRole) {
      throw new ForbiddenException(
        "You do not have permission to perform this action",
      );
    }

    return true;
  }
}
