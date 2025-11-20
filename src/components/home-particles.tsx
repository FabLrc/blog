"use client";

import { useTheme } from "@/components/theme-provider";
import { Particles } from "@/components/ui/particles";
import { useEffect, useState } from "react";

export function HomeParticles() {
  const { theme } = useTheme();
  const [color, setColor] = useState("#ffffff");

  useEffect(() => {
    setColor(theme === "dark" ? "#ffffffff" : "#000000");
  }, [theme]);

  return (
    <Particles
      className="absolute inset-0 -z-10 animate-fade-in"
      quantity={100}
      ease={80}
      color={color}
      refresh
    />
  );
}
