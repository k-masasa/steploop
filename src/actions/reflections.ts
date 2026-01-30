"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getReflections(goalId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // 自分の目標か確認
  const goal = await prisma.goal.findFirst({
    where: {
      id: goalId,
      user_id: session.user.id,
      deleted_at: null,
    },
  });

  if (!goal) {
    throw new Error("Goal not found");
  }

  const reflections = await prisma.reflection.findMany({
    where: {
      goal_id: goalId,
      deleted_at: null,
    },
    orderBy: {
      date: "desc",
    },
  });

  return reflections;
}

export async function createReflection(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const goalId = formData.get("goalId") as string;
  const good = (formData.get("good") as string)?.trim() || "";
  const bad = (formData.get("bad") as string) || null;
  const analysis = (formData.get("analysis") as string) || null;
  const nextAction = (formData.get("nextAction") as string) || null;
  const dateStr = formData.get("date") as string;

  if (!goalId) {
    throw new Error("Goal ID is required");
  }

  if (!good) {
    throw new Error("Good is required");
  }

  // 自分の目標か確認
  const goal = await prisma.goal.findFirst({
    where: {
      id: goalId,
      user_id: session.user.id,
      deleted_at: null,
    },
  });

  if (!goal) {
    throw new Error("Goal not found");
  }

  // 日付のパース (指定がなければ今日)
  const date = dateStr ? new Date(dateStr) : new Date();
  date.setHours(0, 0, 0, 0);

  // 同じ日の振り返りが既にあるか確認
  const existingReflection = await prisma.reflection.findFirst({
    where: {
      goal_id: goalId,
      date: date,
      deleted_at: null,
    },
  });

  if (existingReflection) {
    // 既存の振り返りを更新
    await prisma.reflection.update({
      where: { id: existingReflection.id },
      data: {
        good,
        bad,
        analysis,
        next_action: nextAction,
      },
    });
  } else {
    // 新規作成
    await prisma.reflection.create({
      data: {
        goal_id: goalId,
        good,
        bad,
        analysis,
        next_action: nextAction,
        date,
      },
    });
  }

  revalidatePath("/dashboard");
}

export async function updateReflection(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const id = formData.get("id") as string;
  const good = (formData.get("good") as string)?.trim() || "";
  const bad = (formData.get("bad") as string) || null;
  const analysis = (formData.get("analysis") as string) || null;
  const nextAction = (formData.get("nextAction") as string) || null;

  if (!id) {
    throw new Error("ID is required");
  }

  if (!good) {
    throw new Error("Good is required");
  }

  // 振り返りを取得して、自分の目標のものか確認
  const reflection = await prisma.reflection.findFirst({
    where: {
      id,
      deleted_at: null,
    },
    include: {
      goal: true,
    },
  });

  if (!reflection || reflection.goal.user_id !== session.user.id) {
    throw new Error("Reflection not found");
  }

  await prisma.reflection.update({
    where: { id },
    data: {
      good,
      bad,
      analysis,
      next_action: nextAction,
    },
  });

  revalidatePath("/dashboard");
}

export async function deleteReflection(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const id = formData.get("id") as string;

  if (!id) {
    throw new Error("ID is required");
  }

  // 振り返りを取得して、自分の目標のものか確認
  const reflection = await prisma.reflection.findFirst({
    where: {
      id,
      deleted_at: null,
    },
    include: {
      goal: true,
    },
  });

  if (!reflection || reflection.goal.user_id !== session.user.id) {
    throw new Error("Reflection not found");
  }

  // 論理削除
  await prisma.reflection.update({
    where: { id },
    data: {
      deleted_at: new Date(),
    },
  });

  revalidatePath("/dashboard");
}
