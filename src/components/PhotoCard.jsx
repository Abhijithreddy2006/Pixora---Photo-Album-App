import { memo, useCallback, useState } from 'react';
import { ImageOff, Maximize2 } from 'lucide-react';
import LikeButton from './LikeButton.jsx';
import { buildSrcSet } from '../services/photoApi.js';
import '../styles/photoCard.css';

const SIZES = '(max-width: 960px) calc(100vw - 32px), 880px';

function formatId(id) {
  return /^\d+$/.test(id) ? id.padStart(4, '0') : id;
}

function PhotoCard({ photo, likeCount, onLike, onOpen, eager = false }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  const handleLike = useCallback(() => onLike(photo.id), [onLike, photo.id]);
  const handleOpen = useCallback(() => onOpen(photo.id), [onOpen, photo.id]);

  const ratio = photo.width / photo.height;

  return (
    <article className="photo-card" aria-labelledby={`author-${photo.id}`}>
      <div
        className={`photo-card__frame${loaded ? ' is-loaded' : ''}${failed ? ' is-failed' : ''}`}
        style={{ '--ratio': ratio }}
      >
        {failed ? (
          <div className="photo-card__fallback" role="img" aria-label={`Photo by ${photo.author} could not be loaded`}>
            <ImageOff size={28} aria-hidden="true" />
            <span>This photograph could not be loaded.</span>
          </div>
        ) : (
          <button
            type="button"
            className="photo-card__open"
            onClick={handleOpen}
            aria-label={`View photo by ${photo.author} in full screen`}
          >
            <img
              className="photo-card__img"
              src={photo.downloadUrl}
              srcSet={buildSrcSet(photo)}
              sizes={SIZES}
              width={photo.width}
              height={photo.height}
              alt={`Photograph by ${photo.author}`}
              loading={eager ? 'eager' : 'lazy'}
              fetchpriority={eager ? 'high' : undefined}
              decoding="async"
              onLoad={() => setLoaded(true)}
              onError={() => setFailed(true)}
            />
            <span className="photo-card__overlay" aria-hidden="true">
              <span className="photo-card__view">
                <Maximize2 size={15} />
                View
              </span>
            </span>
          </button>
        )}
      </div>

      <footer className="photo-card__meta">
        <div className="photo-card__credit">
          <span className="photo-card__label">Photographed by</span>
          <h3 className="photo-card__author" id={`author-${photo.id}`}>
            {photo.author}
          </h3>
        </div>
        <div className="photo-card__aside">
          <span className="photo-card__id" title={`Picsum photo ID ${photo.id}`}>
            No. {formatId(photo.id)}
          </span>
          <LikeButton count={likeCount} onLike={handleLike} label={`photo by ${photo.author}`} />
        </div>
      </footer>
    </article>
  );
}

export default memo(PhotoCard);
