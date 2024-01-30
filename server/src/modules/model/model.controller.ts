import { Controller, Delete, Get, Post } from '@nestjs/common';
import { PaginationDto } from '@dto/pagination.dto';
import { ModelService } from './model.service';
import { Query, Body } from '@nestjs/common';
import { CreateDto, DeleteDto, ListDto, UpdateDto } from '@dto/model.dto';

@Controller('/model')
export class ModelController {
  constructor(private readonly service: ModelService) {}

  /**
   * create model
   * @param CreateDto
   * @returns
   */
  @Post('/create')
  async create(@Body() req: CreateDto) {
    return await this.service.create(req);
  }

  /**
   * get model list
   * @param paginationDto
   * @returns
   */
  @Get('/list')
  async list(@Query() req: ListDto) {
    return await this.service.getList(req);
  }

  /**
   * delete model
   * @returns
   */
  @Delete('/delete')
  async delete(@Query() req: DeleteDto) {
    return await this.service.delete(req.id);
  }

  /**
   * update model
   * @param UpdateDto
   * @returns
   */
  @Post('/update')
  async update(@Body() req: UpdateDto) {
    return await this.service.update(req);
  }
}
