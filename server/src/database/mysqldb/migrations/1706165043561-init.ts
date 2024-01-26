import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1706165043561 implements MigrationInterface {
    name = 'Init1706165043561'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`test_jobs\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`deleted_at\` datetime NULL, \`test_id\` varchar(255) NOT NULL COMMENT '测试编号', \`model_config\` json NULL COMMENT '模型配置', \`input_config\` json NULL COMMENT '输入配置', \`model_snapshot\` json NULL COMMENT '模型快照', \`status\` tinyint NOT NULL COMMENT '执行状态' DEFAULT '0', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`test_job_items\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`deleted_at\` datetime NULL, \`test_id\` varchar(255) NOT NULL COMMENT '测试编号', \`test_job_id\` varchar(255) NOT NULL COMMENT '测试任务编号', \`model_snapshot\` json NULL COMMENT '模型快照', \`prompts\` json NULL COMMENT 'prompt数组', \`messages\` json NULL COMMENT '结果', \`result\` json NULL COMMENT '调用结果', \`status\` tinyint NOT NULL COMMENT '执行状态' DEFAULT '0', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`test_job_items\``);
        await queryRunner.query(`DROP TABLE \`test_jobs\``);
    }

}
