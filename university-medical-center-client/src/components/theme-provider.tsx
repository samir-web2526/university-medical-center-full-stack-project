"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

const suppressedMessages = ["Encountered a script tag while rendering React component"];
const originalError = console.error;
console.error = (...args: unknown[]) => {
  const message = typeof args[0] === "string" ? args[0] : "";
  if (suppressedMessages.some((s) => message.includes(s))) return;
  originalError(...args);
};

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...props}>
      {children}
    </NextThemesProvider>
  );
}