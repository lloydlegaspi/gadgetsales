"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import HeaderClient from "./HeaderClient";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/create", label: "Create Sale" },
  { href: "/dashboard", label: "Dashboard" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-11 max-w-5xl items-center justify-between px-5">
        <div className="flex h-full items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-2xl font-bold leading-none text-blue-700 hover:text-blue-800"
          >
            <Image
              src="/logo.png"
              alt="GadgetSales"
              width={32}
              height={32}
              className="h-8 w-8 flex-shrink-0 object-contain"
            />
            <span>GadgetSales</span>
          </Link>

          <nav className="hidden h-full items-center gap-6 md:flex">
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex h-full items-center border-b-2 pt-0.5 text-xs ${
                    isActive
                      ? "border-blue-600 font-semibold text-blue-700"
                      : "border-transparent font-medium text-slate-950 hover:text-blue-700"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <HeaderClient />
      </div>
    </header>
  );
}
