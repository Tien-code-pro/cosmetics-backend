-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "brand" TEXT,
ADD COLUMN     "ingredients" TEXT,
ADD COLUMN     "origin" TEXT,
ADD COLUMN     "shortDescription" TEXT,
ADD COLUMN     "specifications" JSONB,
ADD COLUMN     "usageInstructions" TEXT;
