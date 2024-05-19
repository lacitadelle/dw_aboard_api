import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { DatabaseService } from '../database/database.service';
import { Post } from '@prisma/client';

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
        keywords ? { title: { contains: keywords } } : {},
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
      throw new InternalServerErrorException('Database Error');
    }

    if (!post) {
      throw new HttpException(
        `Post with id #${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return post;
  }

  async update(
    id: number,
    updatePostDto: UpdatePostDto,
    user: { sub: string; email: string },
  ) {
    // check if the post we want to update exist
    let post: Post;
    try {
      post = await this.databaseService.post.findUnique({
        where: {
          id,
        },
      });
    } catch (e) {
      throw new InternalServerErrorException();
    }

    if (!post)
      throw new HttpException(
        'Post with id #${id} not found',
        HttpStatus.NOT_FOUND,
      );

    // check if the user who made the request is the post's owner
    if (post.userId !== +user.sub) {
      throw new HttpException(
        'You can only edit your own post',
        HttpStatus.UNAUTHORIZED,
      );
    }

    // if all was fine, proceed to update the post
    try {
      return this.databaseService.post.update({
        where: {
          id,
        },
        data: updatePostDto,
      });
    } catch (e) {
      throw new InternalServerErrorException('Database Error');
    }
  }

  async remove(id: number, user: { sub: string; email: string }) {
    // check if the post we want to delete exist
    let post: Post;
    try {
      post = await this.databaseService.post.findUnique({
        where: {
          id,
        },
      });
    } catch (e) {
      throw new InternalServerErrorException();
    }

    if (!post)
      throw new HttpException(
        'Post with id #${id} not found',
        HttpStatus.NOT_FOUND,
      );

    // check if the user who made the request is the post's owner
    if (post.userId !== +user.sub) {
      throw new HttpException(
        'You can only delete your own post',
        HttpStatus.UNAUTHORIZED,
      );
    }

    // if all was fine, proceed to update the post
    try {
      return this.databaseService.post.delete({
        where: {
          id,
        },
      });
    } catch (e) {
      throw new InternalServerErrorException('Database Error');
    }
  }
}
