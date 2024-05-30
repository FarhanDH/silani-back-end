import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInGoogleDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  avatarUrl: string;

  @IsString()
  @IsNotEmpty()
  googleId: string;

  @IsString()
  @IsNotEmpty()
  accessToken: string;
}
