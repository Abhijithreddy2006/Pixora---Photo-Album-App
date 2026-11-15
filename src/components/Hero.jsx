import { ArrowDown } from 'lucide-react';
import { scrollToId } from '../utils/scroll.js';
import '../styles/hero.css';

export default function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero__inner">
        <div className="hero__ornament" aria-hidden="true">
          <span className="hero__ornament-line" />
          <svg viewBox="0 0 40 40" width="34" height="34">
            <circle cx="20" cy="20" r="15" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="20" cy="20" r="8" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="20" cy="20" r="2.4" className="hero__ornament-dot" />
          </svg>
          <span className="hero__ornament-line" />
        </div>

        <p className="eyebrow">The world in frames</p>
        <h1 id="hero-title" className="hero__title">
          Every frame <em>tells</em> a story.
        </h1>
        <p className="hero__lede">
          Discover moments, explore perspectives, and experience photography through a carefully
          curated visual collection.
        </p>

        <button type="button" className="hero__cta" onClick={() => scrollToId('gallery')}>
          <span>Explore the gallery</span>
          <span className="hero__cta-icon" aria-hidden="true">
            <ArrowDown size={16} />
          </span>
        </button>
      </div>
    </section>
  );
}
