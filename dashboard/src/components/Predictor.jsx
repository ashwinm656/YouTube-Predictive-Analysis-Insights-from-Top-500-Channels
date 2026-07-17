import { useMemo, useState } from 'react';
import model from '../data/model.json';
import channels from '../data/channels.json';

function fmt(n) {
  const sign = n < 0 ? '-' : '';
  n = Math.abs(n);
  if (n >= 1e9) return sign + (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return sign + (n / 1e6).toFixed(2) + 'M';
  if (n >= 1e3) return sign + (n / 1e3).toFixed(1) + 'K';
  return sign + Math.round(n).toLocaleString();
}

export default function Predictor() {
  const [videos, setVideos] = useState(1000);
  const [views, setViews] = useState(5_000_000_000);

  const prediction = useMemo(() => {
    const raw = model.intercept + model.coef_videos * videos + model.coef_views * views;
    const predicted = Math.max(raw, 0);
    let nearest = channels[0];
    let bestDiff = Infinity;
    for (const c of channels) {
      const diff = Math.abs(c.subscribers - predicted);
      if (diff < bestDiff) { bestDiff = diff; nearest = c; }
    }
    return { predicted, nearest };
  }, [videos, views]);

  return (
    <div className="predictor">
      <div className="predictor__head">
        <span className="live-dot" aria-hidden="true" />
        <h3>Subscriber predictor</h3>
        <span className="chart-panel__eyebrow mono">LINEAR REGRESSION &middot; LIVE</span>
      </div>
      <p className="predictor__intro">
        Trained on {model.n_train} channels, tested on {model.n_test}. Adjust total videos
        and total views to see what the model would guess for subscriber count.
      </p>

      <div className="predictor__grid">
        <div className="predictor__controls">
          <label className="predictor__label" htmlFor="videos-input">
            Total videos
            <span className="mono predictor__label-val">{videos.toLocaleString()}</span>
          </label>
          <input
            id="videos-input"
            type="range" min="0" max="100000" step="10"
            value={videos}
            onChange={(e) => setVideos(Number(e.target.value))}
          />
          <input
            className="predictor__number mono"
            type="number" min="0"
            value={videos}
            onChange={(e) => setVideos(Number(e.target.value) || 0)}
          />

          <label className="predictor__label" htmlFor="views-input">
            Total views
            <span className="mono predictor__label-val">{fmt(views)}</span>
          </label>
          <input
            id="views-input"
            type="range" min="0" max="260000000000" step="1000000"
            value={views}
            onChange={(e) => setViews(Number(e.target.value))}
          />
          <input
            className="predictor__number mono"
            type="number" min="0"
            value={views}
            onChange={(e) => setViews(Number(e.target.value) || 0)}
          />
        </div>

        <div className="predictor__output">
          <div className="predictor__output-label">Predicted subscribers</div>
          <div className="predictor__output-value mono">{fmt(prediction.predicted)}</div>
          <div className="predictor__output-nearest">
            Closest real channel: <strong>{prediction.nearest.name}</strong>
            <span className="mono"> ({fmt(prediction.nearest.subscribers)} subs)</span>
          </div>
          <div className="predictor__metrics">
            <div><span className="mono">R&sup2;</span> {(model.r2 * 100).toFixed(1)}%</div>
            <div><span className="mono">MAE</span> {fmt(model.mae)}</div>
            <div><span className="mono">MAPE</span> {model.mape.toFixed(1)}%</div>
          </div>
        </div>
      </div>
      <p className="predictor__caveat">
        Note: R&sup2; &asymp; {(model.r2 * 100).toFixed(0)}% means video count and views alone explain only
        part of what drives subscriber counts &mdash; treat this as a rough estimate, not a forecast.
      </p>
    </div>
  );
}
