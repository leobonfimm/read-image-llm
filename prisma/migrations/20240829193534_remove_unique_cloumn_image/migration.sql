-- DropIndex
DROP INDEX "measures_image_key";

-- AlterTable
ALTER TABLE "measures" ALTER COLUMN "image" SET DATA TYPE TEXT;
