import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { PaginationDto } from './pagination.dto';

export class ListDto extends PaginationDto {
  @IsOptional()
  @Type(() => String)
  name: string;
}

export class CreateDto {
  @IsNotEmpty()
  @Type(() => String)
  name: string;
  @IsNotEmpty()
  @Type(() => String)
  prompt: string;
}

export class UpdateDto extends CreateDto {
  @IsNotEmpty()
  @Type(() => String)
  id: string;
}

export class DeleteDto {
  @IsNotEmpty()
  @Type(() => String)
  id: string;
}
