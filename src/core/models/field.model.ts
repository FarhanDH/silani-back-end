import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';
import { Field } from '~/common/drizzle/schema/fields';

export class CreateFieldRequest {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsNumberString()
  @IsNotEmpty()
  area: string;
}

export class UpdateFieldRequest extends PartialType(CreateFieldRequest) {}

export class FieldResponse {
  id: string;
  userId: string;
  name: string;
  location: string;
  area: string;
  imageUrl: string;
  imageKey: string;
  createdAt: Date;
  updatedAt: Date;
}

export const toFieldResponse = (field: Field): FieldResponse => {
  return {
    id: field.id,
    userId: field.userId,
    name: field.name,
    location: field.location,
    area: field.area,
    imageUrl: field.imageUrl,
    imageKey: field.imageKey,
    createdAt: field.createdAt,
    updatedAt: field.updatedAt,
  };
};
