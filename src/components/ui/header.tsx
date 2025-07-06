"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "./button";

interface HeaderProps {
  children: React.ReactNode;
  backButton?: boolean;
}

export const Header = ({ children, backButton }: HeaderProps) => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between border-b pb-2 text-3xl font-semibold mb-4">
      <h2 className="scroll-m-20 tracking-tight first:mt-0 ">{children}</h2>
      {backButton && (
        <Button onClick={() => router.back()} variant="link" size="icon">
          <ArrowLeft />
        </Button>
      )}
    </div>
  );
};
