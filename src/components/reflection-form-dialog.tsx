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
  Chip,
  useDisclosure,
} from "@nextui-org/react";
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
};

export function ReflectionFormDialog({
  goalId,
  goalTitle,
  existingReflection,
}: ReflectionFormDialogProps) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [good, setGood] = useState(existingReflection?.good || "");

  const today = new Date().toISOString().split("T")[0];
  const canSubmit = good.trim().length > 0;

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      await createReflection(formData);
      onClose();
      setGood("");
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
    <>
      <Button size="sm" color="primary" variant="flat" onPress={onOpen}>
        今日の振り返りを書く
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="inside" size="lg">
        <ModalContent>
          {() => (
            <form action={handleSubmit}>
              <ModalHeader className="flex flex-col gap-1">
                <span>振り返りを記録</span>
                <span className="text-small font-normal text-default-500">{goalTitle}</span>
              </ModalHeader>
              <ModalBody>
                <input type="hidden" name="goalId" value={goalId} />

                <Input
                  label="振り返り対象日"
                  name="date"
                  type="date"
                  defaultValue={
                    existingReflection
                      ? new Date(existingReflection.date).toISOString().split("T")[0]
                      : today
                  }
                  variant="bordered"
                />

                <Textarea
                  label={
                    <span className="flex items-center gap-2">
                      Good (やったこと・うまくいったこと)
                      <Chip size="sm" color="danger" variant="flat">
                        必須
                      </Chip>
                    </span>
                  }
                  name="good"
                  placeholder="今日やったこと、うまくいったことは?"
                  value={good}
                  onValueChange={setGood}
                  variant="bordered"
                  minRows={2}
                  isRequired
                />

                <Textarea
                  label="Bad (うまくいかなかったこと)"
                  name="bad"
                  placeholder="改善が必要なことは?"
                  defaultValue={existingReflection?.bad || ""}
                  variant="bordered"
                  minRows={2}
                />

                <Textarea
                  label="要因分析 (なぜそうなったか)"
                  name="analysis"
                  placeholder="なぜうまくいった/いかなかった?"
                  defaultValue={existingReflection?.analysis || ""}
                  variant="bordered"
                  minRows={2}
                />

                <Textarea
                  label="次のアクション"
                  name="nextAction"
                  placeholder="明日から何をする?"
                  defaultValue={existingReflection?.next_action || ""}
                  variant="bordered"
                  minRows={2}
                />
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  キャンセル
                </Button>
                <Button
                  color="primary"
                  type="submit"
                  isLoading={isSubmitting}
                  isDisabled={!canSubmit}
                >
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
