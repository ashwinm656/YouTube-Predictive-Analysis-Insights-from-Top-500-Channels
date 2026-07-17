import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ScatterChart, Scatter, ZAxis, Cell,
} from 'recharts';
import channels from '../data/channels.json';
import correlation from '../data/correlation.json';

function fmtShort(n) {
  if (n >= 1e9) return (n / 1e9).toFixed(0) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(0) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(0) + 'K';
  return String(n);
}

function buildHistogram(values, bins = 16) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const width = (max - min) / bins;
  const counts = new Array(bins).fill(0);
  values.forEach((v) => {
    let idx = Math.floor((v - min) / width);
    if (idx >= bins) idx = bins - 1;
    if (idx < 0) idx = 0;
    counts[idx]++;
  });
  return counts.map((count, i) => ({
    label: fmtShort(min + i * width),
    count,
  }));
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="chart-tooltip">
      {label !== undefined && <div className="chart-tooltip__label">{label}</div>}
      {payload.map((p, i) => (
        <div key={i} className="chart-tooltip__row mono">{p.name}: {p.value}</div>
      ))}
    </div>
  );
};

export function SubscriberHistogram() {
  const data = buildHistogram(channels.map((c) => c.subscribers), 16);
  return (
    <div className="chart-panel">
      <div className="chart-panel__head">
        <h3>Subscriber distribution</h3>
        <span className="chart-panel__eyebrow mono">HISTOGRAM &middot; 16 BINS</span>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
          <CartesianGrid stroke="var(--line-soft)" vertical={false} />
          <XAxis dataKey="label" tick={{ fill: 'var(--text-dim)', fontSize: 11 }} axisLine={{ stroke: 'var(--line)' }} tickLine={false} interval={2} />
          <YAxis tick={{ fill: 'var(--text-dim)', fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(230,57,74,0.08)' }} />
          <Bar dataKey="count" name="Channels" fill="var(--accent-crimson)" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <p className="chart-panel__note">Most channels cluster near the low end; a handful of mega-channels stretch the tail far to the right.</p>
    </div>
  );
}

export function ViewsScatter() {
  const data = channels.map((c) => ({
    views: c.views,
    subscribers: c.subscribers,
    name: c.name,
  }));
  return (
    <div className="chart-panel">
      <div className="chart-panel__head">
        <h3>Views vs. subscribers</h3>
        <span className="chart-panel__eyebrow mono">SCATTER &middot; 500 CHANNELS</span>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <ScatterChart margin={{ top: 8, right: 16, left: -8, bottom: 0 }}>
          <CartesianGrid stroke="var(--line-soft)" />
          <XAxis
            dataKey="views" name="Views" type="number"
            tickFormatter={fmtShort}
            tick={{ fill: 'var(--text-dim)', fontSize: 11 }} axisLine={{ stroke: 'var(--line)' }} tickLine={false}
          />
          <YAxis
            dataKey="subscribers" name="Subscribers" type="number"
            tickFormatter={fmtShort}
            tick={{ fill: 'var(--text-dim)', fontSize: 11 }} axisLine={false} tickLine={false}
          />
          <ZAxis range={[18, 18]} />
          <Tooltip
            cursor={{ stroke: 'var(--accent-teal)', strokeDasharray: '3 3' }}
            content={({ active, payload }) => {
              if (!active || !payload || !payload.length) return null;
              const d = payload[0].payload;
              return (
                <div className="chart-tooltip">
                  <div className="chart-tooltip__label">{d.name}</div>
                  <div className="chart-tooltip__row mono">Views: {fmtShort(d.views)}</div>
                  <div className="chart-tooltip__row mono">Subs: {fmtShort(d.subscribers)}</div>
                </div>
              );
            }}
          />
          <Scatter data={data} fill="var(--accent-crimson)" fillOpacity={0.45} />
        </ScatterChart>
      </ResponsiveContainer>
      <p className="chart-panel__note">Views and subscribers trend together, but loosely &mdash; the spread is exactly why the model below tops out around R&sup2; &asymp; 0.27.</p>
    </div>
  );
}

export function CategoryBar() {
  const cats = {};
  channels.forEach((c) => { cats[c.category] = (cats[c.category] || 0) + 1; });
  const data = Object.entries(cats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([category, count]) => ({ category, count }));
  const colors = ['#FF0000', '#E11414', '#C62828', '#B23A48', '#8E2434', '#D9636B', '#F08A8F', '#7A1E1E', '#F4A5A9', '#5C1414'];

  return (
    <div className="chart-panel">
      <div className="chart-panel__head">
        <h3>Top 10 categories</h3>
        <span className="chart-panel__eyebrow mono">BY CHANNEL COUNT</span>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} layout="vertical" margin={{ top: 8, right: 24, left: 8, bottom: 0 }}>
          <CartesianGrid stroke="var(--line-soft)" horizontal={false} />
          <XAxis type="number" tick={{ fill: 'var(--text-dim)', fontSize: 11 }} axisLine={{ stroke: 'var(--line)' }} tickLine={false} />
          <YAxis dataKey="category" type="category" width={130} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(244,166,32,0.08)' }} />
          <Bar dataKey="count" name="Channels" radius={[0, 3, 3, 0]}>
            {data.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CorrelationHeatmap() {
  const keys = ['RANK', 'TOTAL_NUMBER_OF_VIDEOS', 'SUBSCRIBERS', 'VIEWS'];
  const labels = { RANK: 'Rank', TOTAL_NUMBER_OF_VIDEOS: 'Videos', SUBSCRIBERS: 'Subscribers', VIEWS: 'Views' };

  function colorFor(v) {
    const abs = Math.min(Math.abs(v), 1);
    if (v >= 0) {
      return `hsl(0, 85%, ${92 - abs * 62}%)`;
    }
    return `hsl(210, 12%, ${92 - abs * 45}%)`;
  }
  function textColorFor(v) {
    return Math.abs(v) > 0.45 ? '#fff' : '#3F3F3F';
  }

  return (
    <div className="chart-panel">
      <div className="chart-panel__head">
        <h3>Correlation matrix</h3>
        <span className="chart-panel__eyebrow mono">PEARSON &middot; NUMERIC FIELDS</span>
      </div>
      <div className="heatmap">
        <div className="heatmap__row heatmap__row--head">
          <div className="heatmap__cell heatmap__cell--corner" />
          {keys.map((k) => <div key={k} className="heatmap__cell heatmap__cell--head mono">{labels[k]}</div>)}
        </div>
        {keys.map((rk) => (
          <div className="heatmap__row" key={rk}>
            <div className="heatmap__cell heatmap__cell--head mono">{labels[rk]}</div>
            {keys.map((ck) => {
              const v = correlation[rk][ck];
              return (
                <div
                  key={ck}
                  className="heatmap__cell heatmap__cell--val mono"
                  style={{ background: colorFor(v), color: textColorFor(v) }}
                  title={`${labels[rk]} vs ${labels[ck]}: ${v}`}
                >
                  {v.toFixed(2)}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <p className="chart-panel__note">Views correlates with subscribers far more strongly than video count does &mdash; posting more doesn't reliably buy more subscribers.</p>
    </div>
  );
}
