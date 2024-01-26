import { Controller, Delete, Get, Post } from '@nestjs/common';
import { PaginationDto } from '@dto/pagination.dto';
import { TestService } from './service';
import { Query, Body } from '@nestjs/common';
import { CreateDto, DeleteDto, StartJobDto, TestJobDetailDto, UpdateDto } from '@dto/test.dto';
import { TestResultService } from './testResult.service';

@Controller('/test')
export class TestController {
  constructor(
    private readonly service: TestService,
    private readonly resultService: TestResultService,
    ) {}

  /**
   * create model
   * @param createAppDto
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
  async list(@Query() paginationDto: PaginationDto) {
    return await this.service.getList(paginationDto);
  }

  /**
   * 删除测试
   * @param user
   * @param id
   * @returns
   */
  @Delete('/delete')
  async delete(@Query() req: DeleteDto) {
    return await this.service.delete(req.id);
  }

  /**
   * update test
   * @returns
   */
  @Post('/update')
  async update(@Body() req: UpdateDto) {
    return await this.service.update(req);
  }

  /**
   * get detail
   * @returns
   */
  @Get('/detail')
  async detail(@Query() req: DeleteDto) {
    return await this.service.getDetail(req.id);
  }

  /**
   * update test
   * @returns
   */
  @Post('/start-job')
  async startJob(@Body() req: StartJobDto) {
    return await this.service.startJob(req.testId);
  }

  /**
   * get model list
   * @param paginationDto
   * @returns
   */
  @Get('/list-test-job')
  async listTestjob(@Query() paginationDto: PaginationDto) {
    return await this.resultService.getList(paginationDto);
  }
  
  /**
   * get model list
   * @param paginationDto
   * @returns
   */
  @Get('/test-job-detail')
  async testJobDetail(@Query() req: TestJobDetailDto) {
    return await this.resultService.getTestJobDetail(req.testJobId);
  }
}
