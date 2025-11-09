// Cursor: Respect "Reduce Motion"
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

// Typing Effect
const typingText = document.getElementById("typingText");
const phrases = ["Problem Solver", "Creative Thinker", "Code Enthusiast"];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
  const currentPhrase = phrases[phraseIndex];

  if (isDeleting) {
    typingText.textContent = currentPhrase.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typingText.textContent = currentPhrase.substring(0, charIndex + 1);
    charIndex++;
  }

  if (!isDeleting && charIndex === currentPhrase.length) {
    setTimeout(() => (isDeleting = true), 2000);
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
  }

  const typingSpeed = isDeleting ? 50 : 100;
  setTimeout(typeEffect, typingSpeed);
}

typeEffect();

// Scroll Progress Bar (optimized)
const scrollBar = document.getElementById("scrollProgress");
window.addEventListener(
  "scroll",
  () => {
    const max =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    scrollBar.style.width = (window.scrollY / max) * 100 + "%";
  },
  { passive: true }
);

// Navbar Scroll Effect
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  if (window.scrollY > 100) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// Guard Motion-Heavy Features with if statement
if (!prefersReducedMotion) {
  // Cursor Trail Effect (scroll-safe, uses viewport coords)
  const cursorTrail = document.getElementById("cursorTrail");
  let trails = [];
  const maxTrails = 10;

  document.addEventListener("mousemove", (e) => {
    const x = e.clientX; // viewport coords (correct for position: fixed)
    const y = e.clientY;

    const trail = cursorTrail.cloneNode();
    trail.style.left = x + "px";
    trail.style.top = y + "px";
    trail.style.opacity = "1";
    document.body.appendChild(trail);
    trails.push(trail);

    setTimeout(() => {
      trail.style.opacity = "0";
    }, 100);
    setTimeout(() => {
      trail.remove();
    }, 500);

    if (trails.length > maxTrails) {
      trails[0].remove();
      trails.shift();
    }
  });

  // Project Card Tilt Effect
  const cards = document.querySelectorAll(".project-card");
  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform =
        "perspective(1000px) rotateX(0) rotateY(0) translateY(0)";
    });
  });
}

// Skill Progress Animation (per-bar observer)
const skillBars = document.querySelectorAll(".skill-progress");

function fillBar(el) {
  const progress = el.getAttribute("data-progress");
  // If user prefers reduced motion, set width instantly
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    el.style.transition = "none";
  }
  el.style.width = progress + "%";
}

if ("IntersectionObserver" in window) {
  const barObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          fillBar(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      threshold: 0.2,
      rootMargin: "0px 0px -10% 0px",
    }
  );

  skillBars.forEach((bar) => barObserver.observe(bar));
} else {
  // Fallback for old browsers—fill immediately
  skillBars.forEach(fillBar);
}
