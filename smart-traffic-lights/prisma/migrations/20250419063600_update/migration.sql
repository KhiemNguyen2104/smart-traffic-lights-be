/*
  Warnings:

  - You are about to drop the `Changes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Road` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `System` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Turns_off_auto` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Changes" DROP CONSTRAINT "Changes_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Road" DROP CONSTRAINT "Road_cr_id_fkey";

-- DropForeignKey
ALTER TABLE "Turns_off_auto" DROP CONSTRAINT "Turns_off_auto_cr_id_fkey";

-- DropForeignKey
ALTER TABLE "Turns_off_auto" DROP CONSTRAINT "Turns_off_auto_user_id_fkey";

-- DropTable
DROP TABLE "Changes";

-- DropTable
DROP TABLE "Road";

-- DropTable
DROP TABLE "System";

-- DropTable
DROP TABLE "Turns_off_auto";
