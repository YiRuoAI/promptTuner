import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1706066093166 implements MigrationInterface {
    name = 'Init1706066093166'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tests\` ADD \`model_config\` json NOT NULL COMMENT '模型配置'`);
        await queryRunner.query(`ALTER TABLE \`tests\` ADD \`input_config\` json NOT NULL COMMENT '输入配置'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tests\` DROP COLUMN \`input_config\``);
        await queryRunner.query(`ALTER TABLE \`tests\` DROP COLUMN \`model_config\``);
    }

}
