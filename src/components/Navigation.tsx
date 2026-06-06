import React, { useEffect, useState } from 'react';

const NAV_ITEMS = [
  { id: 'explorer', label: 'Street Reality Explorer' },
  { id: 'leaderboard', label: 'Leaderboard' },
  { id: 'gap-analysis', label: 'Gap Analysis' },
  { id: 'sri', label: 'Street Reality Index' },
  { id: 'analytics', label: 'Visual Analytics' },
  { id: 'methodology', label: 'Methodology' },
];

export const Navigation: React.FC = () => {
  const [activeId, setActiveId] = useState<string>('explorer');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-30% 0px -60% 0px' }
    );

    NAV_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <nav className="sticky top-0 z-40 bg-[rgba(15,22,36,0.85)] backdrop-blur-md border-b border-border py-0 px-6 overflow-x-auto">
      <ul className="flex m-0 p-0 list-none gap-8 min-w-max">
        {NAV_ITEMS.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={(e) => handleClick(e, item.id)}
              className={`block py-4 text-sm font-medium transition-colors border-b-2 ${
                activeId === item.id
                  ? 'text-text-primary border-accent-blue'
                  : 'text-text-secondary border-transparent hover:text-text-primary'
              }`}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};
