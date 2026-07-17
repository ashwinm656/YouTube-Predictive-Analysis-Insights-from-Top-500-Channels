import channels from '../data/channels.json';

function fmt(n) {
  if (n >= 1e12) return (n / 1e12).toFixed(2) + 'T';
  if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return String(Math.round(n));
}

export default function Kpi() {
  const n = channels.length;
  const totalViews = channels.reduce((s, c) => s + c.views, 0);
  const totalSubs = channels.reduce((s, c) => s + c.subscribers, 0);
  const avgSubs = totalSubs / n;
  const cats = {};
  channels.forEach((c) => { cats[c.category] = (cats[c.category] || 0) + 1; });
  const topCat = Object.entries(cats).sort((a, b) => b[1] - a[1])[0];

  const stats = [
    { label: 'Channels analyzed', value: n, suffix: '' },
    { label: 'Combined views', value: fmt(totalViews), suffix: '' },
    { label: 'Avg. subscribers / channel', value: fmt(avgSubs), suffix: '' },
    { label: 'Leading category', value: topCat[0], suffix: `${topCat[1]} channels` },
  ];

  return (
    <div className="kpi-row">
      {stats.map((s) => (
        <div className="kpi-card" key={s.label}>
          <div className="kpi-card__value mono">{s.value}</div>
          <div className="kpi-card__label">{s.label}</div>
          {s.suffix && <div className="kpi-card__suffix mono">{s.suffix}</div>}
        </div>
      ))}
    </div>
  );
}
