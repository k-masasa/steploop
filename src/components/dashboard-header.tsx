"use client";

import { Button, Avatar } from "@nextui-org/react";

type DashboardHeaderProps = {
  userName: string | null | undefined;
  userImage: string | null | undefined;
  onSignOut: () => Promise<void>;
};

export function DashboardHeader({ userName, userImage, onSignOut }: DashboardHeaderProps) {
  return (
    <header className="border-b border-divider bg-background shadow-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔄</span>
          <h1 className="text-xl font-bold">StepLoop</h1>
        </div>
        <div className="flex items-center gap-4">
          <Avatar src={userImage || undefined} name={userName || "User"} size="sm" />
          <span className="text-sm font-medium">{userName}</span>
          <form action={onSignOut}>
            <Button variant="bordered" size="sm" type="submit">
              ログアウト
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
