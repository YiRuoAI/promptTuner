import { PaginationDto } from '@dto/pagination.dto';
import { CreateDto, UpdateDto } from '@dto/promptTemplate.dto';
import { ChatModelEntity } from '@entities/chatModel.entity';
import { PromptTemplateEntity } from '@entities/promptTemplate.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ListVo } from '@vo/model.vo';
import { Repository } from 'typeorm';

@Injectable()
export class PromptTemplateService {
  constructor(
    @InjectRepository(PromptTemplateEntity)
    private readonly promptTemplateRepository: Repository<PromptTemplateEntity>,
  ) {}

  // 获取模型的列表
  async getList(req: PaginationDto) {
    const list = await this.promptTemplateRepository.find();
    const vo = new ListVo();
    vo.list = list;
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
