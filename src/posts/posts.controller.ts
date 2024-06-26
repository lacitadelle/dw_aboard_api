import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UseGuards,
  Request,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Community } from './dto/create-post.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body(ValidationPipe) createPostDto: CreatePostDto, @Request() req) {
    return this.postsService.create(createPostDto, req.user);
  }

  @Get('communities')
  listCommunities() {
    return { communities: Object.values(Community) };
  }

  @Get()
  findAll(
    @Query('community') community?: Community,
    @Query('keywords') keywords?: string,
  ) {
    if (community && !Object.values(Community).includes(community)) {
      throw new BadRequestException('Invalid community provided');
    }
    return this.postsService.findAll(community, keywords);
  }

  @UseGuards(AuthGuard)
  @Get('user')
  findOwn(
    @Request() req,
    @Query('community') community?: Community,
    @Query('keywords') keywords?: string,
  ) {
    if (community && !Object.values(Community).includes(community)) {
      throw new BadRequestException('Invalid community provided');
    }
    return this.postsService.findOwn(req.user.id, community, keywords);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Request() req,
  ) {
    return this.postsService.update(+id, updatePostDto, req.user);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.postsService.remove(+id, req.user);
  }
}
