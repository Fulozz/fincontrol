// src/app/dashboard/layout.tsx
""
import React from "react";
import { redirect } from "next/navigation";
import { validateToken } from "@/lib/auth";
import DashboardLayoutClient from "@/components/dashboard/dashboard-layout-client";
import { cookies } from 'next/headers';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;

  if (!token) {
    redirect("/login");
  }

  const isValid = await validateToken(token);

  if (!isValid) {
    redirect("/login");
  }

  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}