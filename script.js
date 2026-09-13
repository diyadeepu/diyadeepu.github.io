// script.js
// Handles:
// 1) Custom butterfly cursor (🦋) and sparkle trail (✨)
// 2) Coursework Dashboard toggles + animated card swapping
// -----------------------------------------------------------------

// --- Utility: ensure DOM has loaded before binding ---
document.addEventListener('DOMContentLoaded', () => {
  initButterflyCursor();
  initCourseworkDashboard();
  // fill current year
  document.getElementById('year').textContent = new Date().getFullYear();
});


/* ---------------------------
   1) Custom butterfly cursor
   ---------------------------
   Behavior:
   - The native cursor is hidden via CSS.
   - A DOM element (#butterfly) follows the pointer with a small lag for smooth, premium feel.
   - On pointermove we spawn small 'sparkle' elements (✨) at the pointer position.
   - Sparkles have a CSS animation (sparkleOut) that scales down and fades out over 500ms.
   - After the animation finishes, we remove the sparkle element from the DOM.
*/
function initButterflyCursor() {
  const butterfly = document.getElementById('butterfly');

  // Use a slight trailing motion by storing target and using requestAnimationFrame
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let targetX = mouseX;
  let targetY = mouseY;
  let lastSpawn = 0;

  // Move the visible butterfly toward the target using lerp for smooth lag
  function animate() {
    // simple lerp toward target
    mouseX += (targetX - mouseX) * 0.18;
    mouseY += (targetY - mouseY) * 0.18;

    butterfly.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;

    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);

  // On pointer move: update target, spawn sparkle trail at a limited rate
  window.addEventListener('pointermove', (e) => {
    // Update the target to current pointer position
    targetX = e.clientX;
    targetY = e.clientY;

    // Slight rotation/scale based on movement velocity (optional subtle effect)
    const now = performance.now();
    const dt = Math.max(1, now - lastSpawn);

    // Only spawn sparkles at a max frequency to avoid DOM overload
    if (dt > 24) { // ~40fps spawn cap
      spawnSparkle(e.clientX, e.clientY);
      lastSpawn = now;
    }
  });

  // When pointer leaves window, gently hide the butterfly
  window.addEventListener('pointerleave', () => {
    butterfly.style.opacity = '0';
    butterfly.style.transform += ' scale(0.9)';
  });
  window.addEventListener('pointerenter', () => {
    butterfly.style.opacity = '1';
  });

  // Creates a sparkle element at (x,y) that animates and is removed after 600ms
  function spawnSparkle(x, y) {
    const s = document.createElement('span');
    s.className = 'sparkle';
    s.textContent = '✨';
    // Slight randomization for color tint and size
    s.style.left = `${x}px`;
    s.style.top = `${y}px`;
    const size = 10 + Math.random() * 10;
    s.style.fontSize = `${size}px`;

    // Random tiny hue shift using color accent palette via CSS filter approach (subtle)
    const palette = [
      'brightness(1.05) drop-shadow(0 0 6px rgba(81,227,252,0.18))',
      'brightness(1.03) drop-shadow(0 0 6px rgba(74,143,255,0.14))',
      'brightness(1.04) drop-shadow(0 0 6px rgba(149,102,255,0.12))',
      'brightness(1.04) drop-shadow(0 0 6px rgba(202,110,255,0.10))'
    ];
    s.style.filter = palette[Math.floor(Math.random() * palette.length)];

    document.body.appendChild(s);

    // Remove after the CSS animation completes (500ms)
    setTimeout(() => {
      if (s && s.parentNode) s.parentNode.removeChild(s);
    }, 600);
  }
}


/* ----------------------------------------
   2) Coursework Dashboard (toggles & cards)
   ----------------------------------------
   Behavior:
   - Two toggle buttons (Completed at OSU, Planned Coursework)
   - Clicking a toggle triggers a smooth crossfade/transform:
     - Add a 'switching' class to the container to animate out
     - After 280ms, replace contents and remove 'switching' to animate in
   - Cards have a small hover tilt and glow (pure CSS) to keep JS minimal
*/
function initCourseworkDashboard() {
  const completedBtn = document.getElementById('completedToggle');
  const plannedBtn = document.getElementById('plannedToggle');
  const container = document.getElementById('cardsContainer');

  const completedCourses = [
    'Introduction to Computer Science II (CS 162)',
    'Web Development (CS 290)',
    'Data Structures (CS 261)',
    'Computer Architecture & Assembly Language (CS 271)',
    'Foundations of the Entrepreneurial Mindset (BA 260)'
  ];

  const plannedCourses = [
    'Analysis of Algorithms',
    'Introduction to Databases',
    'Software Engineering',
    'Intro to Stats for Engineers'
  ];

  // Initial render: completed
  renderCards(completedCourses, container);

  // Toggle handlers
  completedBtn.addEventListener('click', () => {
    if (completedBtn.classList.contains('active')) return;
    setActiveToggle(completedBtn, plannedBtn);
    swapCards(completedCourses);
  });

  plannedBtn.addEventListener('click', () => {
    if (plannedBtn.classList.contains('active')) return;
    setActiveToggle(plannedBtn, completedBtn);
    swapCards(plannedCourses);
  });

  function setActiveToggle(activeEl, otherEl) {
    activeEl.classList.add('active');
    activeEl.setAttribute('aria-selected', 'true');
    otherEl.classList.remove('active');
    otherEl.setAttribute('aria-selected', 'false');
  }

  // Smooth swap: animate out, replace, animate in
  function swapCards(courseList) {
    container.classList.add('switching'); // fades & translates out via CSS
    // After the outgoing animation completes, change content and animate in
    setTimeout(() => {
      renderCards(courseList, container);
      // small delay to allow browser to apply DOM updates before removing switching
      requestAnimationFrame(() => {
        container.classList.remove('switching');
      });
    }, 300); // matches CSS durations for pleasant feel
  }

  // Create card elements and add to container
  function renderCards(items, parent) {
    parent.innerHTML = ''; // clear
    items.forEach((text) => {
      const card = document.createElement('div');
      card.className = 'course-card';
      // Use a small inner structure so CSS pseudo-element doesn't occlude text
      const title = document.createElement('h4');
      title.textContent = text;
      const p = document.createElement('p');
      // Add a small hint / clickable feel
      p.textContent = 'Course • Interactive';
      card.appendChild(title);
      card.appendChild(p);

      // Optional: subtle tilt on mouse move over card for a 3D feel
      // Keep lightweight: only enable small transform based on cursor within the card
      card.addEventListener('mousemove', (ev) => {
        const rect = card.getBoundingClientRect();
        const rx = -(ev.clientY - rect.top - rect.height / 2) / 20; // rotateX
        const ry = (ev.clientX - rect.left - rect.width / 2) / 20; // rotateY
        card.style.transform = `translateY(-8px) perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });

      parent.appendChild(card);
    });
  }
}


