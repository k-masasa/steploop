import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getGoals } from "@/actions/goals";
import { GoalFormDialog } from "@/components/goal-form-dialog";
import { GoalCard } from "@/components/goal-card";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // DB から目標と振り返りを取得
  const goals = await getGoals();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <h1 className="text-xl font-bold">StepLoop</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{session.user.name}</span>
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
      <main className="mx-auto max-w-4xl px-4 py-8">
        {/* 目標追加セクション */}
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-lg font-semibold">目標一覧</h2>
          <GoalFormDialog mode="create" />
        </div>

        {/* 目標カード一覧 */}
        {goals.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">まだ目標がありません</p>
              <p className="mt-2 text-sm text-gray-400">
                「+ 目標を追加」ボタンから最初の目標を作成しましょう
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {goals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        )}
      </main>

      {/* フッター */}
      <footer className="border-t bg-white">
        <div className="mx-auto max-w-4xl px-4 py-4 text-center text-sm text-gray-500">
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
