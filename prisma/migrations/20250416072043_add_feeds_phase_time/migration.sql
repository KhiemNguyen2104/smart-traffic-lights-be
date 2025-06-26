/*
  Warnings:

  - A unique constraint covering the columns `[yellow_feed]` on the table `Traffic_light` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `yellow_feed` to the `Traffic_light` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Traffic_light" ADD COLUMN     "yellow_feed" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Traffic_light_yellow_feed_key" ON "Traffic_light"("yellow_feed");
