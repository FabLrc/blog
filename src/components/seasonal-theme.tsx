"use client";

import { useEffect, useState } from "react";
import Snowfall from "react-snowfall";

/**
 * Composant qui affiche des effets saisonniers en fonction du mois actuel
 */
export default function SeasonalTheme() {
  const [showSnowfall, setShowSnowfall] = useState(false);

  useEffect(() => {
    // Vérifier le mois actuel
    const currentMonth = new Date().getMonth(); // 0-11 (0 = janvier, 11 = décembre)
    
    // Afficher les flocons en décembre (11) et janvier (0)
    if (currentMonth === 11 || currentMonth === 0) {
      setShowSnowfall(true);
    }
  }, []);

  if (!showSnowfall) {
    return null;
  }

  return (
    <Snowfall
      // Nombre de flocons de neige
      snowflakeCount={120}
      // Vitesse de chute (en pixels par frame)
      speed={[0.5, 1.5]}
      // Vitesse du vent
      wind={[-0.5, 1.0]}
      // Rayon des flocons
      radius={[0.5, 3.0]}
      // Style personnalisé (optionnel)
      style={{
        position: "fixed",
        width: "100vw",
        height: "100vh",
        zIndex: 9999,
        pointerEvents: "none",
      }}
    />
  );
}
