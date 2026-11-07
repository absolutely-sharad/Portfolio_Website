import { useState, useEffect } from 'react';

export interface SectionRoute {
  id: string;
  label: string;
  shortLabel?: string;
  order: string;
}

export const NAV_SECTIONS: SectionRoute[] = [
  { id: 'about', label: 'About', shortLabel: 'ABOUT', order: '01' },
  { id: 'experience', label: 'Experience', shortLabel: 'EXPERIENCE', order: '02' },
  { id: 'projects', label: 'Projects', shortLabel: 'PROJECTS', order: '03' },
  { id: 'skills', label: 'Skills', shortLabel: 'SKILLS', order: '04' },
  { id: 'achievements', label: 'Achievements', shortLabel: 'AWARDS', order: '05' },
  { id: 'technews', label: 'Radar', shortLabel: 'TECH RADAR', order: '06' },
  { id: 'contact', label: 'Contact', shortLabel: 'CONTACT', order: '07' },
];

export function useScrollSpy(disabled: boolean = false): {
  activeId: string;
  activeSection: SectionRoute | null;
  scrollToSection: (id: string) => void;
} {
  const [activeId, setActiveId] = useState<string>('hero');

  useEffect(() => {
    if (disabled) return;

    const sectionElements = [
      { id: 'hero' },
      ...NAV_SECTIONS,
    ];

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      // Find the first intersecting entry with significant visibility
      const intersecting = entries.filter((e) => e.isIntersecting);
      if (intersecting.length > 0) {
        // Sort by how close the top is to the top of viewport
        intersecting.sort((a, b) => {
          return Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top);
        });
        setActiveId(intersecting[0].target.id);
      }
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: '-15% 0px -65% 0px',
      threshold: [0, 0.2, 0.5],
    });

    sectionElements.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    // Fallback scroll listener for smooth continuous tracking
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY < 200) {
        setActiveId('hero');
        return;
      }

      const offset = 260;
      for (let i = NAV_SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(NAV_SECTIONS[i].id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= offset) {
            setActiveId(NAV_SECTIONS[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [disabled]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const activeSection = NAV_SECTIONS.find((s) => s.id === activeId) || null;

  return { activeId, activeSection, scrollToSection };
}
