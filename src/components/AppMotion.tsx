"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const INSTANT_ROUTES = new Set(["/about", "/privacy", "/terms"]);

export default function AppMotion({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (INSTANT_ROUTES.has(pathname)) {
    return <>{children}</>;
  }

  return (
    <div key={pathname} className="app-motion-root">
      {children}
    </div>
  );
}
