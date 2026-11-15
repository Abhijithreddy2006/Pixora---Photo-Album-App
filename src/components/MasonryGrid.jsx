import { useMemo, useRef } from 'react';
import PinCard from './PinCard.jsx';
import { useColumnCount } from '../hooks/useColumnCount.js';
import '../styles/masonry.css';

/**
 * Approximate height of a pin's caption row, expressed in "column widths"
 * (roughly 64px on a ~230px column), so placement accounts for it too.
 */
const META_HEIGHT = 0.28;
const SKELETON_RATIOS = [1.45, 0.75, 1.2, 1, 1.6, 0.85];

/**
 * Pinterest-style masonry built from explicit columns rather than CSS
 * `columns`. Each photo is placed in the currently shortest column using its
 * known aspect ratio, so:
 *  - no image needs to load before layout is known (no reflow, no jumping);
 *  - appending a page only adds to the bottom of columns — photos already on
 *    screen never move, which matters for infinite scroll.
 */
export default function MasonryGrid({ photos, likes, onLike, onOpen, loading, initialLoading }) {
  const containerRef = useRef(null);
  const columnCount = useColumnCount(containerRef);

  const columns = useMemo(() => {
    const cols = Array.from({ length: columnCount }, () => []);
    const hs = new Array(columnCount).fill(0);
    photos.forEach((photo, index) => {
      let target = 0;
      for (let c = 1; c < columnCount; c += 1) if (hs[c] < hs[target]) target = c;
      cols[target].push({ photo, index });
      hs[target] += photo.height / photo.width + META_HEIGHT;
    });
    return cols;
  }, [photos, columnCount]);

  const skeletonsPerColumn = initialLoading ? 3 : loading ? 1 : 0;

  return (
    <div
      ref={containerRef}
      className="masonry"
      style={{ '--columns': columnCount }}
      role="list"
      aria-label="Photographs"
    >
      {columns.map((column, c) => (
        <div className="masonry__column" key={c}>
          {column.map(({ photo, index }) => (
            <div role="listitem" key={photo.id}>
              <PinCard
                photo={photo}
                likeCount={likes[photo.id] || 0}
                onLike={onLike}
                onOpen={onOpen}
                eager={index < columnCount * 2}
              />
            </div>
          ))}
          {Array.from({ length: skeletonsPerColumn }).map((_, s) => (
            <div
              key={`sk-${s}`}
              className="pin-skeleton"
              aria-hidden="true"
              style={{ '--ratio': 1 / SKELETON_RATIOS[(c * 2 + s) % SKELETON_RATIOS.length] }}
            >
              <div className="pin-skeleton__media shimmer" />
              <div className="pin-skeleton__meta">
                <span className="shimmer pin-skeleton__avatar" />
                <span className="shimmer skeleton-line pin-skeleton__line" />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
