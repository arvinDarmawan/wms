import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUomTable1762942247578 implements MigrationInterface {
    name = 'AddUomTable1762942247578'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "uoms" ("id" SERIAL NOT NULL, "code" character varying(8) NOT NULL, "name" character varying(15) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_f207a792064e3032c8fe3922b22" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "uoms"`);
    }

}
