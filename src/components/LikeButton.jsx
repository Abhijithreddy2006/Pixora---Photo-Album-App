import { memo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp as faThumbsUpSolid } from '@fortawesome/free-solid-svg-icons';
import { faThumbsUp as faThumbsUpRegular } from '@fortawesome/free-regular-svg-icons';

/**
 * Increments on every click (no unlike/toggle, per the assignment).
 * `pulse` is bumped on each click and used as a React key so the pop
 * animation restarts even on rapid repeated clicks.
 */
function LikeButton({ count, onLike, label, variant = 'default' }) {
  const [pulse, setPulse] = useState(0);

  const handleClick = (event) => {
    event.stopPropagation();
    onLike();
    setPulse((n) => n + 1);
  };

  const liked = count > 0;

  return (
    <button
      type="button"
      className={`like-btn like-btn--${variant}${liked ? ' like-btn--liked' : ''}`}
      onClick={handleClick}
      aria-label={`Like ${label}. ${count} ${count === 1 ? 'like' : 'likes'}`}
    >
      <span key={pulse} className={`like-btn__icon${pulse ? ' like-btn__icon--pop' : ''}`}>
        <FontAwesomeIcon icon={liked ? faThumbsUpSolid : faThumbsUpRegular} />
      </span>
      <span className="like-btn__count" aria-hidden="true">
        {count}
      </span>
      {pulse > 0 && (
        <span key={`plus-${pulse}`} className="like-btn__plus" aria-hidden="true">
          +1
        </span>
      )}
    </button>
  );
}

export default memo(LikeButton);
