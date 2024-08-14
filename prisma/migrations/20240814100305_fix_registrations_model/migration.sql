/*
  Warnings:

  - A unique constraint covering the columns `[userID,eventID]` on the table `Registrations` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Registrations_eventID_key";

-- DropIndex
DROP INDEX "Registrations_userID_key";

-- CreateIndex
CREATE UNIQUE INDEX "Registrations_userID_eventID_key" ON "Registrations"("userID", "eventID");
