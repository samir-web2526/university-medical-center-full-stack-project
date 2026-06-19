"use client";

import { Menu, LayoutDashboard, LogOut, UserCircle } from "lucide-react";
import Image from "next/image";
import logo from "@/assets/images/logo.png";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { useTransition } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { logout } from "@/services";

interface NavbarProps {
  className?: string;
  user?: { name: string; email: string; role?: string } | null;
}

const publicMenu = [
  { title: "Home", url: "/" },
  { title: "About", url: "/about" },
  { title: "Contact", url: "/contact" },
  { title: "Medical Team", url: "/medical-team" },
  { title: "Blogs", url: "/blogs" },
];

function LogoutButton({ mobile = false }: { mobile?: boolean }) {
  const [isPending, startTransition] = useTransition();
  return (
    <Button
      variant={mobile ? "outline" : "ghost"}
      size="sm"
      disabled={isPending}
      onClick={() => startTransition(() => { void logout(); })}
      className={cn(
        "gap-2 text-sm font-medium",
        mobile
          ? "w-full rounded-lg border-border text-muted-foreground"
          : "rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
      )}
    >
      <LogOut size={14} />
      {isPending ? "Logging out..." : "Log Out"}
    </Button>
  );
}

export function Navbar({ className, user }: NavbarProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border bg-card/90 backdrop-blur-md",
        className,
      )}
    >
      <div className="container mx-auto px-4">

        {/* Desktop */}
        <nav className="hidden lg:flex items-center justify-between h-16">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <Image src={logo} alt="UMC Logo" width={32} height={32} className="rounded-lg shadow-sm" />
            <div>
              <p className="text-sm font-semibold text-[#0b5394] leading-tight">
                University Medical Center
              </p>
              <p className="text-[10px] text-muted-foreground leading-tight">
                Staff &amp; Faculty Portal
              </p>
            </div>
          </Link>

          {/* Nav links — only when logged out */}
          {!user && (
            <NavigationMenu>
              <NavigationMenuList className="gap-0">
                {publicMenu.map((item) => (
                  <NavigationMenuItem key={item.title}>
                    <NavigationMenuLink
                      href={item.url}
                      className="inline-flex h-9 items-center justify-center rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
                    >
                      {item.title}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          )}

          {/* Right side */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            {user ? (
              <div className="flex items-center gap-2">
                {/* Dashboard button */}
                <Button
                  asChild
                  size="sm"
                  className="gap-1.5 bg-gradient-to-r from-[#0b5394] to-[#2196f3] hover:opacity-90 text-white rounded-lg font-semibold shadow-sm transition-opacity"
                >
                  <Link href="/dashboard">
                    <LayoutDashboard size={14} />
                    Dashboard
                  </Link>
                </Button>

                {/* Avatar dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-muted transition-colors outline-none">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-[#e8f4ff] text-[#0b5394] text-xs font-bold">
                          {user.name?.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden xl:block text-left">
                        <p className="text-xs font-semibold text-foreground leading-tight">
                          {user.name}
                        </p>
                        <p className="text-[11px] text-muted-foreground leading-tight">
                          {user.role ?? user.email}
                        </p>
                      </div>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52">
                    <DropdownMenuLabel className="pb-1">
                      <p className="text-sm font-semibold">{user.name}</p>
                      <p className="text-xs text-muted-foreground font-normal">{user.email}</p>
                      {user.role && (
                        <span className="inline-block mt-1 text-[10px] font-medium bg-[#e8f4ff] text-[#0b5394] rounded px-1.5 py-0.5">
                          {user.role}
                        </span>
                      )}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="gap-2 cursor-pointer">
                        <UserCircle size={14} />
                        My Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="gap-2 text-destructive focus:text-destructive cursor-pointer"
                      onClick={() => void logout()}
                    >
                      <LogOut size={14} />
                      Log Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground font-medium rounded-lg"
                >
                  <Link href="/auth/login">Login</Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  className="bg-gradient-to-r from-[#0b5394] to-[#2196f3] hover:opacity-90 text-white rounded-lg px-4 font-semibold shadow-sm transition-opacity"
                >
                  <Link href="/auth/register">Register</Link>
                </Button>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile */}
        <div className="flex lg:hidden items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2">
            <Image src={logo} alt="UMC Logo" width={28} height={28} className="rounded-lg" />
            <span className="text-sm font-semibold text-[#0b5394]">
              UMC Portal
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 rounded-lg border-border"
                >
                  <Menu className="size-4 text-muted-foreground" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-72 overflow-y-auto border-l border-border p-0"
              >
                <SheetHeader className="px-5 pt-5 pb-4 border-b border-border">
                  <SheetTitle className="flex items-center gap-2">
                    <Image src={logo} alt="UMC Logo" width={28} height={28} className="rounded-lg" />
                    <div className="text-left">
                      <p className="text-sm font-semibold text-[#0b5394] leading-tight">
                        University Medical Center
                      </p>
                      <p className="text-[10px] text-muted-foreground font-normal leading-tight">
                        Staff &amp; Faculty Portal
                      </p>
                    </div>
                  </SheetTitle>
                </SheetHeader>

                <div className="flex flex-col gap-5 p-5">
                  {/* Public links — logged out only */}
                  {!user && (
                    <div className="flex flex-col gap-1">
                      {publicMenu.map((item) => (
                        <Link
                          key={item.title}
                          href={item.url}
                          className="flex items-center px-3 py-2 text-sm font-medium text-foreground/80 hover:text-[#0b5394] hover:bg-muted rounded-lg transition-colors"
                        >
                          {item.title}
                        </Link>
                      ))}
                    </div>
                  )}

                  <div className="h-px bg-border" />

                  {user ? (
                    <div className="flex flex-col gap-3">
                      {/* User info */}
                      <div className="flex items-center gap-3 px-1">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-[#e8f4ff] text-[#0b5394] text-sm font-bold">
                            {user.name?.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {user.name}
                          </p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                          {user.role && (
                            <span className="inline-block mt-0.5 text-[10px] font-medium bg-[#e8f4ff] text-[#0b5394] rounded px-1.5 py-0.5">
                              {user.role}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <Button
                        asChild
                        className="w-full bg-gradient-to-r from-[#0b5394] to-[#2196f3] hover:opacity-90 text-white rounded-lg font-semibold gap-2 transition-opacity"
                      >
                        <Link href="/dashboard">
                          <LayoutDashboard size={14} />
                          Dashboard
                        </Link>
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        className="w-full rounded-lg border-border gap-2 font-medium"
                      >
                        <Link href="/profile">
                          <UserCircle size={14} />
                          My Profile
                        </Link>
                      </Button>
                      <LogoutButton mobile />
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Button
                        asChild
                        variant="outline"
                        className="w-full rounded-lg border-border font-medium"
                      >
                        <Link href="/auth/login">Login</Link>
                      </Button>
                      <Button
                        asChild
                        className="w-full bg-gradient-to-r from-[#0b5394] to-[#2196f3] hover:opacity-90 text-white rounded-lg font-semibold transition-opacity"
                      >
                        <Link href="/auth/register">Register</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

      </div>
    </header>
  );
}