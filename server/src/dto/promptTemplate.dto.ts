import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

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
