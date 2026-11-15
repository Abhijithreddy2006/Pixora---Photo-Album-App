import { ArrowUp } from 'lucide-react';
import Logo from './Logo.jsx';
import { scrollToTop } from '../utils/scroll.js';
import '../styles/footer.css';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <Logo size={28} />
          <p className="footer__tagline">Capturing moments. Celebrating perspectives.</p>
          <p className="footer__desc">
            A curated, endlessly scrolling photography gallery. Images courtesy of{' '}
            <a href="https://picsum.photos" target="_blank" rel="noopener noreferrer">
              Lorem Picsum
            </a>{' '}
            and the photographers credited with each frame.
          </p>
        </div>
        <button type="button" className="footer__top" onClick={scrollToTop}>
          <ArrowUp size={16} aria-hidden="true" />
          Back to top
        </button>
      </div>
      <div className="footer__rule" aria-hidden="true" />
      <div className="footer__bottom">
        <p>&copy; {year} PIXORA. All photographs remain the property of their creators.</p>
      </div>
    </footer>
  );
}
