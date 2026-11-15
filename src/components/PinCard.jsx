import { memo, useCallback, useState } from 'react';
import { ImageOff, Maximize2 } from 'lucide-react';
import LikeButton from './LikeButton.jsx';
import { buildSrcSet } from '../services/photoApi.js';

const SIZES =
  '(max-width: 519px) 50vw, (max-width: 859px) 33vw, (max-width: 1179px) 25vw, (max-width: 1499px) 20vw, 17vw';

function initials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

function formatId(id) {
  return /^\d+$/.test(id) ? id.padStart(4, '0') : id;
}

/** A Pinterest-style tile: the photo at its natural ratio, with the credit and like counter beneath. */
function PinCard({ photo, likeCount, onLike, onOpen, eager = false }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  const handleLike = useCallback(() => onLike(photo.id), [onLike, photo.id]);
  const handleOpen = useCallback(() => onOpen(photo.id), [onOpen, photo.id]);

  return (
    <article className="pin">
      <div
        className={`pin__media${loaded ? ' is-loaded' : ''}${failed ? ' is-failed' : ''}`}
        style={{ '--ratio': photo.width / photo.height }}
      >
        {failed ? (
          <div className="pin__fallback" role="img" aria-label={`Photo by ${photo.author} could not be loaded`}>
            <ImageOff size={22} aria-hidden="true" />
          </div>
        ) : (
          <button
            type="button"
            className="pin__open"
            onClick={handleOpen}
            aria-label={`View photo by ${photo.author} in full screen`}
          >
            <img
              className="pin__img"
              src={photo.downloadUrl}
              srcSet={buildSrcSet(photo)}
              sizes={SIZES}
              width={photo.width}
              height={photo.height}
              alt={`Photograph by ${photo.author}`}
              loading={eager ? 'eager' : 'lazy'}
              decoding="async"
              onLoad={() => setLoaded(true)}
              onError={() => setFailed(true)}
            />
            <span className="pin__overlay" aria-hidden="true">
              <span className="pin__id">No. {formatId(photo.id)}</span>
              <span className="pin__expand">
                <Maximize2 size={15} />
              </span>
            </span>
          </button>
        )}
      </div>

      <div className="pin__meta">
        <span className="pin__avatar" aria-hidden="true">
          {initials(photo.author)}
        </span>
        <span className="pin__author" title={photo.author}>
          {photo.author}
        </span>
        <LikeButton count={likeCount} onLike={handleLike} label={`photo by ${photo.author}`} variant="compact" />
      </div>
    </article>
  );
}

export default memo(PinCard);
