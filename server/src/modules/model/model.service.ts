import { CreateDto, ListDto, UpdateDto } from '@dto/model.dto';
import { PaginationDto } from '@dto/pagination.dto';
import { ChatModelEntity } from '@database/mysqldb/entities/core/chatModel.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ListVo } from '@vo/model.vo';
import { Like, Repository } from 'typeorm';

@Injectable()
export class ModelService {
  constructor(
    @InjectRepository(ChatModelEntity)
    private readonly chatModelRepository: Repository<ChatModelEntity>,
  ) {}

  // 获取模型的列表
  async getList(req: ListDto) {
    const where = {};
    if (req.name) {
      where['name'] = Like(`%${req.name}%`);
    }
    if (req.provider) {
      where['provider'] = req.provider;
    }
    if (req.type) {
      where['type'] = req.type;
    }

    const [list, total] = await this.chatModelRepository.findAndCount({
      where,
      skip: (req.page - 1) * req.pageSize,
      take: req.pageSize,
    });
    const vo = new ListVo();
    vo.list = list;
    vo.total = total;
    vo.page = req.page;
    vo.pageSize = req.pageSize;
    return vo;
  }

  // 创建模型
  async create(req: CreateDto) {
    const model = new ChatModelEntity();
    model.name = req.name;
    model.brief = req.brief;
    model.provider = req.provider;
    model.type = req.type;
    model.endpoints = req.endpoints;
    model.config = req.config;
    const savedModel = await this.chatModelRepository.save(model);
    const id = savedModel.id;
    return id;
  }

  // 删除模型
  async delete(id: string) {
    const res = await this.chatModelRepository.softDelete(id);
    return res.affected > 0;
  }

  // 更新模型
  async update(req: UpdateDto) {
    // 查找模型，如果不存在则抱错，存在的话，则更新
    const model = await this.chatModelRepository.findOne({
      where: { id: req.id },
    });
    if (!model) {
      throw new Error('model not found');
    }
    model.name = req.name;
    model.brief = req.brief;
    model.provider = req.provider;
    model.type = req.type;
    model.endpoints = req.endpoints;
    model.config = req.config;
    const savedModel = await this.chatModelRepository.save(model);
    const id = savedModel.id;
    return id;
  }
}
