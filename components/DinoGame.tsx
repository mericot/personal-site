"use client";

import { track } from "@vercel/analytics";
import { useEffect, useRef, useState } from "react";

// A small runner for the 404 page: a dino, a ground line, cacti, one button. Drawn at 2x for crisp pixels.
const DINO = [
  ".....######",
  ".....#.####",
  ".....######",
  ".....####..",
  "#....######",
  "##..#######",
  "##########.",
  ".########..",
  "..######...",
  "...####....",
  "...#..#....",
  "...##.##...",
];
const CACTUS = [".#.", "##.", "###", ".#.", ".#.", ".#."];
const W = 1280;
const H = 320;
const S = 8; // size of one "pixel"
const GROUND = H - 48;

const pad = (n: number) => String(Math.min(n, 99999)).padStart(5, "0");

export function DinoGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [hi, setHi] = useState(0);
  const [hint, setHint] = useState("Tap or press space to jump");

  useEffect(() => {
    const cv = canvasRef.current;
    const cx = cv?.getContext("2d");
    if (!cv || !cx) return;

    let best = Number(localStorage.getItem("dino-hi") || 0);
    setHi(best);

    let dino = { x: 80, y: GROUND, vy: 0 };
    let obstacles: { x: number }[] = [];
    let speed = 7;
    let points = 0;
    let running = false;
    let over = false;
    let t = 0;
    let raf = 0;

    const sprite = (rows: string[], x: number, y: number) => {
      rows.forEach((row, r) =>
        [...row].forEach((ch, c) => {
          if (ch === "#") cx.fillRect(x + c * S, y - (rows.length - r) * S, S, S);
        }),
      );
    };

    const draw = () => {
      cx.clearRect(0, 0, W, H);
      cx.fillStyle = "#ffffff";
      cx.fillRect(0, GROUND, W, 2);
      sprite(DINO, dino.x, dino.y);
      cx.fillStyle = "#000000";
      cx.fillRect(dino.x + 6 * S, dino.y - 11 * S, S, S); // eye
      cx.fillStyle = "#ffffff";
      obstacles.forEach((o) => sprite(CACTUS, o.x, GROUND));
      if (over) {
        cx.font = '700 28px "Inter Tight", Inter, sans-serif';
        cx.textAlign = "center";
        cx.fillText("Game over. Tap to run it back.", W / 2, 90);
      }
    };

    const reset = () => {
      dino = { x: 80, y: GROUND, vy: 0 };
      obstacles = [];
      speed = 7;
      points = 0;
      over = false;
      t = 0;
      setScore(0);
      draw();
    };

    const end = () => {
      over = true;
      running = false;
      if (points > best) {
        best = points;
        localStorage.setItem("dino-hi", String(best));
        setHi(best);
      }
      draw();
      track("404-game-over", { score: points });
    };

    const step = () => {
      t += 1;
      dino.vy += 1.1;
      dino.y = Math.min(GROUND, dino.y + dino.vy);
      if (dino.y === GROUND) dino.vy = 0;

      if (t % Math.max(40, 90 - Math.floor(points / 100)) === 0 && Math.random() < 0.8) obstacles.push({ x: W + 20 });
      obstacles.forEach((o) => (o.x -= speed));
      obstacles = obstacles.filter((o) => o.x > -CACTUS[0].length * S);

      points += 1;
      if (points % 300 === 0) speed += 0.5;
      if (points % 5 === 0) setScore(points);

      const dw = DINO[0].length * S;
      const dh = DINO.length * S;
      const ow = CACTUS[0].length * S;
      const oh = CACTUS.length * S;
      const hit = obstacles.some(
        (o) => dino.x + 2 * S < o.x + ow && dino.x + dw - 2 * S > o.x && dino.y > GROUND - oh && dino.y - dh < GROUND,
      );

      draw();
      if (hit) return end();
      raf = requestAnimationFrame(step);
    };

    const start = () => {
      running = true;
      setHint("Jump the cacti");
      track("404-game-start");
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(step);
    };

    const jump = () => {
      if (over) {
        reset();
        return start();
      }
      if (!running) return start();
      if (dino.y === GROUND) dino.vy = -17;
    };

    const onPointer = (e: PointerEvent) => {
      e.preventDefault();
      jump();
    };
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        jump();
      }
    };

    cv.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    reset();
    return () => {
      cancelAnimationFrame(raf);
      cv.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <section aria-label="Dino game" className="flex flex-col gap-4 border-2 border-fg p-6">
      <div className="flex justify-between gap-4 font-mono text-[13px] tracking-[0.08em] text-muted uppercase">
        <span>{hint}</span>
        <span>
          HI {pad(hi)}&nbsp;&nbsp;{pad(score)}
        </span>
      </div>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        aria-label="A pixel dinosaur running past cacti. Press space or tap to jump."
        className="block h-40 w-full cursor-pointer touch-manipulation"
      />
      <p className="m-0 font-mono text-xs text-muted">A small runner in the spirit of Chromium&apos;s offline page · your best score stays in this browser</p>
    </section>
  );
}
