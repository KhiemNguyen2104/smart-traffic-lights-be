/*
  Warnings:

  - You are about to drop the column `g_time` on the `Traffic_light` table. All the data in the column will be lost.
  - You are about to drop the column `green_feed` on the `Traffic_light` table. All the data in the column will be lost.
  - You are about to drop the column `r_time` on the `Traffic_light` table. All the data in the column will be lost.
  - You are about to drop the column `red_feed` on the `Traffic_light` table. All the data in the column will be lost.
  - You are about to drop the column `y_time` on the `Traffic_light` table. All the data in the column will be lost.
  - You are about to drop the column `yellow_feed` on the `Traffic_light` table. All the data in the column will be lost.
  - You are about to drop the `Fines` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Updates` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `dens_feed` to the `Traffic_light` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state_feed` to the `Traffic_light` table without a default value. This is not possible if the table is not empty.
  - Added the required column `time_feed` to the `Traffic_light` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Fines" DROP CONSTRAINT "Fines_tl_id_fkey";

-- DropForeignKey
ALTER TABLE "Fines" DROP CONSTRAINT "Fines_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Updates" DROP CONSTRAINT "Updates_cr_id_fkey";

-- DropForeignKey
ALTER TABLE "Updates" DROP CONSTRAINT "Updates_tl_id_fkey";

-- DropIndex
DROP INDEX "Traffic_light_green_feed_key";

-- DropIndex
DROP INDEX "Traffic_light_red_feed_key";

-- DropIndex
DROP INDEX "Traffic_light_yellow_feed_key";

-- AlterTable
ALTER TABLE "Traffic_light" DROP COLUMN "g_time",
DROP COLUMN "green_feed",
DROP COLUMN "r_time",
DROP COLUMN "red_feed",
DROP COLUMN "y_time",
DROP COLUMN "yellow_feed",
ADD COLUMN     "dens_feed" TEXT NOT NULL,
ADD COLUMN     "state_feed" TEXT NOT NULL,
ADD COLUMN     "time_feed" TEXT NOT NULL;

-- DropTable
DROP TABLE "Fines";

-- DropTable
DROP TABLE "Updates";
