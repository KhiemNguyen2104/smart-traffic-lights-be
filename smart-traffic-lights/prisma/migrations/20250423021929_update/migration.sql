/*
  Warnings:

  - Added the required column `L1` to the `Crossroads` table without a default value. This is not possible if the table is not empty.
  - Added the required column `L2` to the `Crossroads` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Crossroads" ADD COLUMN     "L1" INTEGER NOT NULL,
ADD COLUMN     "L2" INTEGER NOT NULL;
