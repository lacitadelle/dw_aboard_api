import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import AuthenticatedUser from '../definitions/user';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class CommentsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(
    postId: number,
    createCommentDto: CreateCommentDto,
    user: AuthenticatedUser,
  ) {
    try {
      return await this.databaseService.comment.create({
        data: {
          userId: user.sub,
          postId,
          ...createCommentDto,
        },
      });
    } catch (e) {
      throw new InternalServerErrorException('Unable to create comment');
    }
  }

  async findAll(postId: number) {
    try {
      return await this.databaseService.comment.findMany({
        where: {
          postId,
        },
      });
    } catch {
      throw new InternalServerErrorException('Unable to fetch comments');
    }
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
