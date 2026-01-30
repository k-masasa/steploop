import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getGoals } from "@/actions/goals";
import { getDashboardStats } from "@/actions/stats";
import { GoalFormDialog } from "@/components/goal-form-dialog";
import { GoalCard } from "@/components/goal-card";
import { ActivityHeatmap } from "@/components/activity-heatmap";

/**
 * ダッシュボードのデザイン方針:
 *
 * 【レイアウト】
 * - 上から: ヘッダー → 統計カード → ヒートマップ → 目標一覧
 * - 視線の流れ: まず「どれだけ頑張ってるか」→「詳細な目標」
 * - 最初に統計を見せることで達成感を与え、モチベーションを維持
 *
 * 【色味】
 * - 背景: #f9fafb (薄いグレー) - 目に優しく長時間見ても疲れない
 * - アクセント: オレンジ (ストリーク) / 緑 (達成) / 青 (分析)
 * - 白いカードで情報をグルーピング、視認性向上
 *
 * 【余白】
 * - セクション間: 2rem (32px) - 情報のまとまりを明確に
 * - 要素間: 1rem (16px) - 関連する情報は近くに
 */
export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // DB からデータを取得 (並列実行で高速化)
  const [goals, stats] = await Promise.all([getGoals(), getDashboardStats()]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔄</span>
            <h1 className="text-xl font-bold text-gray-800">StepLoop</h1>
          </div>
          <div className="flex items-center gap-4">
            {session.user.image && (
              <img
                src={session.user.image}
                alt={session.user.name || "User"}
                className="h-8 w-8 rounded-full"
              />
            )}
            <span className="text-sm font-medium text-gray-700">{session.user.name}</span>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/login" });
              }}
            >
              <Button variant="outline" size="sm" type="submit">
                ログアウト
              </Button>
            </form>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="mx-auto max-w-5xl px-4 py-8">
        {/* ウェルカムメッセージ */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            おかえりなさい、{session.user.name?.split(" ")[0] || "ユーザー"}
            さん 👋
          </h2>
          <p className="mt-1 text-gray-600">今日も振り返りを続けて、成長していきましょう！</p>
        </div>

        {/* アクティビティヒートマップ */}
        <section className="mb-8">
          <ActivityHeatmap activities={stats.activities} />
        </section>

        {/* 目標セクション */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">あなたの目標</h2>
            <GoalFormDialog mode="create" />
          </div>

          {goals.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center">
                <div className="mb-4 text-4xl">🎯</div>
                <p className="text-gray-600">まだ目標がありません</p>
                <p className="mt-2 text-sm text-gray-400">
                  「+ 目標を追加」ボタンから最初の目標を作成しましょう
                </p>
              </CardContent>
            </Card>
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
      <footer className="mt-12 border-t bg-white">
        <div className="mx-auto max-w-5xl px-4 py-4 text-center text-sm text-gray-500">
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
