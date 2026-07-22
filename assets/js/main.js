(() => {
  const header = document.querySelector('[data-header]');
  const menu = document.querySelector('[data-menu]');
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const setHeaderState = () => {
    header?.classList.toggle('scrolled', window.scrollY > 24);
  };
  setHeaderState();
  window.addEventListener('scroll', setHeaderState, { passive: true });

  menuToggle?.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!open));
    menu?.classList.toggle('open', !open);
    document.body.classList.toggle('menu-open', !open);
  });

  menu?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuToggle?.setAttribute('aria-expanded', 'false');
      menu?.classList.remove('open');
      document.body.classList.remove('menu-open');
    });
  });

  document.querySelectorAll('[data-case-toggle]').forEach(toggle => {
    toggle.addEventListener('click', () => {
      const project = toggle.closest('[data-project]');
      const details = project?.querySelector('[data-case-details]');
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      details?.classList.toggle('open', !open);
      toggle.childNodes[0].nodeValue = open ? 'Ver detalhes ' : 'Ocultar detalhes ';
    });
  });

  const year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();

  const fallbackReveal = () => {
    document.querySelectorAll('[data-reveal]').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  };

  if (prefersReducedMotion) {
    document.documentElement.classList.add('reduced-motion');
    fallbackReveal();
    return;
  }

  window.addEventListener('load', () => {
    if (!window.gsap || !window.ScrollTrigger) {
      fallbackReveal();
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    gsap.to('[data-reveal]', {
      opacity: 1,
      y: 0,
      duration: .85,
      ease: 'power3.out',
      stagger: .08,
      scrollTrigger: {
        trigger: '.hero',
        start: 'top 70%'
      }
    });

    document.querySelectorAll('section:not(.hero) [data-reveal]').forEach(element => {
      gsap.fromTo(element,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: .85,
          ease: 'power3.out',
          scrollTrigger: { trigger: element, start: 'top 88%', once: true }
        }
      );
    });

    gsap.to('.visual-card-main', {
      y: -24,
      rotate: -1,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }
    });

    gsap.to('.note-one', {
      y: 45,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.2 }
    });

    gsap.to('.note-two', {
      y: -35,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.2 }
    });

    document.querySelectorAll('.project-visual').forEach(visual => {
      gsap.fromTo(visual, { scale: .96 }, {
        scale: 1,
        ease: 'none',
        scrollTrigger: { trigger: visual, start: 'top 90%', end: 'center 55%', scrub: .8 }
      });
    });
  });
})();
