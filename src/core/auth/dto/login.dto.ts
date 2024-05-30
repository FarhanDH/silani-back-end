import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  password: string;

  @IsString()
  googleId: string;

  @IsString()
  facebookId: string;
}
