-- CreateEnum
CREATE TYPE "TripStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "Trip" ADD COLUMN     "status" "TripStatus" NOT NULL DEFAULT 'PENDING';
