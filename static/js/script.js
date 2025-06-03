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
    onEnter: () => {
      // 1) Turn the hero title dark
      gsap.to('#hero-title', { color: '#333', duration: 0.2 });
      // 2) Turn the burger lines black
      gsap.to('.burger-line', { background: '#333', duration: 0.2 });
    },
    onLeaveBack: () => {
      // 1) Turn the hero title white
      gsap.to('#hero-title', { color: '#fff', duration: 0.2 });
      // 2) Turn the burger lines white
      gsap.to('.burger-line', { background: '#fff', duration: 0.2 });
    }
  });

  // ------------------------------------------------
  // 8) About Section Animation (title + paragraph)
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
      end:     '+=500',
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
    attr: { startOffset: '50%' },
    duration: 1,
    ease: 'none'
  }, 0);

  // Expandable SERVICES box
  document.querySelectorAll('.service-item').forEach(item => {
    item.addEventListener('click', (e) => {
      // Prevent toggle if clicking on interactive elements
      if (['AUDIO', 'VIDEO', 'IFRAME', 'A', 'BUTTON'].includes(e.target.tagName)) return;

      const details = item.querySelector('.service-details');
      const isExpanded = item.classList.contains('expanded');

      // Close other expanded items
      document.querySelectorAll('.service-item.expanded').forEach(openItem => {
        if (openItem !== item) {
          openItem.classList.remove('expanded');
          openItem.querySelector('.service-details').style.maxHeight = null;
        }
      });

      // Toggle current item
      if (isExpanded) {
        item.classList.remove('expanded');
        details.style.maxHeight = null;
      } else {
        item.classList.add('expanded');
        details.style.maxHeight = details.scrollHeight + "px";
      }
    });
  });


  function spawnFloatingNote() {
    const section = document.querySelector('.floating-notes');

    // Clone a random <div class="note"> polaroid template
    const templates = section.querySelectorAll('.note');
    const note = templates[Math.floor(Math.random() * templates.length)].cloneNode(true);

    // Random horizontal start (just off‐screen)
    const xStart = Math.random() * window.innerWidth;
    const yStart = window.innerHeight + 50;

    // Small drift left/right once floating
    const driftX = Math.random() * 100 - 50;

    // Random scale between 0.8 and 1.4
    const scale = 0.8 + Math.random() * 0.6;

    // Random tilt between -10° and +10°
    const rotate = Math.random() * 20 - 10;

    // Apply styles before inserting
    note.style.position = 'absolute';
    note.style.left = `${xStart}px`;
    note.style.top = `${yStart}px`;
    // Start rotated & scaled
    note.style.transform = `scale(${scale}) rotate(${rotate}deg)`;
    note.style.opacity = 0;
    note.style.display = 'block';  // show the clone

    section.appendChild(note);

    // Animate floating up, drifting, and fading in
    gsap.to(note, {
      y: -window.innerHeight - 100,
      x: `+=${driftX}`,
      opacity: 1,
      duration: 6 + Math.random() * 3,
      ease: 'sine.out',
      onComplete: () => note.remove()
    });
  }

  // Spawn one every 2 seconds (2000 ms)
  setInterval(spawnFloatingNote, 2000);



  const waveformBars = gsap.utils.toArray('#waveform-bars rect');
  let pulseTweens = [];

  const mic = document.getElementById('mic-hover-area'); // ✅ Define before use

  // Store original positions once
  const barData = waveformBars.map(bar => ({
    el: bar,
    originalHeight: parseFloat(bar.getAttribute('height')),
    originalY: parseFloat(bar.getAttribute('y'))
  }));

  function startWaveformPulse({ heightBoost = 15, yOffset = 10, speed = 0.6 }) {
    pulseTweens.forEach(t => t.kill());
    pulseTweens = [];

    barData.forEach(({ el, originalHeight, originalY }, i) => {
      gsap.set(el, {
        attr: {
          height: originalHeight,
          y: originalY
        }
      });

      const tween = gsap.to(el, {
        attr: {
          height: originalHeight + Math.random() * heightBoost,
          y: originalY - yOffset
        },
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        duration: speed + Math.random() * 0.4,
        delay: i * 0.1
      });

      pulseTweens.push(tween);
    });
  }

  // Start gentle pulse on scroll
  gsap.from('#waveform-bars', {
    opacity: 0,
    duration: 2.5,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '#services-svg',
      start: 'top 60%',
      once: true,
      onEnter: () => startWaveformPulse({})
    }
  });

  // Mic hover glow + waveform boost
  mic.addEventListener('mouseenter', () => {
    startWaveformPulse({
      heightBoost: 40,
      yOffset: 20,
      speed: 0.3
    });
    mic.classList.add('glow');
  });

  mic.addEventListener('mouseleave', () => {
    startWaveformPulse({});
    mic.classList.remove('glow');
  });

  // ------------------------------------------------
  // 10) Animate Headshot Frame + About Text on Scroll
  // ------------------------------------------------
  ScrollTrigger.create({
    trigger: "#about",
    start:   "top 75%",
    onEnter: () => {
      // Grab the actual DOM nodes here (instead of passing a selector string to gsap)
      const frameEl = document.querySelector(".about-image-frame");
      const textEl  = document.querySelector(".about-text");

      // Only animate if they exist
      if (frameEl) {
        gsap.to(frameEl, {
          opacity: 1,
          scale:   1,
          rotate:  0,
          duration: 0.8,
          ease:    "power3.out"
        });
      }

      if (textEl) {
        gsap.to(textEl, {
          opacity: 1,
          y:       0,
          duration: 0.8,
          ease:    "power3.out",
          delay:   0.2
        });
      }
    }
  });




}); // end DOMContentLoaded
