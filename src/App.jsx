import { useCallback, useRef, useState } from 'react';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import Gallery from './components/Gallery.jsx';
import About from './components/About.jsx';
import Footer from './components/Footer.jsx';
import ImageLightbox from './components/ImageLightbox.jsx';
import InfoDialog from './components/InfoDialog.jsx';
import BackToTop from './components/BackToTop.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import { useInfinitePhotos } from './hooks/useInfinitePhotos.js';
import { useTheme } from './hooks/useTheme.js';
import { scrollToId } from './utils/scroll.js';

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const { photos, status, error, hasMore, pagesLoaded, loadMore, retry } = useInfinitePhotos();

  // Likes are keyed by photo id and kept apart from the photo list, so
  // appending new pages never resets or shifts any existing counter.
  const [likes, setLikes] = useState({});
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [infoOpen, setInfoOpen] = useState(false);

  const handleLike = useCallback((id) => {
    setLikes((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  }, []);

  // A ref keeps `openPhoto` referentially stable while pages are appended,
  // so memoised PhotoCards don't all re-render on every new page.
  const photosRef = useRef(photos);
  photosRef.current = photos;

  const openPhoto = useCallback((id) => {
    const index = photosRef.current.findIndex((photo) => photo.id === id);
    if (index !== -1) setLightboxIndex(index);
  }, []);

  const discoverRandom = useCallback(() => {
    if (photos.length === 0) {
      scrollToId('gallery');
      return;
    }
    setLightboxIndex(Math.floor(Math.random() * photos.length));
  }, [photos.length]);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const closeInfo = useCallback(() => setInfoOpen(false), []);
  const openInfo = useCallback(() => setInfoOpen(true), []);

  return (
    <>
      <a className="skip-link" href="#gallery">
        Skip to gallery
      </a>
      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
        onDiscover={discoverRandom}
        onOpenInfo={openInfo}
        canDiscover={photos.length > 0}
      />
      <main id="main">
        <Hero />
        <ErrorBoundary>
          <Gallery
            photos={photos}
            status={status}
            error={error}
            hasMore={hasMore}
            pagesLoaded={pagesLoaded}
            likes={likes}
            onLike={handleLike}
            onOpen={openPhoto}
            onLoadMore={loadMore}
            onRetry={retry}
          />
        </ErrorBoundary>
        <About />
      </main>
      <Footer />
      <BackToTop />

      {lightboxIndex !== null && photos[lightboxIndex] && (
        <ImageLightbox
          photos={photos}
          index={lightboxIndex}
          likes={likes}
          hasMore={hasMore}
          onLike={handleLike}
          onNavigate={setLightboxIndex}
          onClose={closeLightbox}
          onNearEnd={loadMore}
        />
      )}
      {infoOpen && <InfoDialog onClose={closeInfo} />}
    </>
  );
}
