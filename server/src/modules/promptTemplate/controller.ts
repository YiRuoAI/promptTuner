import { Controller, Delete, Get, Post } from '@nestjs/common';
import { PaginationDto } from '@dto/pagination.dto';
import { PromptTemplateService } from './service';
import { Query, Body } from '@nestjs/common';
import { CreateDto, DeleteDto, UpdateDto } from '@dto/promptTemplate.dto';

@Controller('/prompt-template')
export class PromptTemplateController {
  constructor(private readonly service: PromptTemplateService) {}

  /**
   * create prompt
   * @param CreateDto
   * @returns
   */
  @Post('/create')
  async create(@Body() req: CreateDto) {
    return await this.service.create(req);
  }

  /**
   * get prompt list
   * @param paginationDto
   * @returns
   */
  @Get('/list')
  async list(@Query() req: PaginationDto) {
    return await this.service.getList(req);
  }

  /**
   * delete prompt
   * @returns
   */
  @Delete('/delete')
  async delete(@Query() req: DeleteDto) {
    return await this.service.delete(req.id);
  }

  /**
   * update prompt
   * @param UpdateDto
   * @returns
   */
  @Post('/update')
  async update(@Body() req: UpdateDto) {
    return await this.service.update(req);
  }
}
