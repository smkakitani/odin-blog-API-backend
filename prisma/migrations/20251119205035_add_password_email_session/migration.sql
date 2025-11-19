/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `authors` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `authors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `authors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `visitors` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "authors" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "visitors" ADD COLUMN     "password" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sid" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Session_sid_key" ON "Session"("sid");

-- CreateIndex
CREATE UNIQUE INDEX "authors_email_key" ON "authors"("email");
