/**
 * Game Module - Core Quiz Logic, Scoring, and Wildcards Orchestration
 * Brain Challenge — UPT CATEC 2026-I
 */
const Game = (() => {
  const WILDCARDS_TOTAL = 3;

  const initialWildcards = () => ({
    cambioCat:   { max: 1, used: 0, label: 'Cambio Categoría',  icon: 'refresh-cw', tiempo: null },
    consultaIng: { max: 2, used: 0, label: 'Consulta Ingeniero',icon: 'user-check', tiempo: 25 },
    consultaPub: { max: 2, used: 0, label: 'Consulta Público',  icon: 'users',      tiempo: 25 },
    celular:     { max: 1, used: 0, label: 'Uso del Celular',   icon: 'smartphone', tiempo: 15 },
    reduccion:   { max: 3, used: 0, label: 'Reducción Opciones',icon: 'scissors',   tiempo: null },
    duelo:       { max: 1, used: 0, label: 'Duelo Directo',     icon: 'swords',     tiempo: null },
  });

  let state = {
    equipoA: { nombre: '', integrantes: [], puntaje: 0 },
    equipoB: { nombre: '', integrantes: [], puntaje: 0 },
    rondaActual: 1,
    preguntaActual: 0,
    turno: 'A', // 'A' or 'B'
    gamePhase: 'reading', // 'reading' | 'buzzer' | 'answering'
    categoriaActual: null,
    preguntas: [],
    preguntaObj: null,
    wcTeamSelected: 'A',
    comodinesA: initialWildcards(),
    comodinesB: initialWildcards(),
    wcUsedA: 0,
    wcUsedB: 0,
    rondaGanador: null,
    pendingCatChoice: null,
    duelState: { active: false, playerA: '', playerB: '' },
    dm: { active: false, playerA: '', playerB: '', buzzerPressed: null, preguntas: [], idx: 0 },
    categoriasJugadas: [],
    questionAnswered: false,
    countdownInterval: null,
  };

  // ── SETUP ──
  function setupEnfrentamiento() {
    const nA = document.getElementById('teamA-name').value.trim() || 'Equipo A';
    const nB = document.getElementById('teamB-name').value.trim() || 'Equipo B';
    
    const mA = [1, 2, 3].map(i => document.getElementById(`a-m${i}`)?.value.trim()).filter(Boolean);
    const mB = [1, 2, 3].map(i => document.getElementById(`b-m${i}`)?.value.trim()).filter(Boolean);
    const suplenteA = document.getElementById('a-m4')?.value.trim();
    const suplenteB = document.getElementById('b-m4')?.value.trim();

    state.equipoA = { nombre: nA, integrantes: mA, suplente: suplenteA, puntaje: 0 };
    state.equipoB = { nombre: nB, integrantes: mB, suplente: suplenteB, puntaje: 0 };
    
    state.rondaActual = 1;
    state.preguntaActual = 0;
    state.turno = 'A';
    state.comodinesA = initialWildcards();
    state.comodinesB = initialWildcards();
    state.wcUsedA = 0;
    state.wcUsedB = 0;
    state.wcTeamSelected = 'A';
    state.duelState = { active: false, playerA: '', playerB: '' };

    const catSorteada = DB.randomCat();
    state.categoriaActual = catSorteada.id;
    state.categoriasJugadas = [catSorteada.id];
    state.preguntas = DB.getPreguntas(catSorteada.id);

    _renderBracket(catSorteada);
    UI.openRoulette(catSorteada.id, () => {
      UI.showView('bracket');
    });
  }

  function _renderBracket(cat) {
    UI.setText('b-teamA-name', state.equipoA.nombre);
    UI.setText('b-teamB-name', state.equipoB.nombre);
    
    const mHtmlA = state.equipoA.integrantes.map(m => `<div>${m}</div>`).join('') + 
                   (state.equipoA.suplente ? `<div class="sub-label">Suplente: ${state.equipoA.suplente}</div>` : '');
    const mHtmlB = state.equipoB.integrantes.map(m => `<div>${m}</div>`).join('') + 
                   (state.equipoB.suplente ? `<div class="sub-label">Suplente: ${state.equipoB.suplente}</div>` : '');

    UI.setHTML('b-teamA-members', mHtmlA);
    UI.setHTML('b-teamB-members', mHtmlB);
    UI.setHTML('bracket-category', `<i data-lucide="${cat.icon}" class="inline-icon"></i> ${cat.name}`);
    UI.setText('bracket-round-label', 'Ronda 1 — Categoría Inicial Sorteada');
  }

  function irAPartida() {
    UI.showView('game');
    _renderScoreBar();
    _nextQuestion();
    renderWildcards();
  }

  // ── SCORE & TURN ──
  function _renderScoreBar() {
    UI.setText('g-nameA', state.equipoA.nombre);
    UI.setText('g-nameB', state.equipoB.nombre);
    UI.setText('g-scoreA', state.equipoA.puntaje);
    UI.setText('g-scoreB', state.equipoB.puntaje);
    UI.setText('g-round', state.rondaActual);
    UI.setText('g-qcount', `P ${state.preguntaActual + 1}/11`);
    _updateTurnIndicator();
  }

  function _updateTurnIndicator() {
    const ti = document.getElementById('g-turn');
    const txt = document.getElementById('g-turn-text');
    if (!ti || !txt) return;

    if (state.gamePhase === 'reading') {
      ti.className = 'turn-indicator turn-reading';
      txt.textContent = '// LEYENDO PREGUNTA';
    } else if (state.gamePhase === 'countdown') {
      ti.className = 'turn-indicator turn-countdown';
      txt.textContent = '// PREPÁRENSE...';
    } else if (state.gamePhase === 'buzzer') {
      ti.className = 'turn-indicator turn-buzzer';
      txt.textContent = '// ¡PULSAR AHORA!';
    } else {
      ti.className = 'turn-indicator ' + (state.turno === 'A' ? 'turn-a' : 'turn-b');
      
      let turnName = state.turno === 'A' ? state.equipoA.nombre : state.equipoB.nombre;
      if (state.duelState.active) {
        const activeDuelist = state.turno === 'A' ? state.duelState.playerA : state.duelState.playerB;
        turnName = `${turnName} (Duelo: ${activeDuelist})`;
      }
      
      txt.textContent = turnName;
    }
    
    UI.renderIcons();
  }

  // ── QUESTIONS ──
  function _nextQuestion() {
    if (state.preguntaActual >= 11) {
      finalizarRonda();
      return;
    }
    
    state.questionAnswered = false;
    state.gamePhase = 'reading';
    
    const nextBtnContainer = document.getElementById('next-question-container');
    if (nextBtnContainer) nextBtnContainer.classList.add('hidden');

    // Hide buzzer awaiting overlay
    const overlay = document.getElementById('buzzer-awaiting-overlay');
    if (overlay) overlay.classList.add('hidden');

    // Hide countdown overlay
    const cdOverlay = document.getElementById('countdown-overlay');
    if (cdOverlay) cdOverlay.classList.add('hidden');

    if (state.countdownInterval) {
      clearInterval(state.countdownInterval);
      state.countdownInterval = null;
    }
    
    const p = state.preguntas[state.preguntaActual % state.preguntas.length];
    state.preguntaObj = p;

    const cat = DB.getCatById(state.categoriaActual);
    UI.setText('g-category', cat ? cat.name : '—');
    
    const catIconEl = document.getElementById('g-catIcon');
    if (catIconEl && cat) {
      catIconEl.innerHTML = `<i data-lucide="${cat.icon}"></i>`;
    }

    UI.setText('g-question', p.q);
    UI.setText('g-qcount', `P ${state.preguntaActual + 1}/11`);

    // Render options as blurred & disabled
    const letters = ['A', 'B', 'C', 'D'];
    const opts = p.opts.map((o, i) => `
      <button class="option-btn blurred" id="opt-${i}" disabled onclick="Game.selectOption(${i})">
        <span class="opt-letter">${letters[i]}</span>
        <span class="opt-text">${o}</span>
      </button>`).join('');
    UI.setHTML('g-options', opts);

    const progress = ((state.preguntaActual + 1) / 11 * 100).toFixed(0);
    const pb = document.getElementById('round-progress');
    if (pb) pb.style.width = progress + '%';

    _updateTurnIndicator();
    
    // Start 5s reading phase
    Timer.start(5, () => iniciarFaseCountdownPreBuzzer());
    UI.renderIcons();
  }

  function iniciarFaseCountdownPreBuzzer() {
    if (state.questionAnswered) return;
    state.gamePhase = 'countdown';
    _updateTurnIndicator();

    const cdOverlay = document.getElementById('countdown-overlay');
    const cdNumber = document.getElementById('countdown-number');
    if (cdOverlay) cdOverlay.classList.remove('hidden');

    let count = 3;
    if (cdNumber) cdNumber.textContent = count;
    Timer.setTime(count);

    if (state.countdownInterval) {
      clearInterval(state.countdownInterval);
    }

    state.countdownInterval = setInterval(() => {
      count--;
      if (count > 0) {
        if (cdNumber) cdNumber.textContent = count;
        Timer.setTime(count);
      } else if (count === 0) {
        if (cdNumber) cdNumber.textContent = '¡YA!';
        Timer.setTime(0);
      } else {
        clearInterval(state.countdownInterval);
        state.countdownInterval = null;
        if (cdOverlay) cdOverlay.classList.add('hidden');
        iniciarFaseBuzzer();
      }
    }, 1000);
  }

  function iniciarFaseBuzzer() {
    if (state.questionAnswered) return;
    state.gamePhase = 'buzzer';
    
    if (state.countdownInterval) {
      clearInterval(state.countdownInterval);
      state.countdownInterval = null;
    }

    // Hide countdown overlay just in case
    const cdOverlay = document.getElementById('countdown-overlay');
    if (cdOverlay) cdOverlay.classList.add('hidden');
    
    // Show buzzer awaiting overlay
    const overlay = document.getElementById('buzzer-awaiting-overlay');
    if (overlay) {
      overlay.classList.remove('hidden');
      
      // Populate team A details in VS overlay
      UI.setText('buzzer-val-name-a', state.equipoA.nombre);
      const mHtmlA = state.equipoA.integrantes.map(m => `<div>${m}</div>`).join('') + 
                     (state.equipoA.suplente ? `<div class="sub-label" style="font-size:0.75rem;opacity:0.6;margin-top:4px;">Suplente: ${state.equipoA.suplente}</div>` : '');
      UI.setHTML('buzzer-members-a', mHtmlA);
      
      // Populate team B details in VS overlay
      UI.setText('buzzer-val-name-b', state.equipoB.nombre);
      const mHtmlB = state.equipoB.integrantes.map(m => `<div>${m}</div>`).join('') + 
                     (state.equipoB.suplente ? `<div class="sub-label" style="font-size:0.75rem;opacity:0.6;margin-top:4px;">Suplente: ${state.equipoB.suplente}</div>` : '');
      UI.setHTML('buzzer-members-b', mHtmlB);
    }
    
    _updateTurnIndicator();
    
    // Start 30s countdown for buzzer phase
    Timer.start(30, () => tiempoAgotado());
    UI.renderIcons();
  }

  function reclamarTurno(team) {
    if (state.gamePhase !== 'buzzer' || state.questionAnswered) return;
    
    Timer.stop();
    
    state.turno = team;
    state.gamePhase = 'answering';
    
    // Hide buzzer awaiting overlay
    const overlay = document.getElementById('buzzer-awaiting-overlay');
    if (overlay) overlay.classList.add('hidden');
    
    // Unblur and enable options
    const btns = document.querySelectorAll('.option-btn');
    btns.forEach(btn => {
      btn.classList.remove('blurred');
      if (!btn.classList.contains('eliminated')) {
        btn.disabled = false;
      }
    });
    
    // Update active tab for wildcards
    setWcTeam(team);
    
    _updateTurnIndicator();
    
    const teamName = team === 'A' ? state.equipoA.nombre : state.equipoB.nombre;
    UI.toast(`¡Buzzer! Turno para ${teamName}`, 'info');
    
    // Start answering countdown (30s)
    Timer.start(30, () => tiempoAgotado());
  }

  function selectOption(idx) {
    if (state.questionAnswered) return;
    if (state.gamePhase !== 'answering') return;
    state.questionAnswered = true;

    Timer.stop();
    const btns = document.querySelectorAll('.option-btn');
    btns.forEach(b => b.disabled = true);
    
    const isCorrect = idx === state.preguntaObj.ans;
    const activeBtn = document.getElementById(`opt-${idx}`);
    const correctBtn = document.getElementById(`opt-${state.preguntaObj.ans}`);

    if (isCorrect) {
      if (activeBtn) activeBtn.classList.add('correct');
    } else {
      if (activeBtn) activeBtn.classList.add('wrong');
      if (correctBtn) correctBtn.classList.add('correct');
    }

    const equipo = state.turno === 'A' ? state.equipoA : state.equipoB;
    const delta = isCorrect ? 100 : -25;
    
    equipo.puntaje = Math.max(0, equipo.puntaje + delta);
    UI.setText(state.turno === 'A' ? 'g-scoreA' : 'g-scoreB', equipo.puntaje);
    UI.bumpScore(state.turno);
    
    if (isCorrect) {
      UI.toast(`¡Correcto! +100 puntos para ${equipo.nombre}`, 'success');
    } else {
      UI.toast(`¡Incorrecto! -25 puntos para ${equipo.nombre}`, 'error');
    }

    const nextBtnContainer = document.getElementById('next-question-container');
    if (nextBtnContainer) {
      nextBtnContainer.classList.remove('hidden');
      UI.renderIcons();
    }
  }

  // ── REGISTER ANSWER ──
  function registrarRespuesta(esCorrecta) {
    if (state.questionAnswered) return;
    if (state.gamePhase !== 'answering') {
      UI.toast('Debe reclamar el turno antes de calificar la respuesta', 'error');
      return;
    }
    state.questionAnswered = true;

    Timer.stop();
    const equipo = state.turno === 'A' ? state.equipoA : state.equipoB;
    const delta = esCorrecta ? 100 : -25;
    
    equipo.puntaje = Math.max(0, equipo.puntaje + delta);
    UI.setText(state.turno === 'A' ? 'g-scoreA' : 'g-scoreB', equipo.puntaje);
    UI.bumpScore(state.turno);
    
    if (esCorrecta) {
      UI.toast(`+100 puntos para ${equipo.nombre}`, 'success');
    } else {
      UI.toast(`-25 puntos para ${equipo.nombre}`, 'error');
    }
    _avanzar();
  }

  function tiempoAgotado() {
    if (state.questionAnswered) return;
    state.questionAnswered = true;

    Timer.stop();
    UI.toast('Tiempo agotado — Sin cambios de puntaje', 'info');

    // Hide buzzer overlay if active
    const overlay = document.getElementById('buzzer-awaiting-overlay');
    if (overlay) overlay.classList.add('hidden');

    const btns = document.querySelectorAll('.option-btn');
    btns.forEach(b => {
      b.disabled = true;
      b.classList.remove('blurred');
    });

    const correctBtn = document.getElementById(`opt-${state.preguntaObj.ans}`);
    if (correctBtn) correctBtn.classList.add('correct');

    const nextBtnContainer = document.getElementById('next-question-container');
    if (nextBtnContainer) {
      nextBtnContainer.classList.remove('hidden');
      UI.renderIcons();
    }
  }

  function saltarPregunta() {
    if (state.questionAnswered) return;
    state.questionAnswered = true;

    Timer.stop();
    const overlay = document.getElementById('buzzer-awaiting-overlay');
    if (overlay) overlay.classList.add('hidden');
    UI.toast('Pregunta omitida', 'info');
    _avanzar();
  }

  function _avanzar() {
    state.preguntaActual++;
    state.turno = state.turno === 'A' ? 'B' : 'A';
    
    // Check if the duel ends at the end of the round or single question
    // According to bases: "El equipo que activa este comodín declara un duelo 1 vs 1 para la Ronda en curso."
    // So duel remains active throughout this entire category round. We reset it at round completion.

    if (state.preguntaActual >= 11) {
      setTimeout(finalizarRonda, 800);
    } else {
      setTimeout(_nextQuestion, 800);
    }
  }

  // ── ROUNDS ──
  function finalizarRonda() {
    Timer.stop();
    const sA = state.equipoA.puntaje;
    const sB = state.equipoB.puntaje;
    let ganador = null;
    let desc = '';

    if (sA > sB) {
      ganador = 'A';
      desc = `${state.equipoA.nombre} lidera el marcador con ${sA} pts frente a ${sB} pts del rival.`;
    } else if (sB > sA) {
      ganador = 'B';
      desc = `${state.equipoB.nombre} lidera el marcador con ${sB} pts frente a ${sA} pts del rival.`;
    } else {
      desc = `Empate parcial. Ambos equipos cuentan con ${sA} pts.`;
    }

    state.rondaGanador = ganador;
    state.duelState.active = false; // Reset duel at the end of the round

    UI.setText('round-modal-title', `Fin de Ronda ${state.rondaActual}`);
    UI.setText('round-modal-desc', desc);
    UI.showModal('modal-round');
  }

  function continuarTrasRonda() {
    UI.closeModal('modal-round');
    if (state.rondaActual >= 3) {
      finalizarEnfrentamiento();
      return;
    }
    
    state.rondaActual++;
    state.preguntaActual = 0;
    state.turno = 'A';

    // Select a random unplayed category
    const disponibles = DB.categorias.filter(c => !state.categoriasJugadas.includes(c.id));
    let catSorteada;
    if (disponibles.length > 0) {
      catSorteada = disponibles[Math.floor(Math.random() * disponibles.length)];
    } else {
      catSorteada = DB.randomCat();
    }

    state.categoriasJugadas.push(catSorteada.id);
    state.categoriaActual = catSorteada.id;
    state.preguntas = DB.getPreguntas(catSorteada.id);

    // Directly open the roulette wheel modal
    UI.openRoulette(catSorteada.id, () => {
      UI.setText('g-round', state.rondaActual);
      _renderScoreBar();
      _nextQuestion();
    });
  }

  function selectCat(id, el) {
    state.pendingCatChoice = id;
    document.querySelectorAll('.cat-option').forEach(b => b.classList.remove('selected'));
    if (el) el.classList.add('selected');
  }

  function confirmarCategoria() {
    if (!state.pendingCatChoice) {
      UI.toast('Debes elegir una categoría para continuar', 'error');
      return;
    }
    state.categoriaActual = state.pendingCatChoice;
    state.preguntas = DB.getPreguntas(state.categoriaActual);
    UI.closeModal('modal-category');
    
    UI.openRoulette(state.categoriaActual, () => {
      UI.setText('g-round', state.rondaActual);
      _nextQuestion();
    });
  }

  // ── TIE BREAKER / FINISH ──
  function finalizarEnfrentamiento() {
    const sA = state.equipoA.puntaje;
    const sB = state.equipoB.puntaje;
    
    if (sA === sB) {
      iniciarDeathMatch();
    } else {
      const winner = sA > sB ? state.equipoA : state.equipoB;
      _mostrarResultado(winner.nombre, sA, sB);
    }
  }

  function _mostrarResultado(winnerName, sA, sB) {
    UI.setText('r-winner', winnerName);
    UI.setHTML('r-scores', `
      <div class="final-score-item header-glow-a">
        <div class="score-n score-value-a">${sA}</div>
        <div class="score-t">${state.equipoA.nombre}</div>
      </div>
      <div class="final-score-item header-glow-b">
        <div class="score-n score-value-b">${sB}</div>
        <div class="score-t">${state.equipoB.nombre}</div>
      </div>`);
    UI.showView('result');
    setTimeout(UI.confetti, 350);
  }

  // ── DEATHMATCH (Sudden Death) ──
  function iniciarDeathMatch() {
    state.dm.active = true;
    // Default to first member of each team, or team name if empty
    state.dm.playerA = state.equipoA.integrantes[0] || state.equipoA.nombre;
    state.dm.playerB = state.equipoB.integrantes[0] || state.equipoB.nombre;
    
    const catSorteada = DB.randomCat();
    state.categoriaActual = catSorteada.id;
    state.dm.preguntas = DB.getPreguntas(catSorteada.id);
    state.dm.idx = 0;
    state.dm.buzzerPressed = null;

    UI.setText('dm-player-a', state.dm.playerA);
    UI.setText('dm-player-b', state.dm.playerB);
    UI.setText('dm-team-a', state.equipoA.nombre);
    UI.setText('dm-team-b', state.equipoB.nombre);
    
    UI.openRoulette(catSorteada.id, () => {
      UI.showView('deathmatch');
      _loadDmQuestion();
    });
  }

  function _loadDmQuestion() {
    const p = state.dm.preguntas[state.dm.idx % state.dm.preguntas.length];
    state.preguntaObj = p;
    
    UI.setText('dm-question', p.q);
    UI.setText('dm-status', `Muerte Súbita — Pregunta de desempate ${state.dm.idx + 1}`);
    UI.setText('dm-timer', '—');
    
    const docA = document.getElementById('buzzer-a');
    const docB = document.getElementById('buzzer-b');
    if (docA) docA.disabled = false;
    if (docB) docB.disabled = false;
    
    document.getElementById('dm-mod-controls')?.classList.add('hidden');
    state.dm.buzzerPressed = null;
  }

  function dmBuzzer(team) {
    if (state.dm.buzzerPressed || !state.dm.active) return;
    state.dm.buzzerPressed = team;
    
    const docA = document.getElementById('buzzer-a');
    const docB = document.getElementById('buzzer-b');
    if (docA) docA.disabled = true;
    if (docB) docB.disabled = true;

    const activeTeamName = team === 'A' ? state.equipoA.nombre : state.equipoB.nombre;
    const activePlayerName = team === 'A' ? state.dm.playerA : state.dm.playerB;

    UI.setText('dm-status', `${activePlayerName} (${activeTeamName}) presionó el pulsador primero`);
    UI.setText('dm-timer', '30');
    
    // Auto-open moderator panel for grading
    const panel = document.querySelector('.moderator-panel');
    const btn = document.querySelector('.admin-toggle-btn');
    if (panel && btn && !panel.classList.contains('active')) {
      panel.classList.add('active');
      btn.classList.add('active');
    }
    
    let t = 30;
    Timer.setTime(t);
    Timer.start(t, () => {
      UI.setText('dm-status', 'Tiempo agotado para responder');
    });
  }

  function dmRespuesta(correcta) {
    const team = state.dm.buzzerPressed;
    if (!team) return;
    
    Timer.stop();
    
    // Auto-collapse moderator panel
    const panel = document.querySelector('.moderator-panel');
    const btn = document.querySelector('.admin-toggle-btn');
    if (panel && btn && panel.classList.contains('active')) {
      panel.classList.remove('active');
      btn.classList.remove('active');
    }
    
    if (correcta) {
      const winner = team === 'A' ? state.equipoA : state.equipoB;
      winner.puntaje += 100;
      _mostrarResultado(winner.nombre, state.equipoA.puntaje, state.equipoB.puntaje);
    } else {
      const activePlayerName = team === 'A' ? state.dm.playerA : state.dm.playerB;
      UI.toast(`Respuesta incorrecta de ${activePlayerName}`, 'error');
      UI.setText('dm-status', `Respuesta incorrecta. Cargando siguiente desempate...`);
      setTimeout(dmSiguiente, 1500);
    }
  }

  function dmSiguiente() {
    state.dm.idx++;
    _loadDmQuestion();
  }

  // ── WILDCARDS (COMODINES) ──
  function setWcTeam(team) {
    state.wcTeamSelected = team;
    renderWildcards();
  }

  function renderWildcards() {
    const team = state.wcTeamSelected;
    const wcs = team === 'A' ? state.comodinesA : state.comodinesB;
    const used = team === 'A' ? state.wcUsedA : state.wcUsedB;
    const remaining = WILDCARDS_TOTAL - used;

    const labelText = `${remaining} de ${WILDCARDS_TOTAL} Comodines Disponibles — ${team === 'A' ? state.equipoA.nombre : state.equipoB.nombre}`;
    UI.setText('wc-total-label', labelText);

    const grid = document.getElementById('wc-grid');
    if (!grid) return;
    
    grid.innerHTML = Object.entries(wcs).map(([key, wc]) => {
      const avail = wc.used < wc.max && remaining > 0;
      return `
        <button class="wc-btn" ${!avail ? 'disabled' : ''} onclick="Game.activarComodín('${team}', '${key}')">
          <i data-lucide="${wc.icon}" class="wc-icon"></i>
          <span class="wc-label">${wc.label}</span>
          <span class="wc-uses">${wc.max - wc.used} de ${wc.max} disp.</span>
        </button>`;
    }).join('');

    const tabA = document.getElementById('wc-tab-a');
    const tabB = document.getElementById('wc-tab-b');
    
    if (tabA) tabA.classList.toggle('active', team === 'A');
    if (tabB) tabB.classList.toggle('active', team === 'B');
    
    UI.renderIcons();
  }

  function activarComodín(team, key) {
    if (state.gamePhase !== 'answering') {
      UI.toast('Debe reclamar el turno antes de usar un comodín', 'error');
      return;
    }
    if (state.turno !== team) {
      UI.toast('Solo el equipo con el turno puede usar un comodín', 'error');
      return;
    }

    const wcs = team === 'A' ? state.comodinesA : state.comodinesB;
    const used = team === 'A' ? state.wcUsedA : state.wcUsedB;
    const wc = wcs[key];
    
    if (!wc) return;
    if (wc.used >= wc.max) {
      UI.toast('Este comodín ya no tiene usos disponibles', 'error');
      return;
    }
    if (used >= WILDCARDS_TOTAL) {
      UI.toast('Límite de 3 comodines por enfrentamiento alcanzado', 'error');
      return;
    }

    wc.used++;
    if (team === 'A') state.wcUsedA++; else state.wcUsedB++;

    let desc = '';
    const icon = wc.icon;

    switch (key) {
      case 'cambioCat':
        Timer.stop();
        let newCat;
        do {
          newCat = DB.randomCat();
        } while (newCat.id === state.categoriaActual && DB.categorias.length > 1);
        
        state.categoriaActual = newCat.id;
        state.preguntas = DB.getPreguntas(newCat.id);
        
        UI.openRoulette(newCat.id, () => {
          _nextQuestion();
        });
        renderWildcards();
        return;

      case 'reduccion':
        _reducirOpciones();
        desc = 'Se han descartado la mitad de las opciones incorrectas (50/50).';
        break;

      case 'duelo':
        _abrirDueloModal(team);
        renderWildcards();
        return;

      case 'celular':
      case 'consultaIng':
      case 'consultaPub':
        Timer.stop();
        Timer.setTime(wc.tiempo);
        Timer.start(wc.tiempo, () => tiempoAgotado());
        desc = `Modificador de tiempo activado. Cuentan con ${wc.tiempo} segundos en total.`;
        break;
    }

    UI.setHTML('wc-modal-icon', `<i data-lucide="${icon}"></i>`);
    UI.setText('wc-modal-title', `${wc.label}`);
    UI.setText('wc-modal-desc', desc || 'Comodín aplicado correctamente.');
    UI.showModal('modal-wildcard');
    renderWildcards();
  }

  function _reducirOpciones() {
    const ans = state.preguntaObj?.ans;
    if (ans === undefined) return;
    
    // Collect all incorrect options indexes
    const indices = [0, 1, 2, 3].filter(i => i !== ans);
    
    // Shuffle the incorrect option indexes
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    
    // Eliminate exactly 2 incorrect options
    indices.slice(0, 2).forEach(i => {
      const btn = document.getElementById(`opt-${i}`);
      if (btn) {
        btn.classList.add('eliminated');
        btn.disabled = true;
      }
    });
  }

  function _abrirDueloModal(activatingTeam) {
    // Open a visual dialog for the duel setup
    const teamA = state.equipoA;
    const teamB = state.equipoB;
    
    let htmlA = teamA.integrantes.map(m => `
      <button class="duel-selector-btn" onclick="Game.setDuelParticipant('A', '${m}', this)">
        <span>${m}</span>
      </button>`).join('');
    let htmlB = teamB.integrantes.map(m => `
      <button class="duel-selector-btn" onclick="Game.setDuelParticipant('B', '${m}', this)">
        <span>${m}</span>
      </button>`).join('');

    UI.setHTML('duel-teamA-list', htmlA);
    UI.setHTML('duel-teamB-list', htmlB);
    
    state.duelState.playerA = teamA.integrantes[0] || '';
    state.duelState.playerB = teamB.integrantes[0] || '';

    // Mark the defaults visually as selected
    setTimeout(() => {
      const btnsA = document.querySelectorAll('#duel-teamA-list .duel-selector-btn');
      const btnsB = document.querySelectorAll('#duel-teamB-list .duel-selector-btn');
      if (btnsA[0]) btnsA[0].classList.add('selected');
      if (btnsB[0]) btnsB[0].classList.add('selected');
    }, 100);

    UI.showModal('modal-duel');
  }

  function setDuelParticipant(team, name, el) {
    if (team === 'A') {
      state.duelState.playerA = name;
      document.querySelectorAll('#duel-teamA-list .duel-selector-btn').forEach(b => b.classList.remove('selected'));
    } else {
      state.duelState.playerB = name;
      document.querySelectorAll('#duel-teamB-list .duel-selector-btn').forEach(b => b.classList.remove('selected'));
    }
    if (el) el.classList.add('selected');
  }

  function confirmarDuelo() {
    state.duelState.active = true;
    UI.closeModal('modal-duel');
    
    const desc = `El Duelo Directo ha sido pactado: 
      <strong>${state.duelState.playerA}</strong> (${state.equipoA.nombre}) vs 
      <strong>${state.duelState.playerB}</strong> (${state.equipoB.nombre}). 
      Ellos competirán durante esta ronda.`;
      
    UI.setHTML('wc-modal-icon', `<i data-lucide="swords"></i>`);
    UI.setText('wc-modal-title', 'Duelo Directo Activado');
    UI.setHTML('wc-modal-desc', desc);
    UI.showModal('modal-wildcard');
    
    _updateTurnIndicator();
  }

  function reiniciar() {
    Timer.reset();
    state.dm.active = false;
    UI.showView('setup');
  }

  function irSetup() {
    Timer.stop();
    state.dm.active = false;
    UI.showView('setup');
  }

  // ── KEYBOARD SHORTCUTS FOR BUZZER ──
  function handleBuzzerKeyPress(e) {
    // Ignore keystrokes inside input fields
    if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
      return;
    }

    const key = e.key.toLowerCase();

    // 1. If DeathMatch is active
    if (state.dm.active) {
      if (state.dm.buzzerPressed) return;
      if (key === 'q') {
        dmBuzzer('A');
      } else if (key === 'p') {
        dmBuzzer('B');
      }
      return;
    }

    // 2. If normal game is active and in buzzer phase
    if (state.gamePhase === 'buzzer' && !state.questionAnswered) {
      if (key === 'q') {
        reclamarTurno('A');
      } else if (key === 'p') {
        reclamarTurno('B');
      }
    }
  }

  // Bind the buzzer keys listener globally
  window.addEventListener('keydown', handleBuzzerKeyPress);

  function avanzarManual() {
    const nextBtnContainer = document.getElementById('next-question-container');
    if (nextBtnContainer) nextBtnContainer.classList.add('hidden');
    _avanzar();
  }

  return {
    setupEnfrentamiento,
    irAPartida,
    registrarRespuesta,
    tiempoAgotado,
    saltarPregunta,
    finalizarRonda,
    continuarTrasRonda,
    finalizarEnfrentamiento,
    iniciarDeathMatch,
    reclamarTurno,
    selectOption,
    selectCat,
    confirmarCategoria,
    activarComodín,
    setWcTeam,
    renderWildcards,
    dmBuzzer,
    dmRespuesta,
    dmSiguiente,
    setDuelParticipant,
    confirmarDuelo,
    reiniciar,
    irSetup,
    avanzarManual,
    get state() { return state; }
  };
})();
