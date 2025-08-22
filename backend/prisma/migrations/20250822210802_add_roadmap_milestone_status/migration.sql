/*
  Warnings:

  - The `status` column on the `Roadmap` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."MilestoneStatus" AS ENUM ('PLANNED', 'ACTIVE', 'COMPLETED', 'LOCKED');

-- CreateEnum
CREATE TYPE "public"."RoadmapStatus" AS ENUM ('PLANNED', 'ACTIVE', 'COMPLETED');

-- AlterTable
ALTER TABLE "public"."Milestone" ADD COLUMN     "status" "public"."MilestoneStatus" NOT NULL DEFAULT 'PLANNED';

-- AlterTable
ALTER TABLE "public"."Roadmap" DROP COLUMN "status",
ADD COLUMN     "status" "public"."RoadmapStatus" NOT NULL DEFAULT 'PLANNED';
