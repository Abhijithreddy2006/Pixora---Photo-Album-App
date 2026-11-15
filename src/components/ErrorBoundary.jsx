import { Component } from 'react';

/** Catches unexpected render errors so one broken component can't blank the whole page. */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('PIXORA render error:', error, info?.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="gallery" id="gallery">
          <div className="state state--error" role="alert">
            <h3 className="state__title">Something went wrong while displaying the gallery.</h3>
            <p className="state__text">Reloading the page usually fixes this.</p>
            <button type="button" className="btn btn--primary" onClick={() => window.location.reload()}>
              Reload page
            </button>
          </div>
        </section>
      );
    }
    return this.props.children;
  }
}
