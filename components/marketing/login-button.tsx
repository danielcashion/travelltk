"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function LoginButton({ disabled }: { disabled?: boolean }) {
  return (
    <Button
      size="lg"
      disabled={disabled}
      onClick={() => {
        void signIn("cognito", { callbackUrl: "/account" });
      }}
    >
      Continue with Google
    </Button>
  );
}
