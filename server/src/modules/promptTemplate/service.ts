import { PaginationDto } from '@dto/pagination.dto';
import { CreateDto, ListDto, UpdateDto } from '@dto/promptTemplate.dto';
import { ChatModelEntity } from '@database/mysqldb/entities/core//chatModel.entity';
import { PromptTemplateEntity } from '@database/mysqldb/entities/core//promptTemplate.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ListVo } from '@vo/model.vo';
import { Like, Repository } from 'typeorm';

@Injectable()
export class PromptTemplateService {
  constructor(
    @InjectRepository(PromptTemplateEntity)
    private readonly promptTemplateRepository: Repository<PromptTemplateEntity>,
  ) {}

  // 获取模型的列表
  async getList(req: ListDto) {
    const where: any = {};
    if (req.name) {
      where.name = Like(`%${req.name}%`);
    }
    const [list, total] = await this.promptTemplateRepository.findAndCount({
      where,
      skip: (req.page - 1) * req.pageSize,
      take: req.pageSize,
    });
    const vo = new ListVo();
    vo.list = list;
    vo.pageSize = req.pageSize;
    vo.page = req.page;
    vo.total = total;
    return vo;
  }

  // 创建模型
  async create(req: CreateDto) {
    const prompt = new PromptTemplateEntity();
    prompt.name = req.name;
    prompt.prompt = req.prompt;
    const savedPrompt = await this.promptTemplateRepository.save(prompt);
    const id = savedPrompt.id;
    return id;
  }

  // 删除模型
  async delete(id: string) {
    const res = await this.promptTemplateRepository.softDelete(id);
    return res.affected > 0;
  }

  // 更新模型
  async update(req: UpdateDto) {
    // 查找模型，如果不存在则抱错，存在的话，则更新
    const prompt = await this.promptTemplateRepository.findOne({
      where: { id: req.id },
    });
    if (!prompt) {
      throw new Error('prompt not found');
    }
    prompt.name = req.name;
    prompt.prompt = req.prompt;
    const savedPrompt = await this.promptTemplateRepository.save(prompt);
    const id = savedPrompt.id;
    return id;
  }
}
