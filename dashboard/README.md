# YT/500 — YouTube Predictive Analysis Dashboard

A React + Vite frontend for the [YouTube Predictive Analysis](https://github.com/ashwinm656/YouTube-Predictive-Analysis-Insights-from-Top-500-Channels)
project: exploratory charts over the top 500 YouTube channels, plus an interactive
subscriber predictor powered by the same linear regression model as the original notebook.

## What's inside

- `src/data/*.json` — cleaned dataset and pre-trained regression coefficients,
  generated from `youtube.csv` with the same preprocessing/train-test split as
  the original notebook (see `process_data.py` if you want to regenerate them
  from a newer CSV).
- `src/components/` — Ticker, KPI row, EDA charts (histogram, scatter,
  category bar, correlation heatmap), the predictor console, and the
  leaderboard table.
- `.github/workflows/deploy.yml` — auto-deploys to GitHub Pages on every push
  to `main`.

## Run locally

```bash
npm install
npm run dev
```

## Deploy to GitHub Pages

1. Create a new GitHub repo (or reuse an existing one) and push this project to it:

   ```bash
   git init
   git add .
   git commit -m "Initial dashboard"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```

2. In the repo on GitHub: **Settings → Pages → Build and deployment → Source**,
   select **GitHub Actions**. That's it — the included workflow
   (`.github/workflows/deploy.yml`) will build the app and publish it
   automatically on every push to `main`.

3. After the first workflow run finishes (check the **Actions** tab), your
   site will be live at:

   ```
   https://<your-username>.github.io/<your-repo>/
   ```

`vite.config.js` uses a relative `base: './'`, so it works at that subpath
without any further configuration — no need to hardcode the repo name
anywhere.

## Regenerating the data/model from a new CSV

If you refresh `youtube.csv` and want the app to reflect it, re-run the same
cleaning + regression steps as the notebook and re-export the three JSON
files in `src/data/`. A `process_data.py` reference script (pandas +
scikit-learn) is included for this — point it at your CSV and it writes
`channels.json`, `model.json`, `categories.json`, and `correlation.json`.
