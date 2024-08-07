/*
  Warnings:

  - A unique constraint covering the columns `[userID]` on the table `Registrations` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[eventID]` on the table `Registrations` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Registrations_userID_key" ON "Registrations"("userID");

-- CreateIndex
CREATE UNIQUE INDEX "Registrations_eventID_key" ON "Registrations"("eventID");
