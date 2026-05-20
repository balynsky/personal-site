// Async-load non-critical stylesheets after initial render
(function() {
  function loadCSS(href) {
    var l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = href;
    document.head.appendChild(l);
  }
  loadCSS('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
  loadCSS('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css');
})();

// Sticky nav + scroll-to-top
let nav = document.querySelector("nav");
let scrollBtn = document.querySelector(".scroll-button a");

window.onscroll = function() {
  if (document.documentElement.scrollTop > 20) {
    nav.classList.add("sticky");
    scrollBtn.style.display = "flex";
  } else {
    nav.classList.remove("sticky");
    scrollBtn.style.display = "none";
  }
};

// Mobile menu
let body = document.querySelector("body");
let navBar = document.querySelector(".navbar");
let menuBtn = document.querySelector(".menu-btn");
let cancelBtn = document.querySelector(".cancel-btn");

menuBtn.onclick = function() {
  navBar.classList.add("active");
  menuBtn.style.opacity = "0";
  menuBtn.style.pointerEvents = "none";
  body.style.overflow = "hidden";
};

cancelBtn.onclick = function() {
  navBar.classList.remove("active");
  menuBtn.style.opacity = "1";
  menuBtn.style.pointerEvents = "auto";
  body.style.overflow = "auto";
};

document.querySelectorAll(".menu li a").forEach(link => {
  link.addEventListener("click", function() {
    navBar.classList.remove("active");
    menuBtn.style.opacity = "1";
    menuBtn.style.pointerEvents = "auto";
    body.style.overflow = "auto";
  });
});

// Scroll reveal with staggered delay
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add("visible");
      }, i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

// Gallery lightbox
(function() {
  const lb = document.getElementById('galleryLightbox');
  if (!lb) return;

  // Unique images for prev/next navigation (deduplicated by src)
  const seen = new Set();
  const unique = Array.from(document.querySelectorAll('.gallery-item[data-src]'))
    .filter(el => { const s = el.dataset.src; if (seen.has(s)) return false; seen.add(s); return true; });

  const lbImg = lb.querySelector('.lightbox-img');
  const lbCap = lb.querySelector('.lightbox-caption');
  let current = 0;

  function open(src) {
    current = unique.findIndex(el => el.dataset.src === src);
    lbImg.src = src;
    lbImg.alt = unique[current].querySelector('img').alt;
    lbCap.textContent = unique[current].dataset.caption || '';
    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    lb.classList.remove('active');
    document.body.style.overflow = '';
  }
  function prev() { const i = (current - 1 + unique.length) % unique.length; open(unique[i].dataset.src); }
  function next() { const i = (current + 1) % unique.length; open(unique[i].dataset.src); }

  document.querySelectorAll('.gallery-item[data-src]')
    .forEach(el => el.addEventListener('click', () => open(el.dataset.src)));

  lb.querySelector('.lightbox-close').addEventListener('click', close);
  lb.querySelector('.lightbox-prev').addEventListener('click', prev);
  lb.querySelector('.lightbox-next').addEventListener('click', next);
  lb.querySelector('.lightbox-backdrop').addEventListener('click', close);
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('active')) return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowLeft')  prev();
    if (e.key === 'ArrowRight') next();
  });
})();
