"use client";

import { SearchDialog } from "@/components/search-dialog";
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
import { Moon, Search, Sun } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const navItems = [
    { href: "/blog", label: "Blog" },
    { href: "/about", label: "À propos" },
    { href: "/contact", label: "Contact" },
  ];
  const { theme, toggleTheme } = useTheme();

  // Raccourci clavier Ctrl+K / Cmd+K pour ouvrir la recherche
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

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
          
          {/* Bouton de recherche */}
          <Button
            variant="outline"
            className="relative h-9 w-9 p-0 md:w-40 md:justify-start md:px-3 md:py-2"
            onClick={() => setSearchOpen(true)}
            aria-label="Rechercher"
          >
            <Search className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline-flex">Rechercher</span>
            <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 md:flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>

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

      {/* Dialog de recherche */}
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </nav>
  );
}
