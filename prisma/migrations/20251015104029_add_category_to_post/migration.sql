/*
  Warnings:

  - Added the required column `category` to the `post_tb` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."post_tb" ADD COLUMN     "category" TEXT NOT NULL;
