/**
 * Static star field for the dark, space-inspired CTA sections and footer.
 * Fixed coordinates (not random) so server and client render identically.
 */
const STARS = [
  [4, 22, 1], [11, 68, 0.8], [18, 34, 1.2], [26, 78, 0.7], [33, 18, 1],
  [41, 55, 0.8], [48, 88, 1], [57, 26, 0.7], [64, 62, 1.1], [71, 12, 0.8],
  [78, 44, 1], [84, 74, 0.7], [91, 30, 1.1], [96, 58, 0.8], [8, 48, 0.6],
  [22, 6, 0.9], [36, 92, 0.6], [52, 40, 0.9], [67, 84, 0.6], [88, 8, 0.9],
] as const;

export function StarField() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {STARS.map(([left, top, size], i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${left}%`,
            top: `${top}%`,
            width: `${size}px`,
            height: `${size}px`,
            opacity: 0.15 + (i % 4) * 0.12,
          }}
        />
      ))}
    </div>
  );
}
