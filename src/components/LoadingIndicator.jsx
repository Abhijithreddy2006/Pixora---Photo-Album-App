export default function LoadingIndicator({ label = 'Loading…' }) {
  return (
    <div className="loading-indicator" role="status">
      <span className="loading-indicator__aperture" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
      <span className="loading-indicator__label">{label}</span>
    </div>
  );
}
