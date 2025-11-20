import { useEffect, useState } from "react";
import { Github } from "lucide-react";
import { BorderBeam } from "@/components/ui/border-beam";

interface GithubButtonProps {
  repo: string;
}

export function GithubButton({ repo }: GithubButtonProps) {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    fetch(`https://api.github.com/repos/${repo}`)
      .then((res) => res.json())
      .then((data) => setStars(data.stargazers_count))
      .catch(() => setStars(null));
  }, [repo]);

  return (
    <a
      href={`https://github.com/${repo}`}
      target="_blank"
      rel="noopener noreferrer"
      className="relative overflow-hidden inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium bg-background hover:bg-accent transition-colors text-foreground border-border shadow-sm"
      aria-label="Voir le dépôt Github"
    >
      <BorderBeam size={40} duration={6} />
      <Github className="w-5 h-5" />
      <span className="hidden sm:inline">Github</span>
      {stars !== null && (
        <span className="ml-1 flex items-center gap-1 text-xs bg-muted rounded px-2 py-0.5">
          ★ {stars}
        </span>
      )}
    </a>
  );
}
