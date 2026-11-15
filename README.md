# PIXORA — Premium Photo Gallery

> *Every frame tells a story.*

PIXORA is a one-column photography feed built with **React + Vite**. It streams real photographs from the
[Lorem Picsum](https://picsum.photos) API, loads more pages automatically as you scroll (IntersectionObserver),
and gives every photograph its own like counter.

It started as a React photo-gallery assignment and covers every required item, plus extras: an editorial
design, a light/dark theme, a full-screen lightbox, skeleton loading, error recovery and keyboard accessibility.

---

## Features

### Assignment requirements
| Requirement | Implementation |
| --- | --- |
| Fetch page 1 on load | `useInfinitePhotos` requests `https://picsum.photos/v2/list?page=1` on mount (exactly once, even under React StrictMode) |
| Fetch further pages on scroll | An `IntersectionObserver` watches a sentinel below the feed and requests `?page=2`, `?page=3`, … |
| `download_url` as the image source | Every `<img src>` is the API's `download_url` |
| `author` shown | Each card is labelled *Photographed by {author}* |
| Append, never replace | New pages are concatenated onto the existing list; duplicate ids are ignored |
| Stop on an empty array | An empty page sets the feed to `done`, the observer is removed and no more requests are made |
| Loading / network / HTTP errors | Skeletons + loader while fetching; network failures, non-2xx responses and malformed JSON all show an error panel with **Try again** |
| One-column layout | A centred single-column feed at every screen size |
| Thumbs-up + counter per photo | Font Awesome `faThumbsUp` with a count that starts at `0` |
| +1 on every click, independent counters | Likes are stored per photo id (`{ [id]: count }`), separate from the photo list, so loading more pages never resets them |

### Infinite-scroll safeguards
- **No duplicate requests:** a ref-based in-flight lock allows only one request at a time.
- **Correct page counter:** the page number only advances after a successful response, so a failed page is retried, never skipped.
- **No race conditions:** the observer exists only while the feed is idle. It disconnects as it fires and is recreated after each page, so if the sentinel is still visible the next page loads automatically.
- **Cleanup:** observers and event listeners are disconnected on unmount or when their dependencies change.
- **No auto-retry loops:** after an error, loading pauses until the user presses **Try again**.

### Enhancements
- Editorial hero with a scroll-to-gallery button
- Live counter showing how many photographs and pages are loaded
- Full-screen **lightbox**: previous/next, ← → keys, Esc, swipe on touch, focus trap, scroll lock, liking from inside the lightbox, a link to the original, and it loads more pages as you near the end
- **Discover** in the navigation opens a random loaded photograph
- **Light/dark theme** that follows the system setting, is saved in `localStorage`, and is applied before first paint (no flash)
- Responsive navigation with a compact menu on mobile
- Hover effects (slight zoom, overlay, stronger metadata) and a like "pop" plus a floating +1
- Skeleton placeholders, and image frames sized to each photo's aspect ratio so nothing shifts as images load
- Lazy-loaded images with responsive `srcSet`
- End-of-collection message with a decorative separator, plus an empty state
- Floating and footer **back-to-top** buttons
- Info dialog listing keyboard shortcuts
- Error boundary around the gallery
- `prefers-reduced-motion` support, a skip link, visible focus styles, ARIA labels and touch targets of at least 44px

---

## Tech stack

- **React 18** (function components and hooks: `useState`, `useEffect`, `useRef`, `useCallback`, `memo`)
- **Vite 5** (`@vitejs/plugin-react`)
- JavaScript (ES2020+), HTML5, CSS3 (custom properties, no CSS framework)
- **Fetch API** and **IntersectionObserver API**
- **Font Awesome** (`@fortawesome/react-fontawesome`, solid and regular icon sets) for the thumbs-up
- **Lucide React** for the other interface icons
- Google Fonts: *Playfair Display* (headings) and *Inter* (body)

No backend, database, state library or paid API.

---

## Getting started

Requirements: **Node.js 18+** and npm.

```bash
git clone <your-repo-url> pixora
cd pixora
npm install
```

| Command | Description |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Start the dev server at http://localhost:5173 |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Serve the production build at http://localhost:4173 |

---

## API

```
GET https://picsum.photos/v2/list?page={n}
```

Each page returns up to 30 objects:

```json
{
  "id": "0",
  "author": "Alejandro Escamilla",
  "width": 5000,
  "height": 3333,
  "url": "https://unsplash.com/...",
  "download_url": "https://picsum.photos/id/0/5000/3333"
}
```

- All network code lives in `src/services/photoApi.js`. It validates the response, turns failures into a typed `PhotoApiError`, and normalises each photo.
- `width` and `height` set each frame's aspect ratio, so images are never distorted or cropped.
- **Image weight:** `download_url` points to the full-resolution original (often 5000px or more). It is always the `<img src>`, but the `<img>` also gets a `srcSet` of resized variants of the **same URL** (`/id/{id}/{w}/{h}`), so the browser can download a size that fits the screen. The lightbox uses a 1920px variant and links to the original.
- At the time of writing the API returns data up to page 34; page 35 is the first empty page, which ends the feed.

---

## Project structure

```
pixora/
├── index.html                 # fonts, meta tags, theme applied before first paint
├── public/favicon.svg
├── src/
│   ├── main.jsx               # entry point (StrictMode)
│   ├── App.jsx                # composition, like state, lightbox and dialog state
│   ├── components/
│   │   ├── Navbar.jsx         # sticky nav, theme toggle, info, mobile menu
│   │   ├── Hero.jsx
│   │   ├── Gallery.jsx        # feed, sentinel and IntersectionObserver
│   │   ├── PhotoCard.jsx      # memoised card: image, author, id, like button
│   │   ├── LikeButton.jsx     # Font Awesome thumbs-up, +1 per click
│   │   ├── ImageLightbox.jsx
│   │   ├── SkeletonLoader.jsx
│   │   ├── LoadingIndicator.jsx
│   │   ├── ErrorState.jsx     # error panel with retry
│   │   ├── EmptyState.jsx     # empty collection / end of collection
│   │   ├── About.jsx
│   │   ├── InfoDialog.jsx
│   │   ├── BackToTop.jsx
│   │   ├── ErrorBoundary.jsx
│   │   ├── Logo.jsx
│   │   └── Footer.jsx
│   ├── hooks/
│   │   ├── useInfinitePhotos.js   # pagination state machine
│   │   ├── useModal.js            # Esc, focus trap, scroll lock, focus restore
│   │   └── useTheme.js
│   ├── services/
│   │   └── photoApi.js            # Lorem Picsum client
│   ├── utils/scroll.js            # scrolling that respects reduced motion
│   └── styles/
│       ├── global.css             # design tokens (light and dark), base styles, shared UI
│       ├── navbar.css  hero.css  gallery.css  photoCard.css
│       ├── lightbox.css           # lightbox and info dialog
│       └── footer.css
├── vite.config.js
└── package.json
```

---

## How to verify (for reviewers)

1. `npm run dev`, then open the app. DevTools → Network → filter `v2/list` shows exactly one request for `page=1`.
2. Scroll down. `page=2`, `page=3`, … are requested one at a time as you reach the bottom, and the counter in the gallery header goes up by 30 each time.
3. Click a 👍 several times. That photo's count goes up by 1 per click and the others stay unchanged. Scroll on to load more pages; the counts stay the same.
4. Set DevTools to **Offline** and scroll to the bottom. The error panel appears and nothing retries on its own. Go back online and press **Try again**; the same page loads.
5. Keep scrolling, or in DevTools block or mock the URL to return `[]`. *"You've reached the end of the collection."* appears and no further requests are made.
6. Click a photo to open the lightbox. Use ← / → and Esc. Also try the theme toggle, **Discover**, and the ⓘ dialog.

---

## Screenshots

_Screenshots to add before submission: save them as `docs/screenshots/light.png`, `dark.png` and `mobile.png`, then embed them here:_

```md
![Light theme](docs/screenshots/light.png)
![Dark theme](docs/screenshots/dark.png)
![Mobile](docs/screenshots/mobile.png)
```

---

## Repository

- GitHub: `https://github.com/<your-username>/pixora` *(update after publishing)*
- License: MIT for the code. Photographs belong to their credited authors and are served by Lorem Picsum.
