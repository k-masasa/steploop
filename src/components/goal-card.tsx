"use client";

import { Card, CardHeader, CardBody, Chip, Divider } from "@nextui-org/react";
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
    <Card className="w-full">
      <CardHeader className="flex justify-between items-start pb-0">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold">{goal.title}</h3>
          {goal.description && <p className="text-small text-default-500">{goal.description}</p>}
        </div>
        <GoalFormDialog mode="edit" goal={goal} />
      </CardHeader>
      <CardBody className="pt-2">
        {goal.reflections.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-default-500 text-sm">まだ振り返りがありません</p>
            <p className="text-default-400 text-xs mt-1">
              下のボタンから最初の振り返りを記録しよう
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {goal.reflections.slice(0, 3).map((reflection, index) => (
              <div key={reflection.id}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-default-400">{formatDate(reflection.date)}</span>
                  {index === 0 && (
                    <Chip size="sm" variant="flat" color="primary">
                      最新
                    </Chip>
                  )}
                </div>
                <p className="text-sm">{reflection.good}</p>
                {reflection.bad && (
                  <p className="mt-1 text-default-500 text-xs">課題: {reflection.bad}</p>
                )}
                {reflection.next_action && (
                  <p className="mt-1 text-default-500 text-xs">次: {reflection.next_action}</p>
                )}
                {index < Math.min(goal.reflections.length, 3) - 1 && <Divider className="mt-3" />}
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 flex gap-2">
          <ReflectionFormDialog goalId={goal.id} goalTitle={goal.title} />
          {goal.reflections.length > 3 && (
            <ReflectionHistoryDialog goalTitle={goal.title} reflections={goal.reflections} />
          )}
        </div>
      </CardBody>
    </Card>
  );
}
