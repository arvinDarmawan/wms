import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDeletedAtOnUsersTable1762915800861 implements MigrationInterface {
    name = 'AddDeletedAtOnUsersTable1762915800861'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "deleted_at" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "deleted_at"`);
    }

}
