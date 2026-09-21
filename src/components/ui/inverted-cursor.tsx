import { useEffect, useRef, useState } from "react";

interface CursorProps {
  size?: number;
}

export function Cursor({ size = 60 }: CursorProps) {
  const diffRef = useRef<HTMLDivElement>(null);
  const satRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: -size, y: -size });
  const current = useRef({ x: -size, y: -size });
  const seen = useRef(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ease = reduce ? 1 : 0.2;
    let raf = 0;

    const render = () => {
      current.current.x += (target.current.x - current.current.x) * ease;
      current.current.y += (target.current.y - current.current.y) * ease;
      const transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0)`;
      if (diffRef.current) diffRef.current.style.transform = transform;
      if (satRef.current) satRef.current.style.transform = transform;
      raf = requestAnimationFrame(render);
    };

    const onMove = (e: MouseEvent) => {
      target.current = { x: e.clientX - size / 2, y: e.clientY - size / 2 };
      if (!seen.current) {
        current.current = { ...target.current }; // sin viaje desde la esquina
        seen.current = true;
        setVisible(true);
      }
    };

    document.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(render);

    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [size]);

  return (
    <>
      <div
        ref={diffRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-50 rounded-full bg-white mix-blend-difference transition-opacity duration-300"
        style={{ width: size, height: size, opacity: visible ? 1 : 0 }}
      />
      <div
        ref={satRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-50 rounded-full bg-black mix-blend-saturation transition-opacity duration-300"
        style={{ width: size, height: size, opacity: visible ? 1 : 0 }}
      />
    </>
  );
}

export default Cursor;
