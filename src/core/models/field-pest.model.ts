import { PartialType } from '@nestjs/mapped-types';
import { IsDate, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { FieldPest } from '~/common/drizzle/schema';

export class CreateFieldPestRequest {
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  pestId: string;
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  fieldId: string;
}

export class UpdateFieldPestRequest extends PartialType(
  CreateFieldPestRequest,
) {}

export class FieldPestResponse {
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsUUID()
  @IsNotEmpty()
  pestId: string;

  @IsString()
  @IsUUID()
  @IsNotEmpty()
  fieldId: string;

  @IsDate()
  @IsNotEmpty()
  createdAt: Date;

  @IsDate()
  @IsNotEmpty()
  updatedAt: Date;
}

export const toFieldPestResponse = (fieldPest: FieldPest): FieldPest => {
  return {
    id: fieldPest.id,
    pestId: fieldPest.pestId,
    fieldId: fieldPest.fieldId,
    createdAt: fieldPest.createdAt,
    updatedAt: fieldPest.updatedAt,
  };
};
