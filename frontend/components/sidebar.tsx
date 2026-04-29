"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Home, Library, Users, Settings, LogOut, BookMarked, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  role: "member" | "librarian";
}

const memberLinks = [
  { href: "/member", label: "Dashboard", icon: Home },
  { href: "/member/borrowed", label: "Borrowed Books", icon: BookMarked },
];

const librarianLinks = [
  { href: "/librarian", label: "Dashboard", icon: Home },
  { href: "/librarian/books", label: "Manage Books", icon: Library },
  { href: "/librarian/members", label: "Manage Members", icon: Users },
  { href: "/librarian/overdue", label: "Overdue Books", icon: AlertTriangle },
];

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const links = role === "member" ? memberLinks : librarianLinks;

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
          <BookOpen className="h-5 w-5 text-sidebar-primary-foreground" />
        </div>
        <span className="text-lg font-semibold text-sidebar-foreground">LibraryHub</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-4">
        <span className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {role === "member" ? "Member" : "Admin"}
        </span>
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-4">
        <Link
          href="/settings"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <Settings className="h-5 w-5" />
          Settings
        </Link>
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </Link>
      </div>
    </aside>
  );
}
