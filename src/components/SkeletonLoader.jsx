export default function SkeletonLoader({ count = 1 }) {
  return Array.from({ length: count }, (_, i) => (
    <div className="skeleton-card" key={i} aria-hidden="true">
      <div className="skeleton-card__image shimmer" />
      <div className="skeleton-card__meta">
        <div className="skeleton-card__lines">
          <span className="shimmer skeleton-line skeleton-line--sm" />
          <span className="shimmer skeleton-line skeleton-line--lg" />
        </div>
        <span className="shimmer skeleton-pill" />
      </div>
    </div>
  ));
}
