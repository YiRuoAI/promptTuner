import { Type } from 'class-transformer';
import { IsOptional, Max, Min } from 'class-validator';

export class PaginationDto {
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  page = 1;
  @Min(1)
  @Max(99)
  @Type(() => Number)
  @IsOptional()
  pageSize = 20;
}
