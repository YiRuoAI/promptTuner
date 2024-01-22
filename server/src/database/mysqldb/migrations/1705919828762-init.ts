import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1705919828762 implements MigrationInterface {
    name = 'Init1705919828762'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`prompt_templates\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`deleted_at\` datetime NULL, \`name\` varchar(255) NOT NULL COMMENT '模板名称', \`prompt\` text NOT NULL COMMENT '模板', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`chat_models\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`deleted_at\` datetime NULL, \`name\` varchar(255) NOT NULL COMMENT '模型名称', \`brief\` varchar(255) NOT NULL COMMENT '模型简介' DEFAULT '', \`provider\` varchar(255) NOT NULL COMMENT '服务商' DEFAULT '', \`endpoints\` json NULL COMMENT '访问方式', \`type\` varchar(255) NOT NULL COMMENT '模型的类型', \`config\` json NULL COMMENT '模型的默认配置', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`chat_models\``);
        await queryRunner.query(`DROP TABLE \`prompt_templates\``);
    }

}
