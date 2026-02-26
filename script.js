(function() {
'use strict';

/* ── CUSTOM CURSOR ── */
const cur  = document.getElementById('cur');
const curR = document.getElementById('curR');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cur.style.left = mx + 'px';
  cur.style.top  = my + 'px';
});

(function animCursor() {
  rx += (mx - rx) * 0.11;
  ry += (my - ry) * 0.11;
  curR.style.left = rx + 'px';
  curR.style.top  = ry + 'px';
  requestAnimationFrame(animCursor);
})();

document.querySelectorAll('a, button, .tcard, .bcard, .ipost, .afeat').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

/* ── HEADER: topbar slides away on scroll ── */
const siteHdr = document.getElementById('site-header');
const topbar  = document.getElementById('topbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    topbar.classList.add('gone');
    siteHdr.classList.add('compact');
  } else {
    topbar.classList.remove('gone');
    siteHdr.classList.remove('compact');
  }
}, { passive: true });

/* ── PARALLAX ── */
const heroBg   = document.getElementById('heroBg');
const pb1      = document.getElementById('pb1');
const pb2      = document.getElementById('pb2');
const banner1  = document.getElementById('pbanner1');
const banner2  = document.getElementById('pbanner2');

function doParallax() {
  const s = window.scrollY;

  // Hero bg drifts down as user scrolls
  if (heroBg) heroBg.style.transform = `translateY(${s * 0.38}px)`;

  // Parallax banners — bg drifts in opposite direction to scroll
  if (pb1 && banner1) {
    const rect = banner1.getBoundingClientRect();
    pb1.style.transform = `translateY(${-rect.top * 0.2}px)`;
  }
  if (pb2 && banner2) {
    const rect = banner2.getBoundingClientRect();
    pb2.style.transform = `translateY(${-rect.top * 0.2}px)`;
  }
}

window.addEventListener('scroll', doParallax, { passive: true });
doParallax();

/* ── SCROLL REVEAL (IntersectionObserver) ── */
const revClasses = ['.rev', '.rev-l', '.rev-r', '.rev-scale'];
const allRevEls  = document.querySelectorAll(revClasses.join(','));

const revObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

allRevEls.forEach(el => revObs.observe(el));

/* ── STAGGER CHILDREN on reveal ── */
const staggerEls = document.querySelectorAll('.stagger');
const stagObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      stagObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

staggerEls.forEach(el => stagObs.observe(el));

/* ── COUNTER ANIMATION ── */
function animateCount(el, target, duration) {
  let start = null;
  function step(ts) {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}

const counters = document.querySelectorAll('.count-up');
const cntObs   = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = parseInt(entry.target.dataset.target, 10);
      animateCount(entry.target, target, 1800);
      cntObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
counters.forEach(c => cntObs.observe(c));

/* ── SMOOTH SCROLL for anchor links ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      const offset = siteHdr.offsetHeight + 16;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    }
  });
});

/* ── FORM SUBMIT feedback ── */
const formBtn = document.getElementById('formBtn');
if (formBtn) {
  formBtn.addEventListener('click', () => {
    formBtn.innerHTML = '<i class="fas fa-check-circle"></i> Sent! We\'ll reach out soon.';
    formBtn.style.background = 'linear-gradient(135deg,#2E7D32,#388E3C)';
    setTimeout(() => {
      formBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      formBtn.style.background = '';
    }, 5000);
  });
}

/* ── TILT effect on theme cards ── */
document.querySelectorAll('.tcard').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect   = card.getBoundingClientRect();
    const cx     = rect.left + rect.width / 2;
    const cy     = rect.top  + rect.height / 2;
    const dx     = (e.clientX - cx) / (rect.width  / 2);
    const dy     = (e.clientY - cy) / (rect.height / 2);
    card.style.transform = `translateY(-10px) scale(1.02) rotateX(${-dy * 5}deg) rotateY(${dx * 5}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

})();