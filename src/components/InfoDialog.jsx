import { useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { API_BASE_URL } from '../services/photoApi.js';
import { useModal } from '../hooks/useModal.js';
import '../styles/lightbox.css';

const SHORTCUTS = [
  ['Tab', 'Move between photos, like buttons and controls'],
  ['Enter / Space', 'Open a photo or add a like'],
  ['← →', 'Previous / next photo in full-screen view'],
  ['Esc', 'Close full-screen view or this panel'],
];

export default function InfoDialog({ onClose }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  useModal(dialogRef, onClose, { initialFocusRef: closeRef });

  return createPortal(
    <div className="info-dialog" role="dialog" aria-modal="true" aria-labelledby="info-title" ref={dialogRef}>
      <div className="info-dialog__backdrop" onClick={onClose} aria-hidden="true" />
      <div className="info-dialog__panel">
        <button
          type="button"
          ref={closeRef}
          className="icon-btn info-dialog__close"
          onClick={onClose}
          aria-label="Close information panel"
        >
          <X size={18} aria-hidden="true" />
        </button>
        <p className="eyebrow">About PIXORA</p>
        <h2 id="info-title" className="info-dialog__title">
          A gallery that never stops developing.
        </h2>
        <p className="info-dialog__text">
          Photographs stream in from the free{' '}
          <a href="https://picsum.photos" target="_blank" rel="noopener noreferrer">
            Lorem Picsum
          </a>{' '}
          API (<code>{API_BASE_URL}?page=n</code>). New pages load automatically as you scroll, and every
          photograph keeps its own like counter.
        </p>
        <h3 className="info-dialog__subtitle">Keyboard shortcuts</h3>
        <dl className="info-dialog__shortcuts">
          {SHORTCUTS.map(([key, description]) => (
            <div key={key}>
              <dt>
                <kbd>{key}</kbd>
              </dt>
              <dd>{description}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>,
    document.body,
  );
}
