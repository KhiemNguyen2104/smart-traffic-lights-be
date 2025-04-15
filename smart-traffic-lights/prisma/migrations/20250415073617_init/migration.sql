-- CreateEnum
CREATE TYPE "TLType" AS ENUM ('A', 'B');

-- CreateTable
CREATE TABLE "User" (
    "user_id" TEXT NOT NULL,
    "user_name" TEXT NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "per_id" TEXT NOT NULL,
    "per_name" TEXT NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("per_id")
);

-- CreateTable
CREATE TABLE "Traffic_light" (
    "tl_id" TEXT NOT NULL,
    "length" DOUBLE PRECISION NOT NULL,
    "width" DOUBLE PRECISION NOT NULL,
    "g_time" INTEGER NOT NULL,
    "r_time" INTEGER NOT NULL,
    "y_time" INTEGER NOT NULL,
    "type" "TLType" NOT NULL,
    "feed_key" TEXT NOT NULL,
    "g_thres" INTEGER NOT NULL,
    "r_thres" INTEGER NOT NULL,
    "y_thres" INTEGER NOT NULL,

    CONSTRAINT "Traffic_light_pkey" PRIMARY KEY ("tl_id")
);

-- CreateTable
CREATE TABLE "System" (
    "sys_id" TEXT NOT NULL,
    "im_send_time" INTEGER NOT NULL,

    CONSTRAINT "System_pkey" PRIMARY KEY ("sys_id")
);

-- CreateTable
CREATE TABLE "Crossroads" (
    "feed_key" TEXT NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "Crossroads_pkey" PRIMARY KEY ("feed_key")
);

-- CreateTable
CREATE TABLE "Road" (
    "feed_key" TEXT NOT NULL,
    "type" "TLType" NOT NULL,

    CONSTRAINT "Road_pkey" PRIMARY KEY ("feed_key","type")
);

-- CreateTable
CREATE TABLE "Has" (
    "per_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "Has_pkey" PRIMARY KEY ("per_id","user_id")
);

-- CreateTable
CREATE TABLE "Changes" (
    "user_id" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Changes_pkey" PRIMARY KEY ("user_id","time")
);

-- CreateTable
CREATE TABLE "Fines" (
    "tl_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "g_time" INTEGER NOT NULL,
    "r_time" INTEGER NOT NULL,
    "y_time" INTEGER NOT NULL,
    "g_thres" INTEGER NOT NULL,
    "r_thres" INTEGER NOT NULL,
    "y_thres" INTEGER NOT NULL,

    CONSTRAINT "Fines_pkey" PRIMARY KEY ("tl_id","user_id","time")
);

-- CreateTable
CREATE TABLE "Updates" (
    "feed_key" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tl_id" TEXT NOT NULL,
    "g_time" INTEGER NOT NULL,
    "r_time" INTEGER NOT NULL,

    CONSTRAINT "Updates_pkey" PRIMARY KEY ("feed_key","time","tl_id")
);

-- CreateTable
CREATE TABLE "Turns_off_auto" (
    "user_id" TEXT NOT NULL,
    "feed_key" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Turns_off_auto_pkey" PRIMARY KEY ("user_id","feed_key","time")
);

-- AddForeignKey
ALTER TABLE "Traffic_light" ADD CONSTRAINT "Traffic_light_feed_key_fkey" FOREIGN KEY ("feed_key") REFERENCES "Crossroads"("feed_key") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Road" ADD CONSTRAINT "Road_feed_key_fkey" FOREIGN KEY ("feed_key") REFERENCES "Crossroads"("feed_key") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Has" ADD CONSTRAINT "Has_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Has" ADD CONSTRAINT "Has_per_id_fkey" FOREIGN KEY ("per_id") REFERENCES "Permission"("per_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Changes" ADD CONSTRAINT "Changes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fines" ADD CONSTRAINT "Fines_tl_id_fkey" FOREIGN KEY ("tl_id") REFERENCES "Traffic_light"("tl_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fines" ADD CONSTRAINT "Fines_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Updates" ADD CONSTRAINT "Updates_feed_key_fkey" FOREIGN KEY ("feed_key") REFERENCES "Crossroads"("feed_key") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Updates" ADD CONSTRAINT "Updates_tl_id_fkey" FOREIGN KEY ("tl_id") REFERENCES "Traffic_light"("tl_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Turns_off_auto" ADD CONSTRAINT "Turns_off_auto_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Turns_off_auto" ADD CONSTRAINT "Turns_off_auto_feed_key_fkey" FOREIGN KEY ("feed_key") REFERENCES "Crossroads"("feed_key") ON DELETE RESTRICT ON UPDATE CASCADE;
