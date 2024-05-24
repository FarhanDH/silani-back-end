import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePestDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
