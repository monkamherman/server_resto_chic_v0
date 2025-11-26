import { PartialType } from '@nestjs/swagger';
import { CreateFormateurDto } from './create-formateur.dto';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateFormateurDto extends PartialType(CreateFormateurDto) {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  specialitesToAdd?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  specialitesToRemove?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  disponibilitesToAdd?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  disponibilitesToRemove?: string[];
}
