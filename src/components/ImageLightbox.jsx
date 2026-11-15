import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, ExternalLink, X } from 'lucide-react';
import LikeButton from './LikeButton.jsx';
import { getSizedUrl } from '../services/photoApi.js';
import { useModal } from '../hooks/useModal.js';
import '../styles/lightbox.css';

const SWIPE_THRESHOLD = 50;

export default function ImageLightbox({
  photos,
  index,
  likes,
  hasMore,
  onLike,
  onNavigate,
  onClose,
  onNearEnd,
}) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const touchStartX = useRef(null);
  const photo = photos[index];
  const [loadedSrc, setLoadedSrc] = useState(null);

  useModal(dialogRef, onClose, { initialFocusRef: closeRef });

  const hasPrev = index > 0;
  const hasNext = index < photos.length - 1;

  // Functional updates so rapid key repeats never act on a stale index.
  const lastIndex = photos.length - 1;
  const goPrev = useCallback(() => {
    onNavigate((current) => Math.max(0, current - 1));
  }, [onNavigate]);

  const goNext = useCallback(() => {
    onNavigate((current) => Math.min(lastIndex, current + 1));
  }, [lastIndex, onNavigate]);

  // Arrow-key navigation (Escape and focus trapping live in useModal).
  useEffect(() => {
    function onKey(event) {
      if (event.key === 'ArrowLeft') goPrev();
      else if (event.key === 'ArrowRight') goNext();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [goPrev, goNext]);

  // Keep the stream flowing: approaching the last loaded photo requests the next page.
  useEffect(() => {
    if (hasMore && index >= photos.length - 3) onNearEnd();
  }, [index, photos.length, hasMore, onNearEnd]);

  // Preload neighbours so prev/next feel instant.
  useEffect(() => {
    [photos[index - 1], photos[index + 1]].forEach((neighbour) => {
      if (neighbour) new Image().src = getSizedUrl(neighbour, 1920);
    });
  }, [index, photos]);

  const handleLike = useCallback(() => onLike(photo.id), [onLike, photo.id]);

  const onTouchStart = (event) => {
    touchStartX.current = event.touches[0].clientX;
  };
  const onTouchEnd = (event) => {
    if (touchStartX.current == null) return;
    const delta = event.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (delta > SWIPE_THRESHOLD) goPrev();
    else if (delta < -SWIPE_THRESHOLD) goNext();
  };

  const src = getSizedUrl(photo, 1920);

  return createPortal(
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`Photo by ${photo.author}`}
      ref={dialogRef}
      tabIndex={-1}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="lightbox__backdrop" onClick={onClose} aria-hidden="true" />

      <div className="lightbox__topbar">
        <span className="lightbox__counter">
          {index + 1} <span aria-hidden="true">/</span>
          <span className="visually-hidden">of</span> {photos.length}
          {hasMore ? '+' : ''}
        </span>
        <button
          type="button"
          ref={closeRef}
          className="lightbox__icon-btn"
          onClick={onClose}
          aria-label="Close full-screen view"
        >
          <X size={22} aria-hidden="true" />
        </button>
      </div>

      <button
        type="button"
        className="lightbox__nav lightbox__nav--prev"
        onClick={goPrev}
        disabled={!hasPrev}
        aria-label="Previous photo"
      >
        <ChevronLeft size={26} aria-hidden="true" />
      </button>

      <figure className="lightbox__figure">
        <div
          className="lightbox__stage"
          onClick={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          {loadedSrc !== src && <span className="lightbox__spinner" aria-hidden="true" />}
          <img
            key={photo.id}
            className={`lightbox__img${loadedSrc === src ? ' is-loaded' : ''}`}
            src={src}
            width={photo.width}
            height={photo.height}
            alt={`Photograph by ${photo.author}`}
            onLoad={() => setLoadedSrc(src)}
          />
        </div>
        <figcaption className="lightbox__caption">
          <div>
            <span className="lightbox__label">Photographed by</span>
            <span className="lightbox__author">{photo.author}</span>
          </div>
          <div className="lightbox__caption-actions">
            <a
              className="lightbox__link"
              href={photo.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Original
              <ExternalLink size={14} aria-hidden="true" />
            </a>
            <LikeButton
              count={likes[photo.id] || 0}
              onLike={handleLike}
              label={`photo by ${photo.author}`}
              variant="dark"
            />
          </div>
        </figcaption>
      </figure>

      <button
        type="button"
        className="lightbox__nav lightbox__nav--next"
        onClick={goNext}
        disabled={!hasNext}
        aria-label="Next photo"
      >
        <ChevronRight size={26} aria-hidden="true" />
      </button>
    </div>,
    document.body,
  );
}
