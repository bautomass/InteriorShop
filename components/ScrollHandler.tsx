'use client';

import { useEffect } from 'react';

export function ScrollHandler() {
  useEffect(() => {
    let lastScroll = 0;
    const header = document.querySelector('#navbar') as HTMLElement; // Adjust selector to match your header
    const sortSection = document.querySelector('#sticky-sort') as HTMLElement;
    
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const headerHeight = header?.offsetHeight || 0;
      
      // Determine if scrolling up or down
      if (currentScroll > lastScroll) {
        // Scrolling down - header disappears
        document.documentElement.style.setProperty('--header-offset', '0px');
      } else {
        // Scrolling up - header appears
        document.documentElement.style.setProperty('--header-offset', `${headerHeight}px`);
      }
      
      lastScroll = currentScroll;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Set initial header height
    const initialHeaderHeight = header?.offsetHeight || 0;
    document.documentElement.style.setProperty('--header-offset', `${initialHeaderHeight}px`);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return null;
}