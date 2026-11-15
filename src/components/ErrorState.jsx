import { RotateCw } from 'lucide-react';

export default function ErrorState({ message, onRetry, initial = false }) {
  return (
    <div className="state state--error" role="alert">
      <span className="state__badge" aria-hidden="true">
        !
      </span>
      <h3 className="state__title">
        {initial ? 'The gallery couldn’t be loaded' : 'More photographs couldn’t be loaded'}
      </h3>
      <p className="state__text">
        {message || 'Something went wrong while contacting the photo service.'}
        {!initial && ' Everything you have already seen is still here.'}
      </p>
      <button type="button" className="btn btn--primary" onClick={onRetry}>
        <RotateCw size={16} aria-hidden="true" />
        Try again
      </button>
    </div>
  );
}
