import channels from '../data/channels.json';

function fmt(n) {
  if (n >= 1e9) return (n / 1e9).toFixed(1) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return String(n);
}

export default function Ticker() {
  const top = [...channels].sort((a, b) => a.rank - b.rank).slice(0, 40);
  const items = [...top, ...top]; // duplicate for seamless loop

  return (
    <div className="ticker" role="marquee" aria-label="Top channels by subscriber count">
      <div className="ticker__track">
        {items.map((c, i) => (
          <span className="ticker__item" key={i}>
            <span className="ticker__rank">#{c.rank}</span>
            <span className="ticker__name">{c.name}</span>
            <span className="ticker__subs">{fmt(c.subscribers)} subs</span>
            <span className="ticker__dot">&bull;</span>
          </span>
        ))}
      </div>
    </div>
  );
}
