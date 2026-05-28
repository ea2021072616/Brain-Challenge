/**
 * UI Module - View Transitions, Toasts, Modals, Animations, and Roulette Wheel
 * Brain Challenge — UPT CATEC 2026-I
 */
const UI = (() => {
  const views = ['setup', 'bracket', 'game', 'deathmatch', 'result'];
  
  let currentRotation = 0;
  let rouletteCallback = null;
  let targetCatId = null;
  let isSpinning = false;

  function showView(name) {
    views.forEach(v => {
      const el = document.getElementById(`view-${v}`);
      if (el) {
        el.classList.toggle('active', v === name);
      }
    });

    // Show/hide floating moderator panel toggle button depending on view context
    const adminToggle = document.querySelector('.admin-toggle-btn');
    if (adminToggle) {
      const showToggle = (name === 'game' || name === 'deathmatch');
      adminToggle.classList.toggle('hidden', !showToggle);
    }

    // Show/hide specific controls in the unified moderator panel
    const modGame = document.getElementById('mod-controls-game');
    const modDm = document.getElementById('mod-controls-dm');
    if (modGame && modDm) {
      modGame.classList.toggle('hidden', name !== 'game');
      modDm.classList.toggle('hidden', name !== 'deathmatch');
    }

    // Auto-collapse moderator drawer when changing views
    const panel = document.querySelector('.moderator-panel');
    const btn = document.querySelector('.admin-toggle-btn');
    if (panel && btn && panel.classList.contains('active')) {
      panel.classList.remove('active');
      btn.classList.remove('active');
    }

    renderIcons();
  }

  function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  function setHTML(id, val) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = val;
  }

  function showModal(id) {
    const m = document.getElementById(id);
    if (m) m.classList.add('show');
    renderIcons();
  }

  function closeModal(id) {
    const m = document.getElementById(id);
    if (m) m.classList.remove('show');
  }

  function toast(msg, type = 'info', duration = 2500) {
    const t = document.getElementById('toast');
    if (!t) return;
    
    t.className = '';
    void t.offsetWidth; // Force reflow
    
    t.innerHTML = `
      <div class="toast-content">
        <i data-lucide="${getToastIcon(type)}" class="toast-icon"></i>
        <span>${msg}</span>
      </div>
    `;
    t.className = `show ${type}`;
    
    renderIcons();

    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove('show'), duration);
  }

  function getToastIcon(type) {
    switch (type) {
      case 'success': return 'check-circle';
      case 'error': return 'alert-triangle';
      case 'info':
      default: return 'info';
    }
  }

  function bumpScore(team) {
    const id = team === 'A' ? 'g-scoreA' : 'g-scoreB';
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('bump');
    void el.offsetWidth; // Force reflow
    el.classList.add('bump');
  }

  function confetti() {
    const wrap = document.createElement('div');
    wrap.className = 'confetti-wrap';
    document.body.appendChild(wrap);
    
    const colors = ['#00f0ff', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#ffffff'];
    for (let i = 0; i < 100; i++) {
      const p = document.createElement('div');
      p.className = 'confetti-piece';
      p.style.cssText = `
        left: ${Math.random() * 100}%;
        top: -20px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        animation-duration: ${1.8 + Math.random() * 2}s;
        animation-delay: ${Math.random() * 1}s;
        width: ${6 + Math.random() * 8}px;
        height: ${6 + Math.random() * 8}px;
        border-radius: ${Math.random() > 0.5 ? '50%' : '3px'};
      `;
      wrap.appendChild(p);
    }
    setTimeout(() => wrap.remove(), 5000);
  }

  function renderIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }

  // ── COLLAPSIBLE MODERATOR DRAWER ──
  function toggleModeratorPanel() {
    const panel = document.querySelector('.moderator-panel');
    const btn = document.querySelector('.admin-toggle-btn');
    if (panel && btn) {
      const isActive = panel.classList.toggle('active');
      btn.classList.toggle('active', isActive);
      
      // Notify action
      if (isActive) {
        toast('Panel del moderador visible', 'info', 1500);
      } else {
        toast('Panel del moderador oculto', 'info', 1500);
      }
    }
  }

  // ── CATEGORY ROULETTE WHEEL ──
  function openRoulette(catId, callback) {
    targetCatId = catId;
    rouletteCallback = callback;
    isSpinning = false;

    const canvas = document.getElementById('roulette-canvas');
    if (canvas) {
      drawRouletteWheel(canvas, DB.categorias);
      canvas.style.transform = `rotate(0deg)`;
      canvas.style.transition = 'none';
      currentRotation = 0;
    }

    const spinBtn = document.getElementById('btn-spin-roulette');
    if (spinBtn) spinBtn.disabled = false;

    showModal('modal-roulette');
  }

  function drawRouletteWheel(canvas, categories) {
    const ctx = canvas.getContext('2d');
    const cw = canvas.width;
    const ch = canvas.height;
    const cx = cw / 2;
    const cy = ch / 2;
    const r = Math.min(cx, cy) - 10;
    const numSectors = categories.length;
    const sectorAngle = (2 * Math.PI) / numSectors;

    ctx.clearRect(0, 0, cw, ch);

    const colors = [
      '#7c3aed', // Purple (Programación)
      '#06b6d4', // Cyan (Videojuegos)
      '#f59e0b', // Tech Orange (BBDD)
      '#10b981', // Emerald (Redes)
      '#ec4899', // Magenta (Metodologías)
      '#4f46e5', // Indigo (Anime)
      '#d946ef'  // Fuchsia (Cultura Gen)
    ];

    categories.forEach((cat, i) => {
      const startAngle = i * sectorAngle;
      const endAngle = (i + 1) * sectorAngle;

      // Draw Slice Sector
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = colors[i % colors.length];
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#07050d';
      ctx.stroke();

      // Sector Title Text label
      const midAngle = startAngle + sectorAngle / 2;
      const normAngle = midAngle % (2 * Math.PI);

      ctx.save();
      ctx.translate(cx, cy);

      let name = cat.shortName || cat.name;
      if (name.length > 20) name = name.substring(0, 18) + '...';

      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#07050d';
      ctx.lineWidth = 3;
      ctx.lineJoin = 'round';
      ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';

      // Check if angle is in the left half of the circle (between 90 and 270 degrees)
      if (normAngle > Math.PI / 2 && normAngle < 3 * Math.PI / 2) {
        ctx.rotate(midAngle + Math.PI);
        ctx.textAlign = 'left';
        ctx.strokeText(name, -(r - 28), 0);
        ctx.fillText(name, -(r - 28), 0);
      } else {
        ctx.rotate(midAngle);
        ctx.textAlign = 'right';
        ctx.strokeText(name, r - 28, 0);
        ctx.fillText(name, r - 28, 0);
      }
      ctx.restore();
    });

    // Center circular badge
    ctx.beginPath();
    ctx.arc(cx, cy, 45, 0, 2 * Math.PI);
    ctx.fillStyle = '#07050d';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#c084fc';
    ctx.stroke();

    // Center inner purple dot
    ctx.beginPath();
    ctx.arc(cx, cy, 12, 0, 2 * Math.PI);
    ctx.fillStyle = '#c084fc';
    ctx.fill();
  }

  function triggerRouletteSpin() {
    if (isSpinning) return;
    isSpinning = true;

    const spinBtn = document.getElementById('btn-spin-roulette');
    if (spinBtn) spinBtn.disabled = true;

    const canvas = document.getElementById('roulette-canvas');
    if (!canvas) return;

    const numSectors = DB.categorias.length;
    const sectorAngleDeg = 360 / numSectors;
    const index = DB.categorias.findIndex(c => c.id === targetCatId);
    if (index === -1) return;

    // Center point angle of selected category wedge
    const centerAngle = (index + 0.5) * sectorAngleDeg;

    // Calculate rotation to place centerAngle at 270 (top pointer)
    const extraSpins = 6 * 360; // 6 spins
    const targetDiff = (270 - centerAngle) - (currentRotation % 360);
    const rotationIncrement = extraSpins + (targetDiff >= 0 ? targetDiff : targetDiff + 360);
    
    currentRotation += rotationIncrement;

    canvas.style.transition = 'transform 4.5s cubic-bezier(0.15, 0.85, 0.15, 1)';
    canvas.style.transform = `rotate(${currentRotation}deg)`;

    // Wait for transition animation
    setTimeout(() => {
      const selectedCat = DB.getCatById(targetCatId);
      const name = selectedCat ? selectedCat.name : '';
      toast(`¡Sorteado!: ${name}`, 'success', 3000);
      
      // Delay closing modal and triggering continuation callback
      setTimeout(() => {
        closeModal('modal-roulette');
        if (rouletteCallback) {
          rouletteCallback();
        }
      }, 1500);
    }, 4500);
  }

  return { 
    showView, 
    setText, 
    setHTML, 
    showModal, 
    closeModal, 
    toast, 
    bumpScore, 
    confetti,
    renderIcons,
    toggleModeratorPanel,
    openRoulette,
    triggerRouletteSpin
  };
})();
