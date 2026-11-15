import { useEffect, useState } from 'react';
import { Info, Menu, Moon, Sun, X } from 'lucide-react';
import Logo from './Logo.jsx';
import { scrollToId, scrollToTop } from '../utils/scroll.js';
import '../styles/navbar.css';

export default function Navbar({ theme, onToggleTheme, onDiscover, onOpenInfo, canDiscover }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth > 760) setMenuOpen(false);
    };
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [menuOpen]);

  const go = (action) => (event) => {
    event.preventDefault();
    setMenuOpen(false);
    action();
  };

  const links = [
    { label: 'Explore', href: '#gallery', action: () => scrollToId('gallery') },
    {
      label: 'Discover',
      href: '#gallery',
      action: onDiscover,
      title: canDiscover ? 'Open a random photograph' : 'Photographs are still loading',
    },
    { label: 'About', href: '#about', action: () => scrollToId('about') },
  ];

  const isDark = theme === 'dark';

  return (
    <header className={`navbar${scrolled ? ' navbar--scrolled' : ''}${menuOpen ? ' navbar--open' : ''}`}>
      <div className="navbar__inner">
        <a href="#top" className="navbar__brand" onClick={go(scrollToTop)} aria-label="PIXORA home">
          <Logo />
        </a>

        <nav className="navbar__nav" aria-label="Primary">
          <ul>
            {links.map((link) => (
              <li key={link.label}>
                <a href={link.href} onClick={go(link.action)} title={link.title}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="navbar__actions">
          <button
            type="button"
            className="icon-btn"
            onClick={onToggleTheme}
            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            title={isDark ? 'Light theme' : 'Dark theme'}
          >
            {isDark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
          </button>
          <button
            type="button"
            className="icon-btn"
            onClick={onOpenInfo}
            aria-label="About this gallery and keyboard shortcuts"
            title="Information"
          >
            <Info size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="icon-btn navbar__menu-btn"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </div>

      <nav id="mobile-menu" className="navbar__mobile" aria-label="Mobile" hidden={!menuOpen}>
        <ul>
          {links.map((link) => (
            <li key={link.label}>
              <a href={link.href} onClick={go(link.action)}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
