-- CreateEnum
CREATE TYPE "CostLevel" AS ENUM ('BUDGET', 'MEDIUM', 'PREMIUM', 'SPLURGE');

-- CreateEnum
CREATE TYPE "Season" AS ENUM ('SPRING', 'SUMMER', 'FALL', 'WINTER', 'ALL_YEAR');

-- CreateEnum
CREATE TYPE "IodineLevel" AS ENUM ('LOW', 'MODERATE', 'HIGH');

-- AlterTable
ALTER TABLE "NutritionInfo" ADD COLUMN     "folate" DOUBLE PRECISION,
ADD COLUMN     "glycemicIndex" INTEGER,
ADD COLUMN     "glycemicLoad" DOUBLE PRECISION,
ADD COLUMN     "magnesium" DOUBLE PRECISION,
ADD COLUMN     "netCarbs" DOUBLE PRECISION,
ADD COLUMN     "omega6" DOUBLE PRECISION,
ADD COLUMN     "transFat" DOUBLE PRECISION,
ADD COLUMN     "vitaminB12" DOUBLE PRECISION,
ADD COLUMN     "zinc" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "activeTimeMinutes" INTEGER,
ADD COLUMN     "beveragePairing" TEXT,
ADD COLUMN     "costLevel" "CostLevel" NOT NULL DEFAULT 'MEDIUM',
ADD COLUMN     "costPerServing" DOUBLE PRECISION,
ADD COLUMN     "equipment" TEXT[],
ADD COLUMN     "iodineLevel" "IodineLevel" NOT NULL DEFAULT 'MODERATE',
ADD COLUMN     "isFreezerFriendly" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "maxServings" INTEGER,
ADD COLUMN     "minServings" INTEGER,
ADD COLUMN     "scalingNotes" TEXT,
ADD COLUMN     "seasonalAvailability" "Season"[],
ADD COLUMN     "servingSuggestions" TEXT,
ADD COLUMN     "winePairing" TEXT;

-- CreateTable
CREATE TABLE "IngredientSubstitution" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "originalIngredient" TEXT NOT NULL,
    "substituteIngredient" TEXT NOT NULL,
    "substitutionRatio" TEXT,
    "notes" TEXT,
    "forDairyFree" BOOLEAN NOT NULL DEFAULT false,
    "forGlutenFree" BOOLEAN NOT NULL DEFAULT false,
    "forVegan" BOOLEAN NOT NULL DEFAULT false,
    "forNutFree" BOOLEAN NOT NULL DEFAULT false,
    "forLowSodium" BOOLEAN NOT NULL DEFAULT false,
    "forLowCarb" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "IngredientSubstitution_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "IngredientSubstitution_recipeId_idx" ON "IngredientSubstitution"("recipeId");

-- AddForeignKey
ALTER TABLE "IngredientSubstitution" ADD CONSTRAINT "IngredientSubstitution_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
