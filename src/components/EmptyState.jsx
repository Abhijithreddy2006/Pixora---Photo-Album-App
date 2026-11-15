import { ArrowUp } from 'lucide-react';
import { scrollToTop } from '../utils/scroll.js';

export default function EmptyState({ variant = 'end' }) {
  if (variant === 'empty') {
    return (
      <div className="state state--empty" role="status">
        <h3 className="state__title">No photographs yet</h3>
        <p className="state__text">The photo service returned an empty collection. Please check back later.</p>
      </div>
    );
  }

  return (
    <div className="state state--end" role="status">
      <div className="separator" aria-hidden="true">
        <span />
        <svg viewBox="0 0 24 24" width="18" height="18">
          <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="12" cy="12" r="2.4" fill="currentColor" />
        </svg>
        <span />
      </div>
      <p className="state__title state__title--end">You&rsquo;ve reached the end of the collection.</p>
      <button type="button" className="btn btn--ghost" onClick={scrollToTop}>
        <ArrowUp size={16} aria-hidden="true" />
        Back to the beginning
      </button>
    </div>
  );
}
