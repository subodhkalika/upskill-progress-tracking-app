/*
  Warnings:

  - You are about to drop the column `faculty` on the `Task` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."TaskStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED');

-- AlterTable
ALTER TABLE "public"."Task" DROP COLUMN "faculty",
ADD COLUMN     "status" "public"."TaskStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "topic" TEXT;
