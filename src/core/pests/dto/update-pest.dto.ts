import { PartialType } from '@nestjs/mapped-types';
import { CreatePestDto } from './create-pest.dto';

export class UpdatePestDto extends PartialType(CreatePestDto) {}
