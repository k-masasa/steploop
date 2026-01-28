"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getGoals() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const goals = await prisma.goal.findMany({
    where: {
      user_id: session.user.id,
      deleted_at: null,
    },
    include: {
      reflections: {
        where: {
          deleted_at: null,
        },
        orderBy: {
          date: "desc",
        },
        take: 5,
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return goals;
}

export async function createGoal(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title") as string;
  const description = (formData.get("description") as string) || null;

  if (!title || title.trim() === "") {
    throw new Error("Title is required");
  }

  // ユーザーが存在するか確認、なければ作成
  const existingUser = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!existingUser) {
    await prisma.user.create({
      data: {
        id: session.user.id,
        email: session.user.email ?? "",
        name: session.user.name ?? "Unknown",
        image: session.user.image,
      },
    });
  }

  await prisma.goal.create({
    data: {
      title: title.trim(),
      description,
      user_id: session.user.id,
    },
  });

  revalidatePath("/dashboard");
}

export async function updateGoal(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const description = (formData.get("description") as string) || null;

  if (!id || !title || title.trim() === "") {
    throw new Error("ID and title are required");
  }

  // 自分の目標か確認
  const goal = await prisma.goal.findFirst({
    where: {
      id,
      user_id: session.user.id,
      deleted_at: null,
    },
  });

  if (!goal) {
    throw new Error("Goal not found");
  }

  await prisma.goal.update({
    where: { id },
    data: {
      title: title.trim(),
      description,
    },
  });

  revalidatePath("/dashboard");
}

export async function archiveGoal(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const id = formData.get("id") as string;

  if (!id) {
    throw new Error("ID is required");
  }

  // 自分の目標か確認
  const goal = await prisma.goal.findFirst({
    where: {
      id,
      user_id: session.user.id,
      deleted_at: null,
    },
  });

  if (!goal) {
    throw new Error("Goal not found");
  }

  await prisma.goal.update({
    where: { id },
    data: {
      status: "archived",
    },
  });

  revalidatePath("/dashboard");
}

export async function deleteGoal(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const id = formData.get("id") as string;

  if (!id) {
    throw new Error("ID is required");
  }

  // 自分の目標か確認
  const goal = await prisma.goal.findFirst({
    where: {
      id,
      user_id: session.user.id,
      deleted_at: null,
    },
  });

  if (!goal) {
    throw new Error("Goal not found");
  }

  // 論理削除
  await prisma.goal.update({
    where: { id },
    data: {
      deleted_at: new Date(),
    },
  });

  revalidatePath("/dashboard");
}
