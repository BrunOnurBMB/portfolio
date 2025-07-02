/*
const dot = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');

let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

function animateRing() {
  ringX += (mouseX - ringX) * 0.4;
  ringY += (mouseY - ringY) * 0.4;

  ring.style.left = `${ringX}px`;
  ring.style.top = `${ringY}px`;
  dot.style.left = `${mouseX}px`;
  dot.style.top = `${mouseY}px`;

  requestAnimationFrame(animateRing);
}

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

document.addEventListener('mouseover', (e) => {
  if (
    e.target.tagName === 'A' ||
    e.target.tagName === 'BUTTON' ||
    e.target.onclick ||
    e.target.tabIndex >= 0
  ) {
    dot.style.backgroundColor = '#d1fae5'; // dot mais claro
    ring.style.borderColor = '#a7f3d0'; // ring mais claro
    ring.style.transform = 'translate(-50%, -50%) scale(1.5)';
  }
});

document.addEventListener('mouseout', (e) => {
  dot.style.backgroundColor = ''; // volta à cor original definida no scroll
  ring.style.borderColor = ''; // volta à cor original do ring
  ring.style.transform = 'translate(-50%, -50%) scale(1)';
});

document.addEventListener('mousedown', () => {
  ring.style.transform = 'translate(-50%, -50%) scale(1.8)';
});

document.addEventListener('mouseup', () => {
  ring.style.transform = 'translate(-50%, -50%) scale(1)';
});


animateRing();

*/
function isMobile() {
  return window.innerWidth <= 900;
}

const dot = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');

if (!isMobile() && dot && ring) {
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  function animateRing() {
    ringX += (mouseX - ringX) * 0.4;
    ringY += (mouseY - ringY) * 0.4;

    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;

    requestAnimationFrame(animateRing);
  }

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  document.addEventListener('mouseover', (e) => {
    if (
      e.target.tagName === 'A' ||
      e.target.tagName === 'BUTTON' ||
      e.target.onclick ||
      e.target.tabIndex >= 0
    ) {
      dot.style.backgroundColor = '#d1fae5'; // dot mais claro
      ring.style.borderColor = '#a7f3d0';    // ring mais claro
      ring.style.transform = 'translate(-50%, -50%) scale(1.5)';
    }
  });

  document.addEventListener('mouseout', () => {
    dot.style.backgroundColor = '';
    ring.style.borderColor = '';
    ring.style.transform = 'translate(-50%, -50%) scale(1)';
  });

  document.addEventListener('mousedown', () => {
    ring.style.transform = 'translate(-50%, -50%) scale(1.8)';
  });

  document.addEventListener('mouseup', () => {
    ring.style.transform = 'translate(-50%, -50%) scale(1)';
  });

  animateRing();
} else {
  // Oculta os elementos no mobile
  if (dot) dot.style.display = 'none';
  if (ring) ring.style.display = 'none';
}