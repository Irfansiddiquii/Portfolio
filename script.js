/* ============================================================
   1. CUSTOM CURSOR
============================================================ */
const dot = document.getElementById('cur-dot');
const ring = document.getElementById('cur-outline');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

function animateCursor() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  dot.style.left  = mx + 'px';
  dot.style.top   = my + 'px';
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll('a, button, .project-card, .skill-pill').forEach(el => {
  el.addEventListener('mouseenter', () => {
    dot.style.width  = '16px'; dot.style.height = '16px';
    dot.style.background = 'var(--accent2)';
    ring.style.width = '52px'; ring.style.height = '52px';
    ring.style.borderColor = 'rgba(255,60,172,.5)';
  });
  el.addEventListener('mouseleave', () => {
    dot.style.width  = '8px'; dot.style.height = '8px';
    dot.style.background = 'var(--accent)';
    ring.style.width = '32px'; ring.style.height = '32px';
    ring.style.borderColor = 'rgba(0,255,225,.4)';
  });
});

/* ============================================================
   2. THREE.JS — PARTICLE FIELD
============================================================ */
(function initThree() {
  const canvas = document.getElementById('bg-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  /* Particles */
  const COUNT = 3000;
  const positions = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 20;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({ color: 0x00ffe1, size: 0.025, transparent: true, opacity: 0.7 });
  const particles = new THREE.Points(geo, mat);
  scene.add(particles);

  /* Grid lines */
  const gridHelper = new THREE.GridHelper(30, 30, 0x111133, 0x111133);
  gridHelper.position.y = -3;
  scene.add(gridHelper);

  /* Mouse parallax */
  let targetX = 0, targetY = 0;
  document.addEventListener('mousemove', e => {
    targetX = (e.clientX / window.innerWidth  - 0.5) * 0.4;
    targetY = (e.clientY / window.innerHeight - 0.5) * 0.4;
  });

  /* Resize */
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  /* Animate */
  const clock = new THREE.Clock();
  function animate() {
    const t = clock.getElapsedTime();
    particles.rotation.y = t * 0.03;
    particles.rotation.x = t * 0.015;
    camera.position.x += (targetX - camera.position.x) * 0.04;
    camera.position.y += (-targetY - camera.position.y) * 0.04;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
})();

/* ============================================================
   3. GSAP HERO ANIMATIONS
============================================================ */
gsap.registerPlugin(ScrollTrigger);

const heroTL = gsap.timeline({ defaults: { ease: 'power3.out' } });
heroTL
  .to('#h-label',  { opacity:1, y:0, duration:.7, delay:.3 }, 0)
  .from('#h-name',  { y:60 }, 0)
  .to('#h-name',    { opacity:1, duration:.9 }, .2)
  .to('#h-role',    { opacity:1, y:0, duration:.7 }, .5)
  .to('#h-desc',    { opacity:1, y:0, duration:.7 }, .7)
  .to('#h-btns',    { opacity:1, y:0, duration:.7 }, .85)
  .to('#h-scroll',  { opacity:1, duration:.6 }, 1.1);

/* Set initial states */
gsap.set(['#h-role','#h-desc','#h-btns','#h-scroll'], { y: 20 });

/* ============================================================
   4. GSAP SCROLL REVEALS
============================================================ */
document.querySelectorAll('.gsap-reveal').forEach((el, i) => {
  gsap.from(el, {
    scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
    opacity: 0, y: 50,
    duration: 0.9,
    delay: (i % 3) * 0.1,
    ease: 'power2.out'
  });
});

/* ============================================================
   5. SKILL BARS — animate when visible
============================================================ */
document.querySelectorAll('.skill-pill').forEach(pill => {
  const level = pill.dataset.level || 70;
  const bar   = pill.querySelector('.skill-bar');
  ScrollTrigger.create({
    trigger: pill,
    start: 'top 88%',
    onEnter: () => { bar.style.width = level + '%'; }
  });
});

/* ============================================================
   6. NAVBAR — shrink on scroll
============================================================ */
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (window.scrollY > 60) {
    nav.style.padding = '12px 60px';
    nav.style.borderBottomColor = 'rgba(0,255,225,.08)';
  } else {
    nav.style.padding = '20px 60px';
    nav.style.borderBottomColor = 'var(--border)';
  }
});

/* ============================================================
   7. FORM SUBMIT
============================================================ */
function handleSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('.form-submit');
  btn.textContent = '✓ Message Sent!';
  btn.style.background = 'linear-gradient(90deg,#00c9a7,#00ffe1)';
  setTimeout(() => {
    btn.textContent = 'Send Message ✦';
    btn.style.background = '';
    e.target.reset();
  }, 3000);
}
