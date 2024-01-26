import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1706063988224 implements MigrationInterface {
    name = 'Init1706063988224'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`tests\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`deleted_at\` datetime NULL, \`name\` varchar(255) NOT NULL COMMENT '模型名称', \`brief\` varchar(255) NOT NULL COMMENT '模型简介' DEFAULT '', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`tests\``);
    }

}
