import { PaginationDto } from '@dto/pagination.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ListVo } from '@vo/model.vo';
import { EntityManager, In, Repository } from 'typeorm';
import {
  ConversationType,
  TestEntity,
} from '@database/mysqldb/entities/core/test.entity';
import { CreateDto, UpdateDto } from '@dto/test.dto';
import {
  TestJobEntity,
  TestJobStatus,
} from '@database/mysqldb/entities/core/testJob.entity';
import { ChatModelEntity } from '@database/mysqldb/entities/core/chatModel.entity';
import {
  TestJobItemEntity,
  TestJobItemStatus,
} from '@database/mysqldb/entities/core/testJobItem.entity';
import { useChatModel } from '@hook/useChatModel';
import { MessageType } from '@hook/useChatModel/models/baseChatModel';
import { PromptTemplateEntity } from '@database/mysqldb/entities/core/promptTemplate.entity';

@Injectable()
export class TestService {
  constructor(
    @InjectRepository(TestEntity)
    private readonly testRepository: Repository<TestEntity>,
    @InjectRepository(ChatModelEntity)
    private readonly chatModelRepository: Repository<ChatModelEntity>,
    @InjectRepository(TestJobEntity)
    private readonly testJobRepository: Repository<TestJobEntity>,
    @InjectRepository(TestJobItemEntity)
    private readonly testJobItemRepository: Repository<TestJobItemEntity>,
    @InjectRepository(PromptTemplateEntity)
    private readonly promptTemplateRepository: Repository<PromptTemplateEntity>,
    private readonly entityManager: EntityManager,
  ) { }

  async getList(req: PaginationDto) {
    const list = await this.testRepository.find({ order: { id: 'DESC' } });
    const vo = new ListVo();
    vo.list = list;
    return vo;
  }

  // 创建测试
  async create(req: CreateDto) {
    const model = new TestEntity();
    model.name = req.name;
    model.brief = req.brief;
    await this.testRepository.save(model);
  }

  // 删除测试
  async delete(id: string) {
    await this.testRepository.delete(id);
  }

  // 更新测试
  async update(req: UpdateDto) {
    const test = await this.testRepository.findOne({
      where: { id: req.id },
    });
    if (!test) {
      throw new Error('test not found');
    }
    if (req.name) {
      test.name = req.name;
    }
    if (req.brief) {
      test.brief = req.brief;
    }
    if (req.modelConfig) {
      test.modelConfig = req.modelConfig;
    }
    if (req.inputConfig) {
      test.inputConfig = req.inputConfig;
    }
    const res = await this.testRepository.save(test);
    const id = res.id;
    return id;
  }

  // 获取详情
  async getDetail(id: string) {
    const test = await this.testRepository.findOne({
      where: { id },
    });
    if (!test) {
      throw new Error('test not found');
    }
    if (test.inputConfig === null) {
      test.inputConfig = [];
    }
    if (test.modelConfig === null) {
      test.modelConfig = [];
    }
    return test;
  }

  // 发起测试
  async startJob(testId: string) {
    // 查找测试
    const test = await this.getDetail(testId);
    // 遍历modelconfig，将模型的快照存入testJob
    const modelIds = [];
    test.modelConfig.forEach((item) => {
      modelIds.push(item.modelId);
    });
    if (modelIds.length === 0) {
      throw new Error('model config is empty');
    }
    const models = await this.chatModelRepository.find({
      where: { id: In(modelIds) },
    });
    if (models.length === 0) {
      throw new Error('model not found');
    }
    // 将models转为modelMap
    const modelMap = {};
    models.forEach((item) => {
      modelMap[item.id] = item;
    });
    // 获取所有的prompt template
    const promptTemplateIds = [];
    test.modelConfig.forEach((item) => {
      item.conversationConfig.forEach((item) => {
        if (item.type === ConversationType.promptTemplate) {
          promptTemplateIds.push(item.promptTemplateId);
        }
      });
    });
    let promptTemplates = [];
    const promptMap = {};
    if (promptTemplateIds.length > 0) {
      promptTemplates = await this.promptTemplateRepository.find({
        where: { id: In(promptTemplateIds) },
      });
      if (promptTemplates.length === 0) {
        throw new Error('prompt template not found');
      }
      // 将promptTemplates转为promptMap
      promptTemplates.forEach((item) => {
        promptMap[item.id] = item;
      });
    }
    let testJob = new TestJobEntity();
    testJob.testId = testId;
    testJob.modelConfig = test.modelConfig;
    testJob.inputConfig = test.inputConfig;
    testJob.modelSnapshot = models;
    testJob.status = TestJobStatus.notStarted;


    await this.entityManager.transaction(async (entityManager) => {
      // 新建一个测试的任务
      testJob = await entityManager.getRepository(TestJobEntity).save(testJob);

      // 遍历模型，新建任务项
      const testJobItems = [];
      test.modelConfig.forEach((modelConfig, index) => {
        const prompts = [];
        modelConfig.conversationConfig.forEach((item) => {
          let promptTemplate = '';
          if (item.type === ConversationType.promptTemplate) {
            promptTemplate = promptMap[item.promptTemplateId].prompt;
          } else {
            promptTemplate = item.prompt;
          }
          // 生成prompt
          const prompt = this.generatePrompt(
            promptTemplate,
            test.inputConfig[index].input,
          );
          if (!prompt) {
            throw new Error('prompt is empty');
          }
          prompts.push(prompt);
        });
        const testJobItem = {
          testId,
          testJobId: testJob.id,
          modelSnapshot: models.filter(
            (item) => item.id === modelConfig.modelId,
          )[0],
          prompts,
          status: TestJobStatus.notStarted,
        };
        testJobItems.push(testJobItem);
      });
      await entityManager.getRepository(TestJobItemEntity).insert(testJobItems);
    });
    return testJob.id;
  }

