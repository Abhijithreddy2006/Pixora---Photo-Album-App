import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchPhotos } from '../services/photoApi.js';

/**
 * Paginated, append-only photo loader.
 *
 * Guarantees:
 *  - Page 1 is requested once on mount (also under React StrictMode).
 *  - Only one request is ever in flight (`inFlightRef`), so the same page is
 *    never fetched twice concurrently.
 *  - The page counter only advances after a page has been received
 *    successfully, so a failed page is retried rather than skipped.
 *  - New photos are appended; ids already in the feed are ignored.
 *  - An empty array from the API marks the collection as finished and no
 *    further requests are made.
 *
 * status: 'loading' | 'idle' | 'error' | 'done'
 */
export function useInfinitePhotos() {
  const [photos, setPhotos] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);
  const [pagesLoaded, setPagesLoaded] = useState(0);

  const nextPageRef = useRef(1);
  const inFlightRef = useRef(false);
  const hasMoreRef = useRef(true);
  const seenIdsRef = useRef(new Set());
  const mountedRef = useRef(false);

  const loadMore = useCallback(async () => {
    if (inFlightRef.current || !hasMoreRef.current) return;

    inFlightRef.current = true;
    const page = nextPageRef.current;
    setStatus('loading');
    setError(null);

    try {
      const batch = await fetchPhotos(page);
      if (!mountedRef.current) return;

      if (batch.length === 0) {
        hasMoreRef.current = false;
        setStatus('done');
        return;
      }

      const fresh = batch.filter((photo) => !seenIdsRef.current.has(photo.id));
      fresh.forEach((photo) => seenIdsRef.current.add(photo.id));

      nextPageRef.current = page + 1;
      if (fresh.length > 0) setPhotos((prev) => prev.concat(fresh));
      setPagesLoaded(page);
      setStatus('idle');
    } catch (err) {
      if (!mountedRef.current) return;
      setError(err instanceof Error ? err : new Error(String(err)));
      setStatus('error');
    } finally {
      inFlightRef.current = false;
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    // Guarded by inFlightRef: StrictMode's double-invoked effect does not
    // create a second request for page 1.
    loadMore();
    return () => {
      mountedRef.current = false;
    };
  }, [loadMore]);

  return {
    photos,
    status,
    error,
    pagesLoaded,
    hasMore: status !== 'done',
    loadMore,
    retry: loadMore,
  };
}
