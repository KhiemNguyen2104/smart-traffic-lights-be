/*
  Warnings:

  - The primary key for the `Crossroads` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `feed_key` on the `Crossroads` table. All the data in the column will be lost.
  - The primary key for the `Road` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `feed_key` on the `Road` table. All the data in the column will be lost.
  - You are about to drop the column `feed_key` on the `Traffic_light` table. All the data in the column will be lost.
  - The primary key for the `Turns_off_auto` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `feed_key` on the `Turns_off_auto` table. All the data in the column will be lost.
  - The primary key for the `Updates` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `feed_key` on the `Updates` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[green_feed]` on the table `Traffic_light` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[red_feed]` on the table `Traffic_light` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cr_id` to the `Crossroads` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phase_time` to the `Crossroads` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cr_id` to the `Road` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cr_id` to the `Traffic_light` table without a default value. This is not possible if the table is not empty.
  - Added the required column `green_feed` to the `Traffic_light` table without a default value. This is not possible if the table is not empty.
  - Added the required column `red_feed` to the `Traffic_light` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cr_id` to the `Turns_off_auto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cr_id` to the `Updates` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Road" DROP CONSTRAINT "Road_feed_key_fkey";

-- DropForeignKey
ALTER TABLE "Traffic_light" DROP CONSTRAINT "Traffic_light_feed_key_fkey";

-- DropForeignKey
ALTER TABLE "Turns_off_auto" DROP CONSTRAINT "Turns_off_auto_feed_key_fkey";

-- DropForeignKey
ALTER TABLE "Updates" DROP CONSTRAINT "Updates_feed_key_fkey";

-- AlterTable
ALTER TABLE "Crossroads" DROP CONSTRAINT "Crossroads_pkey",
DROP COLUMN "feed_key",
ADD COLUMN     "cr_id" TEXT NOT NULL,
ADD COLUMN     "phase_time" INTEGER NOT NULL,
ADD CONSTRAINT "Crossroads_pkey" PRIMARY KEY ("cr_id");

-- AlterTable
ALTER TABLE "Road" DROP CONSTRAINT "Road_pkey",
DROP COLUMN "feed_key",
ADD COLUMN     "cr_id" TEXT NOT NULL,
ADD CONSTRAINT "Road_pkey" PRIMARY KEY ("cr_id", "type");

-- AlterTable
ALTER TABLE "Traffic_light" DROP COLUMN "feed_key",
ADD COLUMN     "cr_id" TEXT NOT NULL,
ADD COLUMN     "green_feed" TEXT NOT NULL,
ADD COLUMN     "red_feed" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Turns_off_auto" DROP CONSTRAINT "Turns_off_auto_pkey",
DROP COLUMN "feed_key",
ADD COLUMN     "cr_id" TEXT NOT NULL,
ADD CONSTRAINT "Turns_off_auto_pkey" PRIMARY KEY ("user_id", "cr_id", "time");

-- AlterTable
ALTER TABLE "Updates" DROP CONSTRAINT "Updates_pkey",
DROP COLUMN "feed_key",
ADD COLUMN     "cr_id" TEXT NOT NULL,
ADD CONSTRAINT "Updates_pkey" PRIMARY KEY ("cr_id", "time", "tl_id");

-- CreateIndex
CREATE UNIQUE INDEX "Traffic_light_green_feed_key" ON "Traffic_light"("green_feed");

-- CreateIndex
CREATE UNIQUE INDEX "Traffic_light_red_feed_key" ON "Traffic_light"("red_feed");

-- AddForeignKey
ALTER TABLE "Traffic_light" ADD CONSTRAINT "Traffic_light_cr_id_fkey" FOREIGN KEY ("cr_id") REFERENCES "Crossroads"("cr_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Road" ADD CONSTRAINT "Road_cr_id_fkey" FOREIGN KEY ("cr_id") REFERENCES "Crossroads"("cr_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Updates" ADD CONSTRAINT "Updates_cr_id_fkey" FOREIGN KEY ("cr_id") REFERENCES "Crossroads"("cr_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Turns_off_auto" ADD CONSTRAINT "Turns_off_auto_cr_id_fkey" FOREIGN KEY ("cr_id") REFERENCES "Crossroads"("cr_id") ON DELETE RESTRICT ON UPDATE CASCADE;
