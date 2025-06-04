"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function MobileNav({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full flex justify-evenly py-6 border-t border-e border-t-border rounded-t-lg shadow-sm bg-gradient-to-t from-primary/10 to-card">
      {children}
    </div>
  );
}

export function MobileNavItem({ icon, label, link }: Readonly<{
  icon: React.ReactNode;
  label: string;
  link: string;
}>) {
  const pathname = usePathname();
  const isActive = pathname === link || (link !== "/" && pathname.startsWith(link));

  return (
    <Link href={link} className="flex flex-col items-center">
      <div className={cn(
        "transition-colors",
        isActive ? "text-primary" : "text-muted-foreground"
      )}>
        {icon}
      </div>
      <span className={cn(
        "text-sm transition-colors",
        isActive ? "text-primary font-medium" : "text-muted-foreground"
      )}>
        {label}
      </span>
    </Link>
  );
}
