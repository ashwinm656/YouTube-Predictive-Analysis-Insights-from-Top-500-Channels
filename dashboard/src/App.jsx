import './App.css';
import Ticker from './components/Ticker';
import Kpi from './components/Kpi';
import { SubscriberHistogram, ViewsScatter, CategoryBar, CorrelationHeatmap } from './components/Charts';
import Predictor from './components/Predictor';
import Leaderboard from './components/Leaderboard';

export default function App() {
  return (
    <div className="page">
      <header className="topbar">
        <div className="topbar__left">
          <span className="play-mark" aria-hidden="true" />
          <div>
            <div className="nav__mark">YouTube Analytics</div>
            <div className="topbar__sub">Top 500 Global Channels</div>
          </div>
        </div>
        <div className="topbar__right">
          <span className="live-chip"><span className="live-dot" /> 500 CHANNELS &middot; LIVE ANALYSIS</span>
          <a
            className="nav__link"
            href="https://github.com/ashwinm656/YouTube-Predictive-Analysis-Insights-from-Top-500-Channels"
            target="_blank" rel="noreferrer"
          >
            Source &rarr;
          </a>
        </div>
      </header>

      <nav className="subbar">
        <a className="subbar__tab" href="#overview">Overview</a>
        <a className="subbar__tab" href="#exploring">Exploring the dataset</a>
        <a className="subbar__tab" href="#predict">Predictor</a>
        <a className="subbar__tab" href="#leaderboard">Leaderboard</a>
      </nav>

      <div className="hero__body">
        <h1 className="hero__title">
          What actually predicts a channel's subscriber count?
        </h1>
        <p className="hero__sub">
          An exploratory and predictive look at the top 500 YouTube channels by subscribers &mdash;
          video counts, view totals, categories, and a regression model trained to guess the rest.
        </p>
      </div>

      <Ticker />

      <main className="content">
        <section className="section" id="overview">
          <Kpi />
        </section>

        <section className="section" id="exploring">
          <div className="section__head">
            <h2>Exploring the dataset</h2>
          </div>
          <div className="chart-grid">
            <SubscriberHistogram />
            <ViewsScatter />
            <CategoryBar />
            <CorrelationHeatmap />
          </div>
        </section>

        <section className="section" id="predict">
          <div className="section__head">
            <h2>Predict subscribers</h2>
          </div>
          <Predictor />
        </section>

        <section className="section" id="leaderboard">
          <div className="section__head">
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
