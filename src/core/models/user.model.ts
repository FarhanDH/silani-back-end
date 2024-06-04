import {
  IsDate,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class RegisterUserRequest {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  avatarUrl: string;

  @IsDateString()
  @IsOptional()
  dateOfBirth?: string | null;
}

export class LoginUserRequest {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class UserResponse {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  dateOfBirth?: string | null;

  @IsString()
  @IsNotEmpty()
  avatarUrl: string;

  @IsString()
  @IsOptional()
  googleId?: string | null;

  @IsString()
  @IsOptional()
  facebookId?: string | null;

  @IsDate()
  @IsNotEmpty()
  createdAt: Date;

  @IsDate()
  @IsNotEmpty()
  updatedAt: Date;

  @IsOptional()
  token?: {
    accessToken: string;
    expiresIn: string;
  };
}

export class GoogleUserRequest {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsOptional()
  avatarUrl: string | null;

  @IsString()
  @IsNotEmpty()
  googleId: string;
}
