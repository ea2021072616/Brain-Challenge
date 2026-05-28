/**
 * Timer Module - Countdown and Visual SVG Ring Controller
 * Brain Challenge — UPT CATEC 2026-I
 */
const Timer = (() => {
  let interval = null;
  let remaining = 0;
  let total = 30;
  let onExpire = null;

  const CIRCUM = 138.2;

  function getElements() {
    return {
      arc: document.getElementById('timerArc'),
      display: document.getElementById('timer-display')
    };
  }

  function updateDisplay() {
    const { arc, display } = getElements();
    if (!display) return;

    display.textContent = remaining;
    
    // Update SVG stroke-dashoffset to show circular countdown
    if (arc) {
      const offset = CIRCUM * (1 - remaining / total);
      arc.style.strokeDashoffset = offset;
    }

    // Assign class and colors based on time remaining thresholds
    display.className = 'timer-display';
    if (arc) {
      arc.style.stroke = '';
      arc.classList.remove('pulse-slow', 'pulse-fast');
    }

    if (remaining <= 5) {
      display.classList.add('timer-danger');
      if (arc) {
        arc.style.stroke = 'var(--danger)';
        arc.classList.add('pulse-fast');
      }
    } else if (remaining <= 10) {
      display.classList.add('timer-warning');
      if (arc) {
        arc.style.stroke = 'var(--warn)';
        arc.classList.add('pulse-slow');
      }
    } else {
      display.classList.add('timer-normal');
      if (arc) {
        arc.style.stroke = 'var(--accent-cyan)';
      }
    }
  }

  function start(secs, expireCb) {
    stop();
    remaining = secs;
    total = secs;
    onExpire = expireCb;
    updateDisplay();
    
    interval = setInterval(() => {
      remaining--;
      updateDisplay();
      if (remaining <= 0) {
        stop();
        if (onExpire) onExpire();
      }
    }, 1000);
  }

  function stop() {
    if (interval) { 
      clearInterval(interval); 
      interval = null; 
    }
  }

  function reset() { 
    stop(); 
    remaining = 0; 
    updateDisplay(); 
  }

  function setTime(secs) {
    stop();
    remaining = secs;
    total = secs;
    updateDisplay();
  }

  return { 
    start, 
    stop, 
    reset, 
    setTime, 
    get remaining() { return remaining; } 
  };
})();
