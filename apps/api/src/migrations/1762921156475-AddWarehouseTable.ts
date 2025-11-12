import { MigrationInterface, QueryRunner } from "typeorm";

export class AddWarehouseTable1762921156475 implements MigrationInterface {
    name = 'AddWarehouseTable1762921156475'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "warehouses" ("id" SERIAL NOT NULL, "code" character varying(8) NOT NULL, "name" character varying(30) NOT NULL, "address" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_56ae21ee2432b2270b48867e4be" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "warehouses"`);
    }

}
