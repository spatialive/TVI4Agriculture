/*
  Warnings:

  - You are about to drop the column `valid` on the `Token` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Token_emailToken_key";

-- AlterTable
ALTER TABLE "Token" DROP COLUMN "valid";
