import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class CreateAIChatRequest {
  @IsString()
  @IsNotEmpty()
  prompt: string;
}

export class AIChatResponse {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  prompt: string;

  @IsString()
  @IsNotEmpty()
  response: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsDate()
  @IsNotEmpty()
  createdAt: Date;
}
