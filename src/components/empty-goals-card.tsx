"use client";

import { Card, CardBody } from "@nextui-org/react";

export function EmptyGoalsCard() {
  return (
    <Card className="border-dashed border-2 border-default-200">
      <CardBody className="py-12 text-center">
        <div className="mb-4 text-4xl">🎯</div>
        <p className="text-default-600">まだ目標がありません</p>
        <p className="mt-2 text-sm text-default-400">
          「+ 目標を追加」ボタンから最初の目標を作成しましょう
        </p>
      </CardBody>
    </Card>
  );
}
