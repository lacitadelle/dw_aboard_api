import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  ValidationPipe,
  Request,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('posts/:postId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(AuthGuard)
  @Post() // Here, user.sub is the commenter.
  create(
    @Param('postId') postId: string,
    @Body(ValidationPipe) createCommentDto: CreateCommentDto,
    @Request() req,
  ) {
    return this.commentsService.create(+postId, createCommentDto, req.user);
  }

  @Get()
  findAll(@Param('postId') postId: string) {
    return this.commentsService.findAll(+postId);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentsService.remove(+id);
  }
}
