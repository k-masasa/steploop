"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GoalFormDialog } from "@/components/goal-form-dialog";
import { ReflectionFormDialog } from "@/components/reflection-form-dialog";

type GoalCardProps = {
  goal: {
    id: string;
    title: string;
    description: string | null;
    reflections: {
      id: string;
      date: Date;
      good: string | null;
      bad: string | null;
      analysis: string | null;
      next_action: string | null;
    }[];
  };
};

export function GoalCard({ goal }: GoalCardProps) {
  // 日付をフォーマット
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("ja-JP", {
      month: "numeric",
      day: "numeric",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{goal.title}</CardTitle>
          <GoalFormDialog
            mode="edit"
            goal={goal}
            trigger={
              <Button variant="outline" size="sm">
                編集
              </Button>
            }
          />
        </div>
        {goal.description && <p className="text-sm text-gray-500">{goal.description}</p>}
      </CardHeader>
      <CardContent>
        {/* 直近の振り返り */}
        {goal.reflections.length === 0 ? (
          <p className="text-sm text-gray-500">まだ振り返りがありません</p>
        ) : (
          <ul className="space-y-2">
            {goal.reflections.slice(0, 3).map((reflection) => (
              <li key={reflection.id} className="rounded-md bg-gray-50 p-2 text-sm">
                <span className="font-medium text-gray-600">{formatDate(reflection.date)}:</span>
                {reflection.good && (
                  <p className="mt-1">
                    <span className="text-green-600">Good:</span> {reflection.good}
                  </p>
                )}
                {reflection.bad && (
                  <p className="mt-1">
                    <span className="text-red-600">Bad:</span> {reflection.bad}
                  </p>
                )}
                {reflection.analysis && (
                  <p className="mt-1">
                    <span className="text-blue-600">要因分析:</span> {reflection.analysis}
                  </p>
                )}
                {reflection.next_action && (
                  <p className="mt-1">
                    <span className="text-purple-600">次のアクション:</span>{" "}
                    {reflection.next_action}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}

        {/* アクションボタン */}
        <div className="mt-4 flex gap-2">
          <ReflectionFormDialog goalId={goal.id} goalTitle={goal.title} />
          {goal.reflections.length > 3 && (
            <Button variant="outline" size="sm">
              履歴を見る
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
