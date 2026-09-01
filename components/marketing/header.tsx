"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { AccountMenu } from "@/components/marketing/account-menu";
import { LogoWordmark } from "@/components/marketing/logo";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { PRIMARY_NAV } from "@/lib/constants";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" aria-label="TravelLTK home" className="flex shrink-0 items-center">
          <LogoWordmark alt="" priority className="h-8 sm:h-9" />
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
          {PRIMARY_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <AccountMenu />
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>
                  <LogoWordmark alt="TravelLTK" className="h-8" />
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-4" aria-label="Mobile">
                {PRIMARY_NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-base font-medium text-foreground"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <Separator className="my-6" />
              <AccountMenu />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
