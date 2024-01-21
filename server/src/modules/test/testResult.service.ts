import { CreateDto } from '@dto/model.dto';
import { PaginationDto } from '@dto/pagination.dto';
import { ChatModelEntity } from '@entities/chatModel.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ListVo } from '@vo/model.vo';
import { Repository } from 'typeorm';

@Injectable()
export class TestResultService {
  constructor(
    @InjectRepository(ChatModelEntity)
    private readonly chatModelRepository: Repository<ChatModelEntity>,
  ) { }

  // 获取模型的列表
  async getList(req: PaginationDto) {
    const list = await this.chatModelRepository.find();
    const vo = new ListVo();
    vo.list = list;
    return vo;
  }

  // 创建模型
  async create(req: CreateDto) {
    const model = new ChatModelEntity();
    model.name = req.name;
    model.brief = req.brief;
    await this.chatModelRepository.save(model);
  }

  // 删除模型
  async delete(id: number) {
    await this.chatModelRepository.delete(id);
  }

  // 更新模型
  async update(req: CreateDto) {
    const model = new ChatModelEntity();
    model.name = req.name;
    model.brief = req.brief;
    await this.chatModelRepository.save(model);
  }

}
