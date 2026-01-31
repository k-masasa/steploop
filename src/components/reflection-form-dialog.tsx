"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { createReflection } from "@/actions/reflections";
import { toast } from "sonner";

type ReflectionFormDialogProps = {
  goalId: string;
  goalTitle: string;
  existingReflection?: {
    id: string;
    good: string;
    bad: string | null;
    analysis: string | null;
    next_action: string | null;
    date: Date;
  };
  trigger?: React.ReactNode;
};

export function ReflectionFormDialog({
  goalId,
  goalTitle,
  existingReflection,
  trigger,
}: ReflectionFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [good, setGood] = useState(existingReflection?.good || "");

  // 今日の日付 (YYYY-MM-DD 形式)
  const today = new Date().toISOString().split("T")[0];

  // Good が空なら保存ボタンを非活性
  const canSubmit = good.trim().length > 0;

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      await createReflection(formData);
      setOpen(false);
      setGood(""); // フォームリセット
      toast.success("振り返りを保存しました", {
        description: "明日も頑張ろう！",
      });
    } catch (error) {
      console.error("Failed to save reflection:", error);
      toast.error("保存に失敗しました", {
        description: "もう一度お試しください",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button size="sm">今日の振り返りを書く</Button>}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>振り返りを記録</DialogTitle>
          <p className="text-sm text-gray-500">{goalTitle}</p>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <input type="hidden" name="goalId" value={goalId} />

          <div className="space-y-2">
            <Label htmlFor="date">振り返り対象日</Label>
            <Input
              id="date"
              name="date"
              type="date"
              defaultValue={
                existingReflection
                  ? new Date(existingReflection.date).toISOString().split("T")[0]
                  : today
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="good" className="flex items-center gap-2">
              Good (やったこと・うまくいったこと)
              <span className="rounded bg-red-100 px-1.5 py-0.5 text-xs font-medium text-red-600">
                必須
              </span>
            </Label>
            <Textarea
              id="good"
              name="good"
              placeholder="今日やったこと、うまくいったことは?"
              value={good}
              onChange={(e) => setGood(e.target.value)}
              rows={2}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bad">Bad (うまくいかなかったこと)</Label>
            <Textarea
              id="bad"
              name="bad"
              placeholder="改善が必要なことは?"
              defaultValue={existingReflection?.bad || ""}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="analysis">要因分析 (なぜそうなったか)</Label>
            <Textarea
              id="analysis"
              name="analysis"
              placeholder="なぜうまくいった/いかなかった?"
              defaultValue={existingReflection?.analysis || ""}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nextAction">次のアクション</Label>
            <Textarea
              id="nextAction"
              name="nextAction"
              placeholder="明日から何をする?"
              defaultValue={existingReflection?.next_action || ""}
              rows={2}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              キャンセル
            </Button>
            <Button type="submit" disabled={isSubmitting || !canSubmit}>
              {isSubmitting ? "保存中..." : "保存"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
