export default function Timeline({ ticks = 60, majorEvery = 10 }) {
  const items = Array.from({ length: ticks });
  return (
    <div className="timeline" aria-hidden="true">
      {items.map((_, i) => (
        <div key={i} className={`tick ${i % majorEvery === 0 ? 'major' : 'minor'}`} />
      ))}
    </div>
  );
}
