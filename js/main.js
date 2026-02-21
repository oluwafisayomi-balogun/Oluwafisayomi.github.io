/* ================================================================
   FISAYO BALOGUN — PORTFOLIO JAVASCRIPT
   File: js/main.js

   TABLE OF CONTENTS
   -----------------
   1.  Custom cursor
   2.  Nav scroll behaviour
   3.  Typewriter effect
   4.  Scroll reveal

   NOTE: This script tag is placed at the END of <body> in index.html.
   That means by the time this code runs, all HTML elements already
   exist in the page — so document.getElementById() always finds them.
   If you move the <script> tag to the <head>, things will break.
================================================================ */


/* ================================================================
   1. CUSTOM CURSOR
   Replaces the default browser cursor with two layered circles.

   How it works:
   - We track the real mouse position in mx/my on every mousemove
   - The small dot (.cursor) jumps instantly to mx/my each frame
   - The ring (.cursor-ring) uses lerp (linear interpolation) to
     slowly catch up — this creates the satisfying "lag" effect
   - requestAnimationFrame runs this in a loop (~60fps)

   To adjust lag: change the 0.12 value. Lower = more lag, slower.
   ================================================================ */
window.scrollTo(0, 0); // Force scroll to top on every page load
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursorRing');

let mx = 0, my = 0; // Actual mouse position
let rx = 0, ry = 0; // Ring's current position (lags behind)

// Update mouse position on every move
document.addEventListener('mousemove', (e) => {
  mx = e.clientX;
  my = e.clientY;
});

function animateCursor() {
  // Small dot: snap directly to mouse (offset by half its width/height to centre it)
  cursor.style.transform = `translate(${mx - 5}px, ${my - 5}px)`;

  // Ring: lerp toward mouse position (0.12 = speed factor)
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.transform = `translate(${rx - 16}px, ${ry - 16}px)`;

  requestAnimationFrame(animateCursor); // Keep looping every frame
}

animateCursor(); // Kick off the loop


/* ================================================================
   2. NAV SCROLL BEHAVIOUR
   Watches the scroll position. When user scrolls past 20px,
   the .scrolled class is added to <nav>.
   CSS then switches on the frosted glass background.

   classList.toggle(class, condition) adds the class if condition
   is true, removes it if false — no if/else needed.
   ================================================================ */

const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
});


/* ================================================================
   3. TYPEWRITER EFFECT
   Cycles through an array of phrases, typing then deleting each one.

   To change the phrases: edit the 'phrases' array below.
   To change speed: edit typingSpeed, deleteSpeed, pauseAfterWord.

   State variables:
   - phraseIndex  : which phrase we're currently on
   - charIndex    : how many characters are currently shown
   - isDeleting   : whether we're currently erasing or typing

   The function calls itself recursively via setTimeout.
   ================================================================ */

// ---- EDIT THESE to change what the typewriter cycles through ----
const phrases = [
  'building data pipelines.',
  'upskilling.',
  'automating the boring stuff.',
  'creating databases.',
  'vibe-coding.'
];

const typingSpeed    = 65;   // ms delay between each character typed
const deleteSpeed    = 35;   // ms delay between each character deleted
const pauseAfterWord = 1800; // ms to wait at end of a full phrase

let phraseIndex = 0;     // Start on the first phrase
let charIndex   = 0;     // Start with 0 characters shown
let isDeleting  = false; // Start by typing, not deleting

const typewriterEl = document.getElementById('typewriter');

function type() {
  const currentPhrase = phrases[phraseIndex];

  if (!isDeleting) {
    // --- TYPING: add one character ---
    charIndex++;
    typewriterEl.textContent = currentPhrase.slice(0, charIndex);

    // If we've typed the full phrase, switch to deleting after a pause
    if (charIndex === currentPhrase.length) {
      isDeleting = true;
      setTimeout(type, pauseAfterWord);
      return; // Exit early — we'll resume after the pause
    }

  } else {
    // --- DELETING: remove one character ---
    charIndex--;
    typewriterEl.textContent = currentPhrase.slice(0, charIndex);

    // If we've deleted everything, move to the next phrase
    if (charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length; // Loop back to 0 at end
      setTimeout(type, 400); // Short pause before starting next phrase
      return;
    }
  }

  // Schedule the next character
  setTimeout(type, isDeleting ? deleteSpeed : typingSpeed);
}

// Initial delay before the typewriter starts (lets the hero animate in first)
setTimeout(type, 1400);


/* ================================================================
   4. SCROLL REVEAL
   Watches elements with the class .reveal using IntersectionObserver.
   When a .reveal element enters the viewport, .visible is added.
   CSS transitions in styles.css handle the actual animation.

   threshold: 0.1 means "trigger when 10% of the element is visible"

   The staggered setTimeout(i * 80) means when multiple elements
   enter the viewport at once, they appear one after another (cascade).

   observer.unobserve() removes the element from watching after it's
   revealed — so it only animates once, not every time you scroll.
   ================================================================ */

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger: each element in the batch is delayed by 80ms more
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 80);

      // Stop watching this element (animate only once)
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1 // Trigger when 10% of the element is in view
});

// Attach observer to every element with class .reveal
document.querySelectorAll('.reveal').forEach((el) => {
  revealObserver.observe(el);
});
