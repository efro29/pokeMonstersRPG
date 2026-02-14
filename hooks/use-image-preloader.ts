"use client";

import { useEffect, useRef } from "react";

/**
 * All local project images that should be preloaded into browser cache
 * on first render so they display instantly when needed.
 */
function getAllProjectImages(): string[] {
  const images: string[] = [];

  // Cards: card0.png .. card17.png
  for (let i = 0; i <= 17; i++) {
    images.push(`/images/cards/card${i}.png`);
  }

  // Card type backgrounds
  const types = [
    "bug", "dark", "dragon", "electric", "fairy", "fighting",
    "fire", "flying", "ghost", "grass", "ground", "ice",
    "normal", "poison", "psychic", "rock", "steel", "water",
  ];
  for (const t of types) {
    images.push(`/images/cardsTypes/${t}.jpg`);
  }

  // Genga special card art
  images.push("/images/cardsTypes/genga.jpg");
  images.push("/images/cardsTypes/genga.gif");

  // Arena backgrounds
  images.push("/images/arenas/campo.gif");
  images.push("/images/arenas/campo.jpg");
  images.push("/images/arenas/campo1.gif");
  images.push("/images/arenas/campo1.jpg");
  images.push("/images/arenas/campo2.jpg");

  // Pokebola
  images.push("/images/pokebola.png");

  // Profile images
  for (let i = 0; i <= 7; i++) {
    images.push(`/images/profiles/perfil${i}.jpg`);
  }

  return images;
}

/**
 * Preloads all project images into browser memory cache.
 * After this runs, every <img> referencing these paths renders instantly.
 */
export function useImagePreloader() {
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;

    const images = getAllProjectImages();

    // Use requestIdleCallback if available, otherwise setTimeout
    const schedule = typeof requestIdleCallback !== "undefined"
      ? requestIdleCallback
      : (cb: () => void) => setTimeout(cb, 0);

    schedule(() => {
      for (const src of images) {
        const img = new Image();
        img.src = src;
      }
    });
  }, []);
}
