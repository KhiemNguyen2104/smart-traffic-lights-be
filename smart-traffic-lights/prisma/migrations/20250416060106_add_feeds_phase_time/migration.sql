/*
  Warnings:

  - Added the required column `im_send_time` to the `Changes` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `per_name` on the `Permission` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "PermissionType" AS ENUM ('READ', 'WRITE');

-- AlterTable
ALTER TABLE "Changes" ADD COLUMN     "im_send_time" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Permission" DROP COLUMN "per_name",
ADD COLUMN     "per_name" "PermissionType" NOT NULL;
