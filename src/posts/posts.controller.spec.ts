import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { Post } from '@prisma/client';
import { DatabaseService } from '../database/database.service';
import { DatabaseModule } from '../database/database.module';
import { JwtService } from '@nestjs/jwt';
import { HttpException } from '@nestjs/common';

describe('PostsController', () => {
  let controller: PostsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      controllers: [PostsController],
      providers: [PostsService, DatabaseService, JwtService],
    }).compile();

    controller = module.get<PostsController>(PostsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should retrieve array of Posts', async () => {
      const posts: Post[] = await controller.findAll();
      expect(posts.length).toBeGreaterThanOrEqual(1);
    });

    it('should return status 404 no post matches a query', async () => {});
  });

  describe('findOne', () => {
    it('should retrieve a post using a valid ID', async () => {
      const post = await controller.findOne('1');
      expect(post).toBeDefined();
    });

    it("should throw a HttpException if it can't find a post", async () => {
      try {
        await controller.findOne(`${Number.MAX_VALUE}`);
      } catch (e) {
        expect(e).toBeInstanceOf(HttpException);
      }
    });
  });
});
