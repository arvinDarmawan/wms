import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMoreLengthOnPhoneNumberInCustomerTable1762938195849 implements MigrationInterface {
    name = 'AddMoreLengthOnPhoneNumberInCustomerTable1762938195849'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "phone_number"`);
        await queryRunner.query(`ALTER TABLE "customers" ADD "phone_number" character varying(15) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "phone_number"`);
        await queryRunner.query(`ALTER TABLE "customers" ADD "phone_number" character varying(10) NOT NULL`);
    }

}
