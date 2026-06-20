"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const INSTANT_ROUTES = new Set(["/about", "/privacy", "/terms"]);

export default function AppMotion({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (
    pathname === "/" ||
    INSTANT_ROUTES.has(pathname) ||
    pathname.startsWith("/share/") ||
    pathname.startsWith("/c/")
  ) {
    return <>{children}</>;
  }

  return (
    <div key={pathname} className="app-motion-root">
      {children}
    </div>
  );
}
