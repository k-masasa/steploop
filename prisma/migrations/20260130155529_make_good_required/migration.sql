/*
  Warnings:

  - Made the column `good` on table `reflections` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_reflections" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "goal_id" TEXT NOT NULL,
    "good" TEXT NOT NULL,
    "bad" TEXT,
    "analysis" TEXT,
    "next_action" TEXT,
    "date" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "deleted_at" DATETIME,
    CONSTRAINT "reflections_goal_id_fkey" FOREIGN KEY ("goal_id") REFERENCES "goals" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_reflections" ("analysis", "bad", "created_at", "date", "deleted_at", "goal_id", "good", "id", "next_action", "updated_at") SELECT "analysis", "bad", "created_at", "date", "deleted_at", "goal_id", "good", "id", "next_action", "updated_at" FROM "reflections";
DROP TABLE "reflections";
ALTER TABLE "new_reflections" RENAME TO "reflections";
CREATE INDEX "reflections_goal_id_idx" ON "reflections"("goal_id");
CREATE INDEX "reflections_goal_id_date_idx" ON "reflections"("goal_id", "date");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
