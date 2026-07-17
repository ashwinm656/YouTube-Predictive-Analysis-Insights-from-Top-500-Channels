import './App.css';
import Ticker from './components/Ticker';
import Kpi from './components/Kpi';
import { SubscriberHistogram, ViewsScatter, CategoryBar, CorrelationHeatmap } from './components/Charts';
import Predictor from './components/Predictor';
import Leaderboard from './components/Leaderboard';

export default function App() {
  return (
    <div className="page">
      <header className="hero">
        <nav className="nav">
          <span className="nav__mark mono">YT/500</span>
          <a
            className="nav__link"
            href="https://github.com/ashwinm656/YouTube-Predictive-Analysis-Insights-from-Top-500-Channels"
            target="_blank" rel="noreferrer"
          >
            Source dataset &amp; notebook &rarr;
          </a>
        </nav>
        <div className="hero__body">
          <span className="hero__eyebrow mono"><span className="live-dot" /> 500 CHANNELS &middot; LIVE ANALYSIS</span>
          <h1 className="hero__title">
            What actually predicts a channel's subscriber count?
          </h1>
          <p className="hero__sub">
            An exploratory and predictive look at the top 500 YouTube channels by subscribers &mdash;
            video counts, view totals, categories, and a regression model trained to guess the rest.
          </p>
        </div>
      </header>

      <Ticker />

      <main className="content">
        <section className="section">
          <Kpi />
        </section>

        <section className="section">
          <div className="section__head">
            <span className="section__index mono">01</span>
            <h2>Exploring the dataset</h2>
          </div>
          <div className="chart-grid">
            <SubscriberHistogram />
            <ViewsScatter />
            <CategoryBar />
            <CorrelationHeatmap />
          </div>
        </section>

        <section className="section">
          <div className="section__head">
            <span className="section__index mono">02</span>
            <h2>Predict subscribers</h2>
          </div>
          <Predictor />
        </section>

        <section className="section">
          <div className="section__head">
            <span className="section__index mono">03</span>
            <h2>Leaderboard</h2>
          </div>
          <Leaderboard />
        </section>
      </main>

      <footer className="footer">
        <p>
          Data: top 500 YouTube channels by subscriber count. Model: linear regression on video count and
          total views, scikit-learn, 80/20 split.
        </p>
      </footer>
    </div>
  );
}
