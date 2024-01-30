import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { PaginationDto } from './pagination.dto';

export class ListDto extends PaginationDto {
  @IsOptional()
  @Type(() => String)
  name: string;
  @IsOptional()
  @Type(() => String)
  provider: string;
  @IsOptional()
  @Type(() => String)
  type: string;
}

export class CreateDto {
  @IsNotEmpty()
  @Type(() => String)
  name: string;
  @IsOptional()
  @Type(() => String)
  brief: string;
  @IsNotEmpty()
  @Type(() => String)
  provider: string;
  @IsNotEmpty()
  @Type(() => String)
  type: string;
  @IsNotEmpty()
  @Type(() => Object)
  endpoints: any;
  @IsOptional()
  @Type(() => Object)
  config: any;
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
