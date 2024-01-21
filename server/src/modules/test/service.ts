import { CreateDto } from '@dto/model.dto';
import { PaginationDto } from '@dto/pagination.dto';
import { ChatModelEntity } from '@entities/chatModel.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ListVo } from '@vo/model.vo';
import { Repository } from 'typeorm';

@Injectable()
export class TestService {
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

  // 发起测试
  async startJob() {
    // TODO 将测试的状态修改为开始
    // 拆解任务，一个模型一个input会有一个conversation
    // 数量为 input*model
  }

  // TODO
  // 扫描任务，将任务中开始的状态设置为开始处理
  // 
  scanJob(){
    // 遍历所有的conversation，发起请求，等待结果
  }

  // TODO
  // 检查任务，判断所有的conversation是否都处理完，是的话将任务标志为完成即可
  checkJob(){
  }


}
