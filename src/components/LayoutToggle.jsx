import { LayoutGrid, Rows3 } from 'lucide-react';

const OPTIONS = [
  { value: 'grid', label: 'Grid', Icon: LayoutGrid },
  { value: 'feed', label: 'Feed', Icon: Rows3 },
];

export default function LayoutToggle({ layout, onChange }) {
  return (
    <div className="layout-toggle" role="group" aria-label="Gallery layout">
      {OPTIONS.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          className={`layout-toggle__btn${layout === value ? ' is-active' : ''}`}
          aria-pressed={layout === value}
          onClick={() => onChange(value)}
          title={value === 'grid' ? 'Masonry grid' : 'Single-column feed'}
        >
          <Icon size={15} aria-hidden="true" />
          {label}
        </button>
      ))}
    </div>
  );
}
