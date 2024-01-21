import { Controller, Delete, Get, Post } from '@nestjs/common';
import { PaginationDto } from '@dto/pagination.dto';
import { TestService } from './service';
import { Query, Body } from '@nestjs/common';
import { CreateDto } from '@dto/model.dto';

@Controller('/test')
export class TestController {
  constructor(private readonly service: TestService) {}

  /**
   * create model
   * @param createAppDto
   * @returns
   */
  @Post('/create')
  async create(@Body() req: CreateDto) {
    // return await this.service.create(req);
  }

  /**
   * get model list
   * @param paginationDto
   * @returns
   */
  @Get('/list')
  async list(@Query() paginationDto: PaginationDto) {
    return await this.service.getList(paginationDto);
  }

  /**
   * get model detail
   * @returns
   */
  @Get('/detail')
  async getAppInfoById() {
    // return await this.service.getAppById(user, appInfoDto.id);
  }

  /**
   * 删除应用
   * @param user
   * @param id
   * @returns
   */
  @Delete('/delete')
  async deleteApp() {
    // return await this.service.deleteApp(user, appInfoDto.id);
  }

  /**
   * update model
   * @param user
   * @param updateAppDto
   * @returns
   */
  @Post('/update')
  async updateApp() {
    // return await this.service.updateApp(user, updateAppDto);
  }
}
