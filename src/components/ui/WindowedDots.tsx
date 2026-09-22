// Paginador de dots "en ventana": para carruseles con muchos items, muestra
// sólo unos pocos dots a la vez (centrados en el activo) en vez de uno por
// item, con los bordes de la ventana más chicos cuando hay más contenido de
// ese lado (patrón tipo iOS). Mismo estilo visual que los dots de Academy.
interface WindowedDotsProps {
  count: number;
  active: number;
  onSelect: (index: number) => void;
  getLabel: (index: number) => string;
  windowSize?: number;
}

export default function WindowedDots({ count, active, onSelect, getLabel, windowSize = 5 }: WindowedDotsProps) {
  const size = Math.min(windowSize, count);
  const start = Math.max(0, Math.min(active - Math.floor(size / 2), count - size));
  const end = start + size;

  const indexes = Array.from({ length: size }, (_, i) => start + i);

  return (
    <div className="flex items-center justify-center gap-2">
      {indexes.map((i) => {
        const isEdge = i === start || i === end - 1;
        const hasMoreBeyondEdge = (i === start && start > 0) || (i === end - 1 && end < count);
        const small = isEdge && hasMoreBeyondEdge;

        return (
          <button
            key={i}
            type="button"
            onClick={() => onSelect(i)}
            aria-label={getLabel(i)}
            className={`relative h-1.5 rounded-full transition-all duration-300 before:absolute before:-inset-x-1 before:-inset-y-4 before:content-[''] ${
              i === active
                ? "w-6 bg-accent"
                : small
                  ? "w-1 bg-ink/20 hover:bg-ink/35"
                  : "w-1.5 bg-ink/20 hover:bg-ink/35"
            }`}
          />
        );
      })}
    </div>
  );
}
