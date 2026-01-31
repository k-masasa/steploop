"use client";

import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import { createGoal, updateGoal } from "@/actions/goals";
import { toast } from "sonner";

type GoalFormDialogProps = {
  mode: "create" | "edit";
  goal?: {
    id: string;
    title: string;
    description: string | null;
  };
  triggerVariant?: "light" | "bordered" | "solid" | "flat" | "ghost";
  triggerSize?: "sm" | "md" | "lg";
  triggerLabel?: string;
};

export function GoalFormDialog({
  mode,
  goal,
  triggerVariant = mode === "create" ? "solid" : "light",
  triggerSize = mode === "create" ? "md" : "sm",
  triggerLabel,
}: GoalFormDialogProps) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      if (mode === "create") {
        await createGoal(formData);
        toast.success("目標を追加しました", {
          description: "一緒に頑張ろう！",
        });
      } else {
        await updateGoal(formData);
        toast.success("目標を更新しました");
      }
      onClose();
    } catch (error) {
      console.error("Failed to save goal:", error);
      toast.error("保存に失敗しました", {
        description: "もう一度お試しください",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const defaultLabel = mode === "create" ? "+ 目標を追加" : "編集";

  return (
    <>
      <Button
        color={mode === "create" ? "primary" : "default"}
        variant={triggerVariant}
        size={triggerSize}
        onPress={onOpen}
      >
        {triggerLabel || defaultLabel}
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {() => (
            <form action={handleSubmit}>
              <ModalHeader>{mode === "create" ? "新しい目標を追加" : "目標を編集"}</ModalHeader>
              <ModalBody>
                {mode === "edit" && goal && <input type="hidden" name="id" value={goal.id} />}
                <Input
                  label="目標タイトル"
                  name="title"
                  placeholder="例: 毎日運動する"
                  defaultValue={goal?.title || ""}
                  isRequired
                  variant="bordered"
                />
                <Textarea
                  label="詳細 (任意)"
                  name="description"
                  placeholder="目標の詳細や背景を書いてください"
                  defaultValue={goal?.description || ""}
                  variant="bordered"
                  minRows={3}
                />
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  キャンセル
                </Button>
                <Button color="primary" type="submit" isLoading={isSubmitting}>
                  保存
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
