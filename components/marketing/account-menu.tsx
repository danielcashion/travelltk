"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AccountMenu() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="size-8 animate-pulse rounded-full bg-muted" />;
  }

  if (!session?.user) {
    return (
      <Button asChild variant="outline" size="sm" className="h-9 px-4 tracking-[0.08em] uppercase">
        <Link href="/login">Sign in</Link>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Account menu">
          <UserRound />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{session.user.name ?? session.user.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/account">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/account/bookings">Bookings</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/account/saved-trips">Saved trips</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/creator-studio">Creator studio</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => {
            void signOut({ callbackUrl: "/" });
          }}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
