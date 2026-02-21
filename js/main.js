/* ================================================================
   FISAYO BALOGUN — PORTFOLIO JAVASCRIPT
   File: js/main.js

   TABLE OF CONTENTS
   -----------------
   1.  Scroll to top on load
   2.  Custom cursor
   3.  Nav scroll behaviour
   4.  Hamburger menu (mobile)
   5.  Typewriter effect
   6.  Scroll reveal

   NOTE: This script is at the END of <body> in index.html.
   All HTML elements exist before this code runs, so
   document.getElementById() always finds what it's looking for.
================================================================ */


/* ================================================================
   1. SCROLL TO TOP ON LOAD
   Forces the page to start at the top on every load/refresh.
   Browsers sometimes remember scroll position — this overrides that.
================================================================ */
window.scrollTo(0, 0);


/* ================================================================
   2. CUSTOM CURSOR
   Replaces the browser cursor with two layered circles.

   mx / my  — actual mouse coordinates
   rx / ry  — ring's current position (slowly catches up via lerp)

   Lerp (linear interpolation): rx += (target - rx) * speed
   Lower speed value = more lag on the ring. 0.12 feels good.
================================================================ */
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursorRing');

let mx = 0, my = 0;
let rx = 0, ry = 0;

document.addEventListener('mousemove', (e) => {
  mx = e.clientX;
  my = e.clientY;
});

function animateCursor() {
  // Dot snaps directly to mouse
  cursor.style.transform = `translate(${mx - 5}px, ${my - 5}px)`;

  // Ring lerps toward mouse (0.12 = lag factor; lower = more lag)
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.transform = `translate(${rx - 16}px, ${ry - 16}px)`;

  requestAnimationFrame(animateCursor);
}

animateCursor();


/* ================================================================
   3. NAV SCROLL BEHAVIOUR
   Adds .scrolled to <nav> when user scrolls past 20px.
   CSS uses this class to show the frosted glass background.

   classList.toggle(class, condition):
   - adds class if condition is true
   - removes it if condition is false
================================================================ */
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
});


/* ================================================================
   4. HAMBURGER MENU (MOBILE)
   Toggles the mobile nav menu open/closed.

   hamburger button  → gets .open class (bars animate into X)
   mobileMenu panel  → gets .open class (slides down from top)

   Clicking a menu link also closes the menu so the page scrolls
   smoothly to the section without leaving the menu open.
================================================================ */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

// Toggle menu open/closed on hamburger click
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

// Close menu when any link inside it is clicked
mobileMenu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});


/* ================================================================
   5. TYPEWRITER EFFECT
   Types then deletes each phrase in the array, cycling forever.

   TO CHANGE PHRASES: edit the phrases array below.
   TO CHANGE SPEED:   edit typingSpeed / deleteSpeed / pauseAfterWord.

   phraseIndex — which phrase we're currently on (0 = first)
   charIndex   — how many characters are currently visible
   isDeleting  — true while erasing, false while typing
================================================================ */
const phrases = [
  'building data pipelines.',
  'upskilling.',
  'automating the boring stuff.',
  'creating databases.',
  'vibe-coding.',
];

const typingSpeed    = 65;   // ms per character typed
const deleteSpeed    = 35;   // ms per character deleted
const pauseAfterWord = 1800; // ms to pause when full phrase is shown

let phraseIndex = 0;
let charIndex   = 0;
let isDeleting  = false;

const typewriterEl = document.getElementById('typewriter');

function type() {
  const currentPhrase = phrases[phraseIndex];

  if (!isDeleting) {
    // Typing: reveal one more character
    charIndex++;
    typewriterEl.textContent = currentPhrase.slice(0, charIndex);

    if (charIndex === currentPhrase.length) {
      // Full phrase shown — pause then start deleting
      isDeleting = true;
      setTimeout(type, pauseAfterWord);
      return;
    }

  } else {
    // Deleting: remove one character
    charIndex--;
    typewriterEl.textContent = currentPhrase.slice(0, charIndex);

    if (charIndex === 0) {
      // All deleted — move to next phrase
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      setTimeout(type, 400);
      return;
    }
  }

  setTimeout(type, isDeleting ? deleteSpeed : typingSpeed);
}

// Initial delay lets hero animations finish first
setTimeout(type, 1400);


/* ================================================================
   6. SCROLL REVEAL
   Watches every .reveal element with IntersectionObserver.
   Adds .visible when the element enters the viewport.
   CSS transitions in styles.css do the actual animation.

   threshold: 0.1 — triggers when 10% of the element is visible.

   Staggered setTimeout(i * 80) creates a cascade when multiple
   elements enter the viewport at the same time.

   unobserve() stops watching after reveal — animates only once.
================================================================ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 80); // stagger each element by 80ms

      revealObserver.unobserve(entry.target); // reveal once only
    }
  });
}, {
  threshold: 0.1,
});

document.querySelectorAll('.reveal').forEach((el) => {
  revealObserver.observe(el);
});
