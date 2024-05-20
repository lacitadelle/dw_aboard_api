import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user?.email !== email) {
      throw new UnauthorizedException();
    }
    return {
      access_token: await this.jwtService.signAsync(user),
    };
  }
}
