import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateDto {
  @IsNotEmpty()
  @Type(() => String)
  name: string;
  @IsNotEmpty()
  @Type(() => String)
  brief: string;
}

export class UpdateDto {
  @IsNotEmpty()
  @Type(() => String)
  id: string;
  @IsOptional()
  @Type(() => String)
  name: string;
  @IsOptional()
  @Type(() => String)
  brief: string;
  @IsOptional()
  @Type(() => Object)
  modelConfig?: any;
  @IsOptional()
  @Type(() => Object)
  inputConfig?: any;
}

export class DeleteDto {
  @IsNotEmpty()
  @Type(() => String)
  id: string;
}

export class StartJobDto {
  @IsNotEmpty()
  @Type(() => String)
  testId: string;
}

export class TestJobDetailDto {
  @IsNotEmpty()
  @Type(() => String)
  testJobId: string;
}
