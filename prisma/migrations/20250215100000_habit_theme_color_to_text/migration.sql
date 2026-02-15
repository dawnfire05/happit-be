-- AlterTable: themeColor was INTEGER (color index) but Prisma schema expects String (hex).
-- Convert existing index to hex (same order as Flutter habitThemeColorHexList) then change type to TEXT.
ALTER TABLE "Habit"
  ALTER COLUMN "themeColor" TYPE TEXT
  USING (
    CASE "themeColor"
      WHEN 0 THEN '#66D271'
      WHEN 1 THEN '#7D5BA6'
      WHEN 2 THEN '#FC6471'
      WHEN 3 THEN '#F8C630'
      WHEN 4 THEN '#30C5FF'
      ELSE '#66D271'
    END
  );

-- Ensure default for new rows (PostgreSQL TEXT doesn't need DEFAULT for Prisma)
ALTER TABLE "Habit" ALTER COLUMN "themeColor" SET DEFAULT '#66D271';
