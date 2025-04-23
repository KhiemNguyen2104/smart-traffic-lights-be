/*
  Warnings:

  - The primary key for the `Traffic_light` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Traffic_light" DROP CONSTRAINT "Traffic_light_pkey",
ADD CONSTRAINT "Traffic_light_pkey" PRIMARY KEY ("tl_id", "cr_id");
