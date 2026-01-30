"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

/**
 * ダッシュボード用の統計データを取得 (ヒートマップ用)
 */
export async function getDashboardStats() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // 全ての振り返りを取得 (日付順)
  const allReflections = await prisma.reflection.findMany({
    where: {
      goal: {
        user_id: session.user.id,
        deleted_at: null,
      },
      deleted_at: null,
    },
    orderBy: {
      date: "desc",
    },
    select: {
      date: true,
    },
  });

  // 日付ごとの振り返り数をカウント (ヒートマップ用)
  const activityMap = new Map<string, number>();
  allReflections.forEach((r) => {
    const dateStr = r.date.toISOString().split("T")[0];
    activityMap.set(dateStr, (activityMap.get(dateStr) || 0) + 1);
  });

  // ヒートマップ用データに変換
  const activities = Array.from(activityMap.entries()).map(([date, count]) => ({
    date,
    count,
    level: Math.min(count, 4) as 0 | 1 | 2 | 3 | 4,
  }));

  return {
    activities,
  };
}
