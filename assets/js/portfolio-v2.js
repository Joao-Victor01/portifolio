(() => {
  const header = document.querySelector('[data-header]');
  const toggle = document.querySelector('.toggle');
  const links = document.querySelector('.links');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const updateHeader = () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 20);
  };
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      toggle.classList.toggle('open', !open);
      links.classList.toggle('open', !open);
      document.body.classList.toggle('menu-open', !open);
    });

    links.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.classList.remove('open');
      links.classList.remove('open');
      document.body.classList.remove('menu-open');
    }));
  }

  document.querySelectorAll('[data-year]').forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

  const filterButtons = [...document.querySelectorAll('.filter[data-filter]')];
  const projectCards = [...document.querySelectorAll('.project[data-category]')];

  const applyProjectFilter = (filter) => {
    filterButtons.forEach((button) => {
      const active = button.dataset.filter === filter;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });

    projectCards.forEach((card) => {
      const categories = (card.dataset.category || '')
        .trim()
        .split(/\s+/)
        .filter(Boolean);
      const visible = filter === 'all' || categories.includes(filter);
      card.hidden = !visible;
      card.classList.toggle('hidden', !visible);
    });
  };

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      applyProjectFilter(button.dataset.filter || 'all');
    });
  });
  applyProjectFilter('all');

  const reveals = document.querySelectorAll('[data-reveal]');
  if (reduced || !('IntersectionObserver' in window)) {
    reveals.forEach((element) => element.classList.add('visible'));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach((element) => observer.observe(element));
  }

  if (links) {
    const sections = [...document.querySelectorAll('main section[id]')];
    const navigationLinks = [...links.querySelectorAll('a[href^="#"]')];
    const updateActiveLink = () => {
      let id = '';
      sections.forEach((section) => {
        if (window.scrollY >= section.offsetTop - 180) id = section.id;
      });
      navigationLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    };
    updateActiveLink();
    window.addEventListener('scroll', updateActiveLink, { passive: true });
  }
})();
