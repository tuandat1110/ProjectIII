/*
  Warnings:

  - You are about to drop the column `ipAddress` on the `Device` table. All the data in the column will be lost.
  - The primary key for the `House` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `home_id` on the `House` table. All the data in the column will be lost.
  - The primary key for the `Room` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ipAddress` on the `Sensor` table. All the data in the column will be lost.
  - You are about to drop the column `sensorId` on the `Sensor` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[macAddress]` on the table `Device` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `macAddress` to the `Device` table without a default value. This is not possible if the table is not empty.
  - Added the required column `macAddress` to the `Sensor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roomId` to the `Sensor` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Device" DROP CONSTRAINT "Device_roomId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Room" DROP CONSTRAINT "Room_houseId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Sensor" DROP CONSTRAINT "Sensor_sensorId_fkey";

-- DropIndex
DROP INDEX "public"."House_home_id_key";

-- AlterTable
ALTER TABLE "Device" DROP COLUMN "ipAddress",
ADD COLUMN     "macAddress" TEXT NOT NULL,
ALTER COLUMN "roomId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "House" DROP CONSTRAINT "House_pkey",
DROP COLUMN "home_id",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "House_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "House_id_seq";

-- AlterTable
ALTER TABLE "Room" DROP CONSTRAINT "Room_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "houseId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Room_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Room_id_seq";

-- AlterTable
ALTER TABLE "Sensor" DROP COLUMN "ipAddress",
DROP COLUMN "sensorId",
ADD COLUMN     "macAddress" TEXT NOT NULL,
ADD COLUMN     "roomId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Device_macAddress_key" ON "Device"("macAddress");

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_houseId_fkey" FOREIGN KEY ("houseId") REFERENCES "House"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sensor" ADD CONSTRAINT "Sensor_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
