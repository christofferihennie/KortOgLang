"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function MobileNav({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="fixed bottom-0 left-0 right-0 w-full flex justify-evenly gap-4 py-6 pb-10 border-t border-e border-t-border rounded-t-lg shadow-sm bg-gradient-to-t from-neutral-300 dark:from-gray-900 to-card z-50">
      {children}
    </div>
  );
}

export function MobileNavItem({
  icon,
  label,
  link,
}: Readonly<{
  icon: React.ReactNode;
  label: string;
  link: string;
}>) {
  const pathname = usePathname();
  const isActive =
    pathname === link || (link !== "/" && pathname.startsWith(link));

  return (
    <Link href={link} className="flex flex-col items-center m-1">
      <div
        className={cn(
          "transition-colors",
          isActive ? "text-primary" : "text-muted-foreground",
        )}
      >
        {icon}
      </div>
      <span
        className={cn(
          "text-sm transition-colors",
          isActive ? "text-primary font-medium" : "text-muted-foreground",
        )}
      >
        {label}
      </span>
    </Link>
  );
}
