/**
 * Lorem Picsum API service.
 *
 * All network access lives here so that components and hooks never deal with
 * URLs, HTTP status codes or response validation directly.
 *
 *   https://picsum.photos/v2/list?page=1
 *   https://picsum.photos/v2/list?page=2
 *   ...
 */

export const API_BASE_URL = 'https://picsum.photos/v2/list';

export class PhotoApiError extends Error {
  constructor(message, { status = null, cause } = {}) {
    super(message, cause ? { cause } : undefined);
    this.name = 'PhotoApiError';
    this.status = status;
  }
}

/** Build the list URL for a given page, exactly as documented by the assignment. */
export function buildPageUrl(page) {
  return `${API_BASE_URL}?page=${page}`;
}

function isValidPhoto(item) {
  return (
    item != null &&
    item.id != null &&
    typeof item.download_url === 'string' &&
    item.download_url.length > 0
  );
}

function normalizePhoto(item) {
  const width = Number(item.width) || 3;
  const height = Number(item.height) || 2;
  return {
    id: String(item.id),
    author: typeof item.author === 'string' && item.author.trim() ? item.author.trim() : 'Unknown photographer',
    width,
    height,
    downloadUrl: item.download_url,
    sourceUrl: typeof item.url === 'string' ? item.url : null,
  };
}

/**
 * Fetch one page of photos.
 * Resolves with an array (possibly empty, which signals the end of the collection).
 * Rejects with a PhotoApiError for network failures, non-2xx responses or malformed payloads.
 */
export async function fetchPhotos(page, { signal } = {}) {
  let response;
  try {
    response = await fetch(buildPageUrl(page), { signal, headers: { Accept: 'application/json' } });
  } catch (error) {
    if (error?.name === 'AbortError') throw error;
    throw new PhotoApiError('We couldn’t reach the photo service. Please check your connection.', { cause: error });
  }

  if (!response.ok) {
    throw new PhotoApiError(`The photo service responded with an error (HTTP ${response.status}).`, {
      status: response.status,
    });
  }

  let data;
  try {
    data = await response.json();
  } catch (error) {
    throw new PhotoApiError('The photo service returned an unreadable response.', { cause: error });
  }

  if (!Array.isArray(data)) {
    throw new PhotoApiError('The photo service returned an unexpected response format.');
  }

  return data.filter(isValidPhoto).map(normalizePhoto);
}

/**
 * Picsum `download_url`s look like https://picsum.photos/id/{id}/{width}/{height}
 * and point at the full-resolution original (often 5000px+). For responsive
 * `srcSet` candidates we derive a resized variant of the *same* URL; when the
 * URL does not match that pattern we fall back to the untouched download_url.
 */
const SIZE_SUFFIX = /\/\d+\/\d+\/?$/;

export function getSizedUrl(photo, targetWidth) {
  if (!SIZE_SUFFIX.test(photo.downloadUrl) || targetWidth >= photo.width) return photo.downloadUrl;
  const targetHeight = Math.round((targetWidth * photo.height) / photo.width);
  return photo.downloadUrl.replace(SIZE_SUFFIX, `/${targetWidth}/${targetHeight}`);
}

const SRCSET_WIDTHS = [480, 800, 1200, 1600, 2000];

export function buildSrcSet(photo) {
  const seen = new Set();
  return SRCSET_WIDTHS.map((w) => Math.min(w, photo.width))
    .filter((w) => (seen.has(w) ? false : seen.add(w)))
    .map((w) => `${getSizedUrl(photo, w)} ${w}w`)
    .join(', ');
}
