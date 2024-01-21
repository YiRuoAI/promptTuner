import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class CreateDto {
  @IsNotEmpty()
  @Type(() => String)
  name: string;
  @IsNotEmpty()
  @Type(() => String)
  brief: string;
}
