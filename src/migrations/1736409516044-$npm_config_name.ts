import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1736409516044 implements MigrationInterface {
    name = ' $npmConfigName1736409516044'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "report-user" ADD "resolveddAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "report-user" ADD "resolvedById" integer`);
        await queryRunner.query(`ALTER TABLE "tasks" ALTER COLUMN "status" SET DEFAULT 'Pending'`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_c28e52f758e7bbc53828db92194"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "username" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "age" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "gender" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "roleId" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "report-user" ADD CONSTRAINT "FK_c1d90a79150c7c13c33a932f38e" FOREIGN KEY ("resolvedById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_c28e52f758e7bbc53828db92194" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_c28e52f758e7bbc53828db92194"`);
        await queryRunner.query(`ALTER TABLE "report-user" DROP CONSTRAINT "FK_c1d90a79150c7c13c33a932f38e"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "roleId" SET DEFAULT '2'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "gender" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "age" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "username" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_c28e52f758e7bbc53828db92194" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tasks" ALTER COLUMN "status" SET DEFAULT 'pending'`);
        await queryRunner.query(`ALTER TABLE "report-user" DROP COLUMN "resolvedById"`);
        await queryRunner.query(`ALTER TABLE "report-user" DROP COLUMN "resolveddAt"`);
    }

}
