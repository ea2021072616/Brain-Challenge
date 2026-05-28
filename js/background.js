/**
 * Interactive Particle Background (BackgroundTech)
 * Brain Challenge — CATEC 2026-I
 * Draws nodes that float around and connect to each other and the mouse cursor.
 */
const BackgroundTech = (() => {
  let canvas = null;
  let ctx = null;
  let particles = [];
  const particleCount = 70;
  const connectionDistance = 100;
  const mouseConnectionDistance = 150;
  const mouse = { x: null, y: null, active: false };

  class Particle {
    constructor(w, h) {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.vx = (Math.random() - 0.5) * 0.5; // Slow random movement
      this.vy = (Math.random() - 0.5) * 0.5;
      this.radius = Math.random() * 2 + 1; // 1px to 3px
      this.pulseSpeed = 0.01 + Math.random() * 0.02;
      this.pulseTime = Math.random() * Math.PI;
      // Randomly assign cyan or purple base color values (RGB format)
      this.colorBase = Math.random() > 0.5 ? '138, 235, 255' : '192, 132, 252';
    }

    update(w, h) {
      this.x += this.vx;
      this.y += this.vy;
      this.pulseTime += this.pulseSpeed;

      // Bounce on edges
      if (this.x < 0 || this.x > w) this.vx *= -1;
      if (this.y < 0 || this.y > h) this.vy *= -1;
      
      // Clamp inside bounds
      if (this.x < 0) this.x = 0;
      if (this.x > w) this.x = w;
      if (this.y < 0) this.y = 0;
      if (this.y > h) this.y = h;
    }

    draw(ctx) {
      // Glow pulse effect using sine wave
      const alpha = 0.2 + Math.sin(this.pulseTime) * 0.45; // 0.1 to 0.65
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.colorBase}, ${alpha})`;
      ctx.fill();
    }
  }

  function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function init() {
    canvas = document.getElementById('tech-canvas');
    if (!canvas) {
      // Create canvas dynamically if not defined in markup
      canvas = document.createElement('canvas');
      canvas.id = 'tech-canvas';
      canvas.style.position = 'fixed';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.width = '100vw';
      canvas.style.height = '100vh';
      canvas.style.zIndex = '-1';
      canvas.style.pointerEvents = 'none';
      canvas.style.background = '#07050d'; // Deep CATEC background color
      document.body.prepend(canvas);
    }
    
    ctx = canvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Track mouse movements
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
      mouse.active = false;
    });

    // Populate particles
    particles = [];
    const w = canvas.width;
    const h = canvas.height;
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(w, h));
    }

    // Start animation loop
    requestAnimationFrame(loop);
  }

  function loop() {
    if (!canvas || !ctx) return;
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Draw background grid layer (very subtle circuit pattern)
    drawBackgroundGrid(w, h);

    // Update and draw particles
    particles.forEach(p => {
      p.update(w, h);
      p.draw(ctx);
    });

    // Connect close nodes and cursor
    drawConnections();

    requestAnimationFrame(loop);
  }

  function drawBackgroundGrid(w, h) {
    ctx.strokeStyle = 'rgba(15, 23, 42, 0.15)'; // Very faint midnight blue line grid
    ctx.lineWidth = 1;
    const gridSize = 50;

    ctx.beginPath();
    for (let x = 0; x < w; x += gridSize) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
    }
    for (let y = 0; y < h; y += gridSize) {
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
    }
    ctx.stroke();
  }

  function drawConnections() {
    // Connect particles
    for (let i = 0; i < particles.length; i++) {
      const p1 = particles[i];
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectionDistance) {
          const alpha = (1 - dist / connectionDistance) * 0.12; // Translucency
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(${p1.colorBase}, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      // Connect to mouse cursor
      if (mouse.active && mouse.x !== null && mouse.y !== null) {
        const dx = p1.x - mouse.x;
        const dy = p1.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouseConnectionDistance) {
          const alpha = (1 - dist / mouseConnectionDistance) * 0.45; // Dynamic fade based on distance
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(138, 235, 255, ${alpha})`; // Bright cyan line
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
  }

  return { init };
})();
