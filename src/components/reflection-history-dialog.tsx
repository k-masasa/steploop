"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  Card,
  CardBody,
  useDisclosure,
} from "@nextui-org/react";

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
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  };

  return (
    <>
      <Button variant="bordered" size="sm" onPress={onOpen}>
        履歴を見る
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="inside" size="lg">
        <ModalContent>
          <ModalHeader>{goalTitle} の振り返り履歴</ModalHeader>
          <ModalBody className="pb-6">
            <div className="space-y-3">
              {reflections.map((reflection) => (
                <Card key={reflection.id} className="bg-default-50">
                  <CardBody className="gap-1">
                    <p className="font-medium text-default-700">{formatDate(reflection.date)}</p>
                    <p className="text-sm">
                      <span className="text-success">Good:</span> {reflection.good}
                    </p>
                    {reflection.bad && (
                      <p className="text-sm">
                        <span className="text-danger">Bad:</span> {reflection.bad}
                      </p>
                    )}
                    {reflection.analysis && (
                      <p className="text-sm">
                        <span className="text-primary">要因分析:</span> {reflection.analysis}
                      </p>
                    )}
                    {reflection.next_action && (
                      <p className="text-sm">
                        <span className="text-secondary">次のアクション:</span>{" "}
                        {reflection.next_action}
                      </p>
                    )}
                  </CardBody>
                </Card>
              ))}
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
