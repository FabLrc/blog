"use client";

import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { profileConfig } from "@/config/profile";
import { Moon, Sun } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  const navItems = [
    { href: "/blog", label: "Blog" },
    { href: "/about", label: "À propos" },
    { href: "/contact", label: "Contact" },
  ];
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          {profileConfig.blogTitle}
        </Link>
        <div className="flex items-center gap-4">
          <NavigationMenu>
            <NavigationMenuList>
              {navItems.map((item) => (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuLink asChild>
                    <Link href={item.href} className={navigationMenuTriggerStyle()}>
                      {item.label}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Changer le thème"
            onClick={toggleTheme}
          >
            {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
          </Button>
        </div>
      </div>
    </nav>
  );
}
