import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsDateString()
  @IsOptional()
  dateOfBirth: string;

  @IsString()
  @IsOptional()
  avatarUrl: string;

  @IsString()
  @IsOptional()
  googleId: string;

  @IsString()
  @IsOptional()
  facebookId: string;

  @IsString()
  @IsOptional()
  accessToken: string;
}
