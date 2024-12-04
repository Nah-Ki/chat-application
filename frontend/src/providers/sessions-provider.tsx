"use client";
import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import React from "react";

export default function SessionProvider({ childern }: { childern: React.ReactNode }) {
  return <NextAuthSessionProvider>{childern}</NextAuthSessionProvider>;
}
