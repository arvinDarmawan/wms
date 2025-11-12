import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCustomerTable1762935575860 implements MigrationInterface {
    name = 'AddCustomerTable1762935575860'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "customers" ("id" SERIAL NOT NULL, "code" character varying(12) NOT NULL, "first_name" character varying(30) NOT NULL, "last_name" character varying(30) NOT NULL, "email" character varying NOT NULL, "phone_number" character varying(10) NOT NULL, "shipping_address" character varying NOT NULL, "billing_address" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "customers"`);
    }

}
