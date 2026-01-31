"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GoalFormDialog } from "@/components/goal-form-dialog";
import { ReflectionFormDialog } from "@/components/reflection-form-dialog";
import { ReflectionHistoryDialog } from "@/components/reflection-history-dialog";

type GoalCardProps = {
  goal: {
    id: string;
    title: string;
    description: string | null;
    reflections: {
      id: string;
      date: Date;
      good: string;
      bad: string | null;
      analysis: string | null;
      next_action: string | null;
    }[];
  };
};

export function GoalCard({ goal }: GoalCardProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("ja-JP", {
      month: "numeric",
      day: "numeric",
    });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{goal.title}</CardTitle>
          <GoalFormDialog
            mode="edit"
            goal={goal}
            trigger={
              <Button
                variant="ghost"
                size="sm"
                className="opacity-60 hover:opacity-100 transition-opacity"
              >
                編集
              </Button>
            }
          />
        </div>
        {goal.description && (
          <p className="text-sm text-muted-foreground mt-1">{goal.description}</p>
        )}
      </CardHeader>
      <CardContent>
        {/* 直近の振り返り */}
        {goal.reflections.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-muted-foreground text-sm">まだ振り返りがありません</p>
            <p className="text-muted-foreground/70 text-xs mt-1">
              下のボタンから最初の振り返りを記録しよう
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {goal.reflections.slice(0, 3).map((reflection, index) => (
              <li
                key={reflection.id}
                className="border-b border-border pb-2 last:border-b-0 text-sm"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-muted-foreground">
                    {formatDate(reflection.date)}
                  </span>
                  {index === 0 && (
                    <span className="text-xs bg-muted px-1.5 py-0.5 rounded">最新</span>
                  )}
                </div>
                <p>{reflection.good}</p>
                {reflection.bad && (
                  <p className="mt-1 text-muted-foreground text-xs">課題: {reflection.bad}</p>
                )}
                {reflection.next_action && (
                  <p className="mt-1 text-muted-foreground text-xs">次: {reflection.next_action}</p>
                )}
              </li>
            ))}
          </ul>
        )}

        {/* アクションボタン */}
        <div className="mt-4 flex gap-2">
          <ReflectionFormDialog goalId={goal.id} goalTitle={goal.title} />
          {goal.reflections.length > 3 && (
            <ReflectionHistoryDialog goalTitle={goal.title} reflections={goal.reflections} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
