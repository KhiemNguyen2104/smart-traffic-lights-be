/*
  Warnings:

  - A unique constraint covering the columns `[hash_key]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `hash_key` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "hash_key" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_hash_key_key" ON "User"("hash_key");
