import { useState, useEffect } from 'react';

/**
 * useScrollDirection (Phase M1)
 * Tracks window scroll direction for mobile smart sticky headers.
 * Returns true if scrolling up or at top of page, false if scrolling down.
 */
export function useScrollDirection(threshold = 50) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateScrollDirection = () => {
      const currentScrollY = window.scrollY;

      // Always show header at top of page
      if (currentScrollY <= threshold) {
        setIsVisible(true);
        ticking = false;
        return;
      }

      const diff = currentScrollY - lastScrollY;
      if (Math.abs(diff) > 8) {
        if (diff > 0) {
          // Scrolling down -> Hide header
          setIsVisible(false);
        } else {
          // Scrolling up -> Reveal header
          setIsVisible(true);
        }
        lastScrollY = currentScrollY;
      }

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDirection);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return isVisible;
}
