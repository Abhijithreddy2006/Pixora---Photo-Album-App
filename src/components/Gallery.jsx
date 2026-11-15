import { useEffect, useRef } from 'react';
import PhotoCard from './PhotoCard.jsx';
import SkeletonLoader from './SkeletonLoader.jsx';
import LoadingIndicator from './LoadingIndicator.jsx';
import ErrorState from './ErrorState.jsx';
import EmptyState from './EmptyState.jsx';
import '../styles/gallery.css';

/** Start fetching the next page shortly before the user reaches the bottom. */
const PREFETCH_MARGIN = '0px 0px 900px 0px';

export default function Gallery({
  photos,
  status,
  error,
  hasMore,
  pagesLoaded,
  likes,
  onLike,
  onOpen,
  onLoadMore,
  onRetry,
}) {
  const sentinelRef = useRef(null);

  // The observer only exists while the feed is idle. It is recreated after
  // every successful page (status returns to 'idle'), and a fresh observer
  // immediately reports the current intersection — so if the sentinel is
  // still on screen after a short page, the next page loads automatically.
  // It is never active while a request is in flight, after an error (the
  // user retries explicitly) or once the API has returned an empty page.
  useEffect(() => {
    if (status !== 'idle' || !hasMore) return undefined;
    const node = sentinelRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          onLoadMore();
        }
      },
      { rootMargin: PREFETCH_MARGIN },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [status, hasMore, onLoadMore, photos.length]);

  const isInitialLoad = photos.length === 0 && status === 'loading';
  const count = photos.length;

  return (
    <section className="gallery" id="gallery" aria-labelledby="gallery-title">
      <header className="gallery__header">
        <p className="eyebrow">The collection</p>
        <h2 id="gallery-title" className="gallery__title">
          Explore the Gallery
        </h2>
        <p className="gallery__lede">A collection of moments captured through different perspectives.</p>
        <p className="gallery__live" aria-live="polite">
          <span className={`gallery__dot${status === 'loading' ? ' is-pulsing' : ''}`} aria-hidden="true" />
          <strong>{count}</strong>&nbsp;{count === 1 ? 'photograph' : 'photographs'} loaded
          {pagesLoaded > 0 && (
            <span className="gallery__pages">
              &nbsp;·&nbsp;{pagesLoaded} {pagesLoaded === 1 ? 'page' : 'pages'}
            </span>
          )}
        </p>
      </header>

      <div className="gallery__feed" aria-busy={status === 'loading'}>
        {photos.map((photo, index) => (
          <PhotoCard
            key={photo.id}
            photo={photo}
            likeCount={likes[photo.id] || 0}
            onLike={onLike}
            onOpen={onOpen}
            eager={index < 2}
          />
        ))}

        {isInitialLoad && <SkeletonLoader count={3} />}

        {status === 'loading' && !isInitialLoad && (
          <>
            <SkeletonLoader count={1} />
            <LoadingIndicator label="Developing more photographs…" />
          </>
        )}

        {status === 'error' && (
          <ErrorState message={error?.message} onRetry={onRetry} initial={photos.length === 0} />
        )}

        {status === 'done' && <EmptyState variant={photos.length === 0 ? 'empty' : 'end'} />}

        <div ref={sentinelRef} className="gallery__sentinel" aria-hidden="true" />
      </div>
    </section>
  );
}
