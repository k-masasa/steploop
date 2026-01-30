"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Reflection = {
  id: string;
  date: Date;
  good: string;
  bad: string | null;
  analysis: string | null;
  next_action: string | null;
};

type ReflectionHistoryDialogProps = {
  goalTitle: string;
  reflections: Reflection[];
};

export function ReflectionHistoryDialog({ goalTitle, reflections }: ReflectionHistoryDialogProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          履歴を見る
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-hidden sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{goalTitle} の振り返り履歴</DialogTitle>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto pr-2">
          <ul className="space-y-3">
            {reflections.map((reflection) => (
              <li key={reflection.id} className="rounded-md border border-gray-200 bg-gray-50 p-3">
                <p className="mb-2 font-medium text-gray-700">{formatDate(reflection.date)}</p>
                {reflection.good && (
                  <p className="mt-1 text-sm">
                    <span className="text-green-600">Good:</span> {reflection.good}
                  </p>
                )}
                {reflection.bad && (
                  <p className="mt-1 text-sm">
                    <span className="text-red-600">Bad:</span> {reflection.bad}
                  </p>
                )}
                {reflection.analysis && (
                  <p className="mt-1 text-sm">
                    <span className="text-blue-600">要因分析:</span> {reflection.analysis}
                  </p>
                )}
                {reflection.next_action && (
                  <p className="mt-1 text-sm">
                    <span className="text-purple-600">次のアクション:</span>{" "}
                    {reflection.next_action}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}
