/*
  Warnings:

  - You are about to drop the `Customer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Employee` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `status` on the `Car` table. All the data in the column will be lost.
  - The primary key for the `Reservation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `customerId` on the `Reservation` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Reservation` table. All the data in the column will be lost.
  - Added the required column `reservationId` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Reservation` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Customer_email_key";

-- DropIndex
DROP INDEX "Employee_email_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Customer";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Employee";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Rent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "customerId" INTEGER NOT NULL,
    "carId" INTEGER NOT NULL,
    "price" REAL NOT NULL,
    "rentDate" DATETIME NOT NULL,
    "returnDate" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Rent_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Rent" ("carId", "createdAt", "customerId", "deletedAt", "id", "price", "rentDate", "returnDate", "updatedAt") SELECT "carId", "createdAt", "customerId", "deletedAt", "id", "price", "rentDate", "returnDate", "updatedAt" FROM "Rent";
DROP TABLE "Rent";
ALTER TABLE "new_Rent" RENAME TO "Rent";
CREATE TABLE "new_Car" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "productionYear" INTEGER NOT NULL,
    "price" REAL NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Car" ("brand", "color", "createdAt", "deletedAt", "id", "model", "price", "productionYear", "updatedAt") SELECT "brand", "color", "createdAt", "deletedAt", "id", "model", "price", "productionYear", "updatedAt" FROM "Car";
DROP TABLE "Car";
ALTER TABLE "new_Car" RENAME TO "Car";
CREATE TABLE "new_Reservation" (
    "reservationId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "carId" INTEGER NOT NULL,
    "reservationDate" DATETIME NOT NULL,
    "reservationReturnDate" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Reservation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Reservation_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Reservation" ("carId", "createdAt", "deletedAt", "reservationDate", "reservationReturnDate", "updatedAt") SELECT "carId", "createdAt", "deletedAt", "reservationDate", "reservationReturnDate", "updatedAt" FROM "Reservation";
DROP TABLE "Reservation";
ALTER TABLE "new_Reservation" RENAME TO "Reservation";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
