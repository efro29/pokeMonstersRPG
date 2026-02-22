import { useEffect, useRef } from "react";

export default function EnergyParticles({ color }) {
  const ref = useRef(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    let alive = true;

    const spawn = () => {
      if (!alive) return;

      const p = document.createElement("span");
      p.className = "energy-particle";

      // posição aleatória ao redor do ícone
      const x = Math.random() * 15 - 10;

      p.style.left = `calc(50% + ${x}px)`;
      p.style.top = `20px`;

      // cor do elemento
      p.style.background = color;
      p.style.boxShadow = `0 0 6px ${color}, 0 0 12px ${color}`;

      // duração aleatória
      const duration = 1.6 + Math.random() * 1.8;
      p.style.animationDuration = `${duration}s`;

      container.appendChild(p);

      setTimeout(() => {
        p.remove();
      }, duration * 1000);

      // próxima partícula (intervalo irregular = natural)
      setTimeout(spawn, 180 + Math.random() * 420);
    };

    spawn();

    return () => {
      alive = false;
    };
  }, [color]);

  return <div ref={ref} className="absolute inset-0 z-0 pointer-events-none" />;
}