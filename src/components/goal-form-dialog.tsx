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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createGoal, updateGoal } from "@/actions/goals";

type GoalFormDialogProps = {
  mode: "create" | "edit";
  goal?: {
    id: string;
    title: string;
    description: string | null;
  };
  trigger?: React.ReactNode;
};

export function GoalFormDialog({ mode, goal, trigger }: GoalFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      if (mode === "create") {
        await createGoal(formData);
      } else {
        await updateGoal(formData);
      }
      setOpen(false);
    } catch (error) {
      console.error("Failed to save goal:", error);
      alert("保存に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>{mode === "create" ? "+ 目標を追加" : "編集"}</Button>}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "新しい目標を追加" : "目標を編集"}</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          {mode === "edit" && goal && <input type="hidden" name="id" value={goal.id} />}
          <div className="space-y-2">
            <Label htmlFor="title">目標タイトル</Label>
            <Input
              id="title"
              name="title"
              placeholder="例: 毎日運動する"
              defaultValue={goal?.title || ""}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">詳細 (任意)</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="目標の詳細や背景を書いてください"
              defaultValue={goal?.description || ""}
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              キャンセル
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "保存中..." : "保存"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
