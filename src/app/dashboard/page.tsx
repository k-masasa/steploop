import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { getGoals } from "@/actions/goals";
import { getDashboardStats } from "@/actions/stats";
import { GoalFormDialog } from "@/components/goal-form-dialog";
import { GoalCard } from "@/components/goal-card";
import { ActivityHeatmap } from "@/components/activity-heatmap";
import { DashboardHeader } from "@/components/dashboard-header";
import { EmptyGoalsCard } from "@/components/empty-goals-card";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const [goals, stats] = await Promise.all([getGoals(), getDashboardStats()]);

  const handleSignOut = async () => {
    "use server";
    await signOut({ redirectTo: "/login" });
  };

  return (
    <div className="min-h-screen bg-default-50">
      <DashboardHeader
        userName={session.user.name}
        userImage={session.user.image}
        onSignOut={handleSignOut}
      />

      {/* メインコンテンツ */}
      <main className="mx-auto max-w-5xl px-4 py-8">
        {/* ウェルカムメッセージ */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold">
            おかえりなさい、{session.user.name?.split(" ")[0] || "ユーザー"}
            さん 👋
          </h2>
          <p className="mt-1 text-default-500">今日も振り返りを続けて、成長していきましょう！</p>
        </div>

        {/* アクティビティヒートマップ */}
        <section className="mb-8">
          <ActivityHeatmap activities={stats.activities} />
        </section>

        {/* 目標セクション */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">あなたの目標</h2>
            <GoalFormDialog mode="create" />
          </div>

          {goals.length === 0 ? (
            <EmptyGoalsCard />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {goals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* フッター */}
      <footer className="mt-12 border-t border-divider bg-background">
        <div className="mx-auto max-w-5xl px-4 py-4 text-center text-sm text-default-500">
          <span>© 2026 StepLoop</span>
          <span className="mx-2">|</span>
          <a href="/privacy" className="hover:underline">
            プライバシーポリシー
          </a>
        </div>
      </footer>
    </div>
  );
}
