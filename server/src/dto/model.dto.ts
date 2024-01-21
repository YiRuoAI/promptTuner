import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class CreateDto {
  @IsNotEmpty()
  @Type(() => String)
  name: string;
  @IsNotEmpty()
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
  @IsNotEmpty()
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
