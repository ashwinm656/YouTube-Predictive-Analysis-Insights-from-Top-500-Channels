import { useState } from 'react';
import channels from '../data/channels.json';

function fmt(n) {
  if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return String(n);
}

export default function Leaderboard() {
  const [count, setCount] = useState(10);
  const rows = [...channels].sort((a, b) => a.rank - b.rank).slice(0, count);

  return (
    <div className="chart-panel">
      <div className="chart-panel__head">
        <h3>Leaderboard</h3>
        <span className="chart-panel__eyebrow mono">TOP {count} BY SUBSCRIBERS</span>
      </div>
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Channel</th>
              <th>Category</th>
              <th>Videos</th>
              <th>Subscribers</th>
              <th>Views</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.rank}>
                <td className="mono">#{c.rank}</td>
                <td>{c.name}</td>
                <td className="table__category">{c.category}</td>
                <td className="mono">{fmt(c.videos)}</td>
                <td className="mono table__subs">{fmt(c.subscribers)}</td>
                <td className="mono">{fmt(c.views)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {count < 500 && (
        <button className="btn-ghost" onClick={() => setCount((c) => Math.min(c + 15, 500))}>
          Show more
        </button>
      )}
    </div>
  );
}
