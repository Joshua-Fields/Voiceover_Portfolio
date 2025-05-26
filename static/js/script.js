// script.js

// --------------------------------------------------
// Register GSAP Plugins
// --------------------------------------------------
gsap.registerPlugin(
  ScrollTrigger,
  ScrollSmoother,
  ScrollToPlugin
);

// --------------------------------------------------
// Wait for DOM Content to Load
// --------------------------------------------------
window.addEventListener('DOMContentLoaded', () => {
  console.log("script.js loaded and running");

  // ------------------------------------------------
  // 1) Smooth-Scroll Setup (ScrollSmoother)
  // ------------------------------------------------
  const smoother = ScrollSmoother.create({
    wrapper: '.smooth-wrapper',
    content:  '.smooth-content',
    smooth:   1.2,
    effects:  true
  });

  // ------------------------------------------------
  // 2) Hero Title Split + Entrance
  // ------------------------------------------------
  const heroEl = document.getElementById('hero-title');
  heroEl.innerHTML = heroEl.textContent
    .split('')
    .map(c => `<span class="char">${c}</span>`)
    .join('');
  gsap.fromTo('#hero-title .char', {
    opacity: 0,
    x: () => gsap.utils.random(-200, 200),
    y: () => gsap.utils.random(-200, 200),
    rotation: () => gsap.utils.random(-180, 180),
    scale: 0
  }, {
    opacity: 1,
    x: 0, y: 0, rotation: 0, scale: 1,
    duration: 1.2,
    ease: 'elastic.out(1, 0.5)',
    stagger: { each: 0.05, from: 'center' },
    delay: 0.5
  });

  // ------------------------------------------------
  // 3) Burger Toggle + Anchor Handling
  // ------------------------------------------------
  const burger     = document.querySelector('.burger');
  const mobileMenu = document.querySelector('.mobile-menu');
  burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
  });
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = link.getAttribute('href');
      smoother.scrollTo(target, {
        offsetY: document.querySelector('#top-nav-wrapper').offsetHeight,
        ease:    'power2.inOut',
        onComplete: () => ScrollTrigger.refresh()
      });
      burger.classList.remove('active');
      mobileMenu.classList.remove('open');
      history.pushState(null, '', target);
    });
  });

  // ------------------------------------------------
  // 4) Pin the Top-Nav Wrapper
  // ------------------------------------------------
  ScrollTrigger.create({
    trigger:      '#top-nav-wrapper',
    start:        'top top',
    endTrigger:   'footer',
    end:          'bottom top',
    pin:          '#top-nav-wrapper',
    pinSpacing:   false,
    anticipatePin: 1
  });

  // ------------------------------------------------
  // 5) Shrink Hero Title on Scroll
  // ------------------------------------------------
  gsap.timeline({
    scrollTrigger: {
      trigger: '.hero',
      start:   'top top',
      end:     '+=500',
      scrub:   0.8
    }
  }).to('#hero-title', {
    scale: () => {
      const navH  = document.querySelector('#top-nav-wrapper').offsetHeight;
      const heroH = heroEl.getBoundingClientRect().height;
      return navH / heroH;
    },
    x: 0,
    y: 0,
    transformOrigin: 'center center',
    ease: 'power3.out'
  });

  // ------------------------------------------------
  // 6) Section Reveal Animations
  // ------------------------------------------------
  document.querySelectorAll('.section:not(#about)').forEach(sec => {
    gsap.from(sec, {
      scrollTrigger: {
        trigger:       sec,
        start:         'top 80%',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      y: 50,
      duration: 1,
      ease: 'power2.out'
    });
  });

  // ------------------------------------------------
  // 7) Swap Hero Title Color
  // ------------------------------------------------
  ScrollTrigger.create({
    trigger: '.hero',
    start:   'bottom top',
    end:     'bottom top+=1',
    onEnter:    () => gsap.to('#hero-title', { color: '#333', duration: 0.2 }),
    onLeaveBack:() => gsap.to('#hero-title', { color: '#fff', duration: 0.2 })
  });

  // ------------------------------------------------
  // 8) About Section Animation
  // ------------------------------------------------
  const aboutSection = document.querySelector('#about');
  const aboutTitle   = aboutSection.querySelector('.about-title');
  const aboutPara    = aboutSection.querySelector('p');

  // Split heading into chars
  aboutTitle.innerHTML = aboutTitle.textContent
    .split('')
    .map(c => `<span class="char">${c}</span>`)
    .join('');
  const aboutChars = aboutTitle.querySelectorAll('.char');

  // Jello-drop title chars
  gsap.fromTo(aboutChars, {
    y: -200, scaleY: 3, scaleX: 0.3, opacity: 0
  }, {
    y: 0, scaleY: 1, scaleX: 1, opacity: 1,
    ease: 'elastic.out(1, 0.4)',
    duration: 1.5,
    stagger: { each: 0.04, from: 'center' },
    scrollTrigger: {
      trigger: aboutSection,
      start:   'top 80%',
      end:     'top 60%',
      scrub:   false
    }
  });

  // Stagger in paragraph words
  const words = aboutPara.textContent.split(' ')
    .map(w => `<span class="word">${w} </span>`).join('');
  aboutPara.innerHTML = words;
  gsap.from(aboutPara.querySelectorAll('.word'), {
    opacity: 0, y: 20, ease: 'power2.out', stagger: 0.05,
    scrollTrigger: {
      trigger: aboutSection,
      start:   'top 70%',
      end:     'top 40%',
      scrub:   false
    }
  });

  // Pin & wipe bar
  const wipe = document.createElement('div');
  wipe.style.cssText = `
    position:absolute;top:0;left:0;
    width:0%;height:4px;
    background:#FFA726;
  `;
  aboutSection.style.position = 'relative';
  aboutSection.appendChild(wipe);
  gsap.to(wipe, {
    width: '100%', ease: 'none',
    scrollTrigger: {
      trigger: aboutSection,
      start:   'top 90%',
      end:     'top 50%',
      scrub:   true
    }
  });

  // Un-blur about background
  gsap.to('#about', {
    '--bg-blur': '0px',
    ease: 'none',
    scrollTrigger: {
      trigger: '#about',
      start:   'top 90%',
      end:     'top 50%',
      scrub:   true
    }
  });

  // ------------------------------------------------
  // 9) Services SVG Animation
  // ------------------------------------------------
  const servicesTL = gsap.timeline({
    scrollTrigger: {
      trigger: '#services-svg',
      start:   'top 80%',
      end:     'top 50%',
      scrub:   true
    }
  });

  // Prep only path & line for getTotalLength()
  const micStrokes = document.querySelectorAll('#mic-icon path, #mic-icon line');
  console.log("Found mic strokes:", micStrokes.length);
  micStrokes.forEach(el => {
    const length = el.getTotalLength();
    el.style.strokeDasharray  = length;
    el.style.strokeDashoffset = length;
  });

  // Make mic visible
  gsap.set('#mic-icon', { opacity: 1 });

  // Draw mic outline
  servicesTL.to(micStrokes, {
    strokeDashoffset: 0,
    duration: 1,
    ease: 'power1.inOut'
  }, 0);

  // Animate single “SERVICES” once around, stopping at top-center
  servicesTL.to('#services-svg textPath', {
    attr: { startOffset: '100%' },
    duration: 1,
    ease: 'none'
  }, 0);


}); // end DOMContentLoaded
