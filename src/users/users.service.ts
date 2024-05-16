import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class UsersService {
  constructor(private databaseService: DatabaseService) {}

  findByEmail(email: string) {
    const user = this.databaseService.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  }
}
