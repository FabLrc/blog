import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Calcule le temps de lecture estimé d'un texte
 * @param text - Le texte à analyser
 * @param wordsPerMinute - Nombre de mots lus par minute (défaut: 200 pour le français)
 * @returns Le temps de lecture en minutes
 */
export function calculateReadingTime(text: string, wordsPerMinute: number = 200): number {
  // Nettoyer le texte des balises HTML et Markdown
  const cleanText = text
    .replace(/<[^>]*>/g, '') // Supprimer les balises HTML
    .replace(/```[\s\S]*?```/g, '') // Supprimer les blocs de code
    .replace(/`[^`]*`/g, '') // Supprimer le code inline
    .replace(/!\[.*?\]\(.*?\)/g, '') // Supprimer les images
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Garder seulement le texte des liens
    .replace(/[#*_~\[\]]/g, '') // Supprimer les caractères Markdown
    .trim();

  // Compter les mots
  const wordCount = cleanText.split(/\s+/).filter(word => word.length > 0).length;

  // Calculer le temps de lecture
  const readingTime = Math.ceil(wordCount / wordsPerMinute);

  return Math.max(1, readingTime); // Minimum 1 minute
}

/**
 * Formate le temps de lecture en texte lisible
 * @param minutes - Le nombre de minutes
 * @returns Le texte formaté (ex: "5 min de lecture")
 */
export function formatReadingTime(minutes: number): string {
  if (minutes === 1) {
    return "1 min";
  }
  return `${minutes} min`;
}

/**
 * Décoder les entités HTML dans une chaîne de caractères
 * @param text - Le texte contenant des entités HTML
 * @returns Le texte décodé
 */
export function decodeHtmlEntities(text: string): string {
  if (typeof window === 'undefined') {
    // Côté serveur : utiliser replace pour les entités communes
    return text
      .replace(/&#039;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>');
  }
  // Côté client : utiliser DOMParser (plus fiable)
  const txt = document.createElement('textarea');
  txt.innerHTML = text;
  return txt.value;
}