  generatePrompt(prompt: string, value: string): string {
    // 将value按照行切割，然后再按照key=value的形式风格成kv
    // 替换prompt中的一些占位符号，比如${key}，将其替换为value
    value.split('\n').forEach((line) => {
      const [key, value] = line.split('=');
      prompt = prompt.replace(`\${${key}}`, value);
    });
    return prompt;
  }

  // TODO
  // 扫描任务，将任务中开始的状态设置为开始处理
  //
  async scanJob() {
    // 遍历所有的conversation，发起请求，等待结果
    // 每次只拿10条
    const jobItems = await this.testJobItemRepository.find({
      where: { status: TestJobItemStatus.notStarted },
      take: 10,
      order: { id: 'ASC' },
    });
    if (jobItems.length === 0) {
      return;
    }
    // todo 改为并发处理，提高速度
    newJob: for (let i = 0; i < jobItems.length; i++) {
      const item = jobItems[i];
      // 将状态设置为处理中
      const changeRes = await this.testJobItemRepository.update(
        {
          id: item.id,
          status: TestJobItemStatus.notStarted,
        },
        {
          status: TestJobItemStatus.processing,
        },
      );
      if (changeRes.affected === 0) {
        // 如果没有修改成功，则跳过
        continue;
      }
      // 如果job的状态为未开始，则将其设置为开始
      await this.testJobRepository.update(
        {
          id: item.testJobId,
          status: TestJobStatus.notStarted,
        },
        {
          status: TestJobStatus.processing,
        },
      )
      // todo 遍历所有的conversation，发起请求，等待结果
      const chatModel = useChatModel(item.modelSnapshot.provider);
      const resArr = [];
      const messages: MessageType[] = [];
      for (let j = 0; j < item.prompts.length; j++) {
        messages.push({ role: 'user', content: item.prompts[j] });
        const res = await chatModel.completions({
          model: item.modelSnapshot.type,
          messages,
          temperature: item.modelSnapshot.config?.temperature,
          topP: item.modelSnapshot.config?.topP,
          maxTokens: item.modelSnapshot.config?.maxTokens,
          presencePenalty: item.modelSnapshot.config?.presencePenalty,
          frequencyPenalty: item.modelSnapshot.config?.frequencyPenalty,
          url: item.modelSnapshot.endpoints.url,
          apikey: item.modelSnapshot.endpoints?.apiKey,
          appKey: item.modelSnapshot.endpoints?.appKey,
          appSecret: item.modelSnapshot.endpoints?.appSecret,
        });
        if (!res.state) {
          // 更新任务为失败
          await this.testJobItemRepository.update(
            {
              id: item.id,
            },
            {
              status: TestJobItemStatus.canceled,
            },
          );
          break newJob;
        }
        resArr.push(res);
        messages.push(res.message);
      }
      await this.testJobItemRepository.update(
        {
          id: item.id,
        },
        {
          status: TestJobItemStatus.finished,
          result: resArr,
          messages,
        },
      );
    }
  }

  // 检查任务，判断所有的conversation是否都处理完，是的话将任务标志为完成即可
  async checkJob() {
    // 查找testjob中的处理中的任务
    const jobList = await this.testJobRepository.find({
      where: { status: TestJobStatus.processing },
    });
    if (jobList.length === 0) {
      return;
    }
    const testJobIds = [];
    jobList.forEach((item) => {
      testJobIds.push(item.id);
    });
    const jobItems = await this.testJobItemRepository.find({
      where: {
        testJobId: In(testJobIds),
        status: TestJobItemStatus.processing,
      },
      // 只取testJobId和status
      select: ['testJobId', 'status'],
    });
    // 将jobItems转为map
    const jobItemMap = {};
    // testJobId=>未完成的数量
    jobItems.forEach((item) => {
      if (!jobItemMap[item.testJobId]) {
        jobItemMap[item.testJobId] = 0;
      }
      jobItemMap[item.testJobId] += 1;
    });

    // 检查每个任务的状态
    for (let i = 0; i < jobList.length; i++) {
      const job = jobList[i];
      if (!jobItemMap[job.id]) {
        // 如果没有未完成的任务项，则将任务标志为完成
        await this.testJobRepository.update(
          {
            id: job.id,
          },
          {
            status: TestJobStatus.finished,
          },
        );
      }
    }
  }
}
