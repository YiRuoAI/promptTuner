import { PaginationDto } from '@dto/pagination.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ListVo } from '@vo/model.vo';
import { Repository } from 'typeorm';
import { TestJobEntity } from '@database/mysqldb/entities/core/testJob.entity';
import { TestJobItemEntity } from '@database/mysqldb/entities/core/testJobItem.entity';
import { ListJobItemVo } from '@vo/test.vo';

@Injectable()
export class TestResultService {
  constructor(
    @InjectRepository(TestJobEntity)
    private readonly testJobEntitysitory: Repository<TestJobEntity>,
    @InjectRepository(TestJobItemEntity)
    private readonly testJobItemRepository: Repository<TestJobItemEntity>,
  ) { }

  // 获取模型的列表
  async getList(req: PaginationDto) {
    const list = await this.testJobEntitysitory.find({
      order: { id: 'DESC' },
    });
    const vo = new ListVo();
    vo.list = list;
    return vo;
  }

  async getDetail(id: string) {
    const testJob = await this.testJobEntitysitory.findOne({
      where: { id },
    });
    if (!testJob) {
      throw new Error('test job not found');
    }
    return testJob;
  }

  // 删除模型
  async delete(id: number) {
    await this.testJobEntitysitory.delete(id);
  }

  // 获取模型的列表
  async getTestJobDetail(testJobId: string) {
    const testJob = await this.getDetail(testJobId);
    const list = await this.testJobItemRepository.find({
      where: { testJobId },
      order: { id: 'DESC' },
    });
    const vo = new ListJobItemVo();
    vo.list = list;
    vo.job = testJob;
    return vo;
  }
}
