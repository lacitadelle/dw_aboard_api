import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class PostsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(
    createPostDto: CreatePostDto,
    user: {
      sub: number;
      email: string;
    },
  ) {
    try {
      return await this.databaseService.post.create({
        data: { userId: user.sub, ...createPostDto },
      });
    } catch (e) {
      throw new InternalServerErrorException('Unable to post');
    }
  }

  async findAll(community?: string, keywords?: string) {
    // Prepare statement for the while clause. Empty objects are ignored by Prisma.
    const whereClause = {
      AND: [
        community ? { community } : {},
        keywords
          ? {
              OR: [
                { title: { contains: keywords } },
                { body: { contains: keywords } },
              ],
            }
          : {},
      ],
    };
    let posts = [];
    try {
      posts = await this.databaseService.post.findMany({
        where: whereClause,
        include: {
          user: {
            select: {
              name: true, // the post author's name
            },
          },
        },
      });
    } catch (e) {
      throw new InternalServerErrorException('Unable to retrieve posts');
    }

    if (posts.length === 0)
      throw new HttpException('No matching results', HttpStatus.NOT_FOUND);
    return posts;
  }

  async findOne(id: number) {
    let post = {};
    try {
      post = await this.databaseService.post.findUnique({
        where: {
          id,
        },
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
      });
    } catch (e) {
      throw new InternalServerErrorException();
    }

    if (!post) {
      throw new HttpException(
        `Post with id #${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return post;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
