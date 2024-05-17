import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum Community {
  HISTORY = 'History',
  FOOD = 'Food',
  PETS = 'Pets',
  HEALTH = 'Health',
  FASHION = 'Fashion',
  EXERCISE = 'Exercise',
  OTHERS = 'Others',
}

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  body: string;

  @IsNotEmpty()
  @IsEnum(Community, {
    message: 'Please select a valid community',
  })
  community: Community;
}
