/*
  Warnings:

  - You are about to drop the column `metaId` on the `attendance` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "attendance" DROP CONSTRAINT "attendance_metaId_fkey";

-- AlterTable
ALTER TABLE "attendance" DROP COLUMN "metaId";
