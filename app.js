import {technicalTheoryQuestions} from "./data/course-bank.mjs";
const questions = technicalTheoryQuestions.slice(0,50);


const HISTORY_KEY = 'oposprint-history-v1';
const LETTERS = ['A', 'B', 'C', 'D'];
const dashboard = document.querySelector('#dashboard');
const quizScreen = document.querySelector('#quiz');
const resultsScreen = document.querySelector('#results');
let attemptQuestions = [];
let answers = [];
let currentIndex = 0;
let lastResult = null;
let wrongOnly = false;
let toastTimer;

function readHistory() {
  try {
    const saved = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    return Array.isArray(saved) ? saved.filter(item =>
      item && Number.isFinite(item.score) && Number.isFinite(item.correct) &&
      item.score >= 0 && item.score <= 10 && Number.isInteger(item.correct) &&
      item.correct >= 0 && item.correct <= questions.length &&
      Array.isArray(item.missedTopics) && item.missedTopics.every(topic => typeof topic === 'string')
    ) : [];
  } catch (error) {
    console.error('No se pudo leer el historial guardado:', error);
    showToast('No se pudo leer el historial local. El simulacro sigue disponible.');
    return [];
  }
}

function saveHistory(history) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    return true;
  } catch (error) {
    console.error('No se pudo guardar el historial:', error);
    showToast('No se pudo guardar el progreso. Comprueba el almacenamiento del navegador.');
    return false;
  }
}

function showToast(message) {
  const toast = document.querySelector('#toast');
  toast.textContent = message;
  toast.classList.add('visible');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('visible'), 3800);
}

function showScreen(screen) {
  [dashboard, quizScreen, resultsScreen].forEach(item => item.classList.add('hidden'));
  screen.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderDashboard() {
  const history = readHistory();
  document.querySelector('#attemptCount').textContent = String(history.length);
  if (!history.length) {
    document.querySelector('#bestScore').textContent = '—';
    document.querySelector('#bestScoreFoot').textContent = 'Tu marca personal empieza aquí';
    document.querySelector('#averageRate').textContent = '—';
    document.querySelector('#focusTitle').textContent = 'Refuerza lo que más puntúa';
    document.querySelector('#focusText').textContent = 'Redes, DNS, subnetting y seguridad aparecerán con mimo. Después del simulacro, el plan pondrá primero los temas que más te cuesten.';
    document.querySelector('#focusTags').innerHTML = '<span>ICMP · ping</span><span>DNS · CNAME</span><span>ACID</span><span>FIFO / LIFO</span>';
    return;
  }
  const best = Math.max(...history.map(item => item.score));
  const average = history.reduce((sum, item) => sum + item.correct, 0) / (history.length * questions.length) * 100;
  document.querySelector('#bestScore').textContent = formatScore(best);
  document.querySelector('#bestScoreFoot').textContent = `Tu mejor resultado en ${history.length} ${history.length === 1 ? 'intento' : 'intentos'}`;
  document.querySelector('#averageRate').textContent = String(Math.round(average));

  const misses = new Map();
  history.forEach(item => item.missedTopics.forEach(topic => misses.set(topic, (misses.get(topic) || 0) + 1)));
  const ranked = [...misses.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'es'));
  if (ranked.length) {
    document.querySelector('#focusTitle').textContent = 'Tu plan ya está aprendiendo de ti';
    document.querySelector('#focusText').textContent = 'Estos temas han concentrado más errores en tus simulacros. Volverán a aparecer primero para convertirlos en puntos seguros.';
    document.querySelector('#focusTags').innerHTML = ranked.slice(0, 4).map(([topic, count]) => `<span>${escapeHtml(topic)} · ${count} ${count === 1 ? 'fallo' : 'fallos'}</span>`).join('');
  } else {
    document.querySelector('#focusTitle').textContent = '¡Sin fallos hasta ahora!';
    document.querySelector('#focusText').textContent = 'Sigue entrenando con preguntas nuevas y dificultad progresiva para que los conceptos se mantengan frescos.';
    document.querySelector('#focusTags').innerHTML = '<span>Objetivo: 80 %</span><span>Constancia</span><span>Nivel C1</span>';
  }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
}

function startExam() {
  const history = readHistory();
  const misses = new Map();
  history.forEach(item => item.missedTopics.forEach(topic => misses.set(topic, (misses.get(topic) || 0) + 1)));
  attemptQuestions = questions.map((question, index) => {
    const options = question.options.map((text, originalIndex) => ({ text, originalIndex }));
    // Mantener A/B/C/D del cuestionario oficial.
    return { ...question, sourceIndex: index, options: options.map(option => option.text), answer: options.findIndex(option => option.originalIndex === question.answer) };
  });
  for (let i = attemptQuestions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [attemptQuestions[i], attemptQuestions[j]] = [attemptQuestions[j], attemptQuestions[i]];
  }
  attemptQuestions.sort((a, b) => (misses.get(b.topic) || 0) - (misses.get(a.topic) || 0));
  answers = Array(attemptQuestions.length).fill(null);
  currentIndex = 0;
  renderGrid();
  renderQuestion();
  showScreen(quizScreen);
}

function renderGrid() {
  const grid = document.querySelector('#questionGrid');
  grid.innerHTML = attemptQuestions.map((_, index) =>
    `<button type="button" class="grid-question" data-index="${index}" aria-label="Ir a la pregunta ${index + 1}">${index + 1}</button>`
  ).join('');
  updateGrid();
}

function updateGrid() {
  document.querySelectorAll('.grid-question').forEach((button, index) => {
    button.classList.toggle('answered', answers[index] !== null);
    button.classList.toggle('current', index === currentIndex);
    button.setAttribute('aria-current', index === currentIndex ? 'step' : 'false');
  });
}

function renderQuestion() {
  const question = attemptQuestions[currentIndex];
  const number = String(currentIndex + 1).padStart(2, '0');
  document.querySelector('#questionCounter').innerHTML = `${number} <span>/ ${attemptQuestions.length}</span>`;
  document.querySelector('#questionNumber').textContent = `${question.track === "zaragoza-c1" ? "ZARAGOZA 2026" : question.track === "aragon-c1" ? "ARAGÓN 2026" : "TAI 2024"} · PREGUNTA OFICIAL ${question.number}`;
  document.querySelector('#categoryLabel').textContent = question.category.toUpperCase();
  const difficulty = document.querySelector('#difficultyLabel');
  difficulty.textContent = `● ${question.difficulty.toUpperCase()}`;
  difficulty.className = `difficulty-label ${question.difficulty === 'Fácil' ? 'easy' : question.difficulty === 'Difícil' ? 'hard' : ''}`;
  document.querySelector('#questionText').textContent = question.prompt;
  document.querySelector('#optionsList').innerHTML = question.options.map((option, index) => `
    <label class="option-label ${answers[currentIndex] === index ? 'selected' : ''}">
      <input type="radio" name="answer" value="${index}" ${answers[currentIndex] === index ? 'checked' : ''}>
      <span class="option-letter">${LETTERS[index]}</span><span class="option-text">${escapeHtml(option.trim())}</span>
    </label>`).join('');
  document.querySelector('#optionsList').querySelectorAll('input').forEach(input => {
    input.addEventListener('change', () => {
      answers[currentIndex] = Number(input.value);
      renderQuestion();
    });
  });
  /** @type {HTMLButtonElement} */ (document.querySelector('#previousQuestion')).disabled = currentIndex === 0;
  document.querySelector('#nextQuestion').innerHTML = currentIndex === attemptQuestions.length - 1 ? 'Última pregunta <span>✓</span>' : 'Siguiente <span>→</span>';
  document.querySelector('#answeredCaption').textContent = `${answers.filter(answer => answer !== null).length} de ${attemptQuestions.length} respondidas`;
  document.querySelector('#railProgress').textContent = `${answers.filter(answer => answer !== null).length}/${attemptQuestions.length}`;
  /** @type {HTMLElement} */ (document.querySelector('#quizProgressFill')).style.width = `${answers.filter(answer => answer !== null).length / attemptQuestions.length * 100}%`;
  const unanswered = answers.filter(answer => answer === null).length;
  /** @type {HTMLButtonElement} */ (document.querySelector('#finishExam')).disabled = unanswered > 0;
  document.querySelector('#finishHint').textContent = unanswered ? `Quedan ${unanswered} ${unanswered === 1 ? 'pregunta' : 'preguntas'} sin responder.` : '¡Todo listo! Al finalizar verás las soluciones y explicaciones.';
  updateGrid();
}

function finishExam() {
  if (answers.some(answer => answer === null)) return;
  const correct = attemptQuestions.reduce((count, question, index) => count + (answers[index] === question.answer ? 1 : 0), 0);
  const wrong = attemptQuestions.length - correct;
  const deductions = attemptQuestions.reduce((total,q,i)=>total+(answers[i]!==q.answer?(q.scoringPenalty??0.33):0),0);
  const score = Math.max(0, (correct - deductions) / attemptQuestions.length * 10);
  const missedTopics = [...new Set(attemptQuestions.filter((question, index) => answers[index] !== question.answer).map(question => question.topic))];
  lastResult = { correct, wrong, score, percent: correct / attemptQuestions.length * 100, missedTopics };
  const history = readHistory();
  history.push({ score, correct, missedTopics, date: new Date().toISOString() });
  saveHistory(history);
  renderResults();
  renderDashboard();
  showScreen(resultsScreen);
}

function formatScore(score) {
  return score.toFixed(2).replace('.', ',');
}

function renderResults() {
  const { correct, wrong, score, percent } = lastResult;
  document.querySelector('#resultScore').textContent = formatScore(score);
  document.querySelector('#resultCorrect').textContent = correct;
  document.querySelector('#resultWrong').textContent = wrong;
  document.querySelector('#resultPercent').textContent = percent.toFixed(1).replace('.', ',');
  const title = document.querySelector('#resultTitle');
  const subtitle = document.querySelector('#resultSubtitle');
  const medal = document.querySelector('#resultMedal');
  if (percent >= 85) {
    title.textContent = '¡Nivelazo! Estás volando.';
    subtitle.textContent = 'Un resultado excelente: consolida esos puntos fuertes y sigue afinando.';
    medal.textContent = '🏆';
  } else if (percent >= 70) {
    title.textContent = '¡Vas por muy buen camino!';
    subtitle.textContent = 'Ya estás sumando a buen ritmo. Cada repaso te acerca a tu objetivo.';
    medal.textContent = '✦';
  } else {
    title.textContent = '¡Simulacro completado!';
    subtitle.textContent = 'Lo importante es que ya sabes qué repasar. El siguiente intento empieza con ventaja.';
    medal.textContent = '🌱';
  }
  renderTopicAnalysis();
  renderCorrections(false);
}

function renderTopicAnalysis() {
  const { missedTopics } = lastResult;
  const categories = [...new Set(attemptQuestions.map(question => question.category))];
  const stats = categories.map(category => {
    const categoryQuestions = attemptQuestions.filter(question => question.category === category);
    const categoryCorrect = categoryQuestions.filter(question => answers[attemptQuestions.indexOf(question)] === question.answer).length;
    return { category, correct: categoryCorrect, total: categoryQuestions.length, rate: categoryCorrect / categoryQuestions.length };
  }).sort((a, b) => a.rate - b.rate);
  const rows = stats.map(item => `<div class="topic-row">
    <span class="topic-name" title="${escapeHtml(item.category)}">${escapeHtml(item.category)}</span>
    <div class="topic-bar"><div class="topic-fill ${item.rate >= .8 ? 'topic-strong' : item.rate < .5 ? 'topic-weak' : ''}" style="width:${item.rate * 100}%"></div></div>
    <span class="topic-rate">${item.correct}/${item.total}</span>
  </div>`).join('');
  const lowest = stats[0];
  const highest = stats[stats.length - 1];
  const insight = lowest.rate === highest.rate
    ? `Resultados equilibrados en todos los bloques. <b>Sigue así:</b> repasa la corrección completa para fijar los detalles.`
    : `Tu mejor bloque: <b>${escapeHtml(highest.category)}</b> (${highest.correct}/${highest.total}). Para la próxima ronda, pon el foco en <b>${escapeHtml(lowest.category)}</b> (${lowest.correct}/${lowest.total}).`;
  document.querySelector('#topicAnalysis').innerHTML = rows + `<p class="topic-insight">${insight}</p>`;
  if (missedTopics.length) {
    document.querySelector('#nextStepTitle').textContent = `Toca afianzar ${missedTopics.length} ${missedTopics.length === 1 ? 'tema' : 'temas'}`;
    document.querySelector('#nextStepText').textContent = `${missedTopics.slice(0, 4).join(', ')}${missedTopics.length > 4 ? ' y otros' : ''}. Ya quedan priorizados en tu siguiente simulacro. Revisa ahora el porqué de cada respuesta.`;
  } else {
    document.querySelector('#nextStepTitle').textContent = '¡Pleno! Mantén el ritmo';
    document.querySelector('#nextStepText').textContent = 'Has acertado todas. Lee las explicaciones igualmente y vuelve a entrenar para consolidar lo aprendido.';
  }
}

function renderCorrections(filterWrong) {
  wrongOnly = filterWrong;
  document.querySelector('#filterWrong').classList.toggle('active', filterWrong);
  document.querySelector('#filterWrong').setAttribute('aria-pressed', String(filterWrong));
  const list = document.querySelector('#correctionsList');
  const corrections = attemptQuestions.map((question, index) => ({ question, index, isCorrect: answers[index] === question.answer }))
    .filter(item => !filterWrong || !item.isCorrect);
  list.innerHTML = corrections.length ? corrections.map(({ question, index, isCorrect }) => {
    const picked = answers[index];
    const correctOption = question.options[question.answer].trim();
    const chosenOption = (question.options[picked] ?? "En blanco").trim();
    return `<article class="correction-card ${isCorrect ? 'correct-card' : 'wrong-card'}">
      <div class="correction-top"><span class="correction-topic">PREGUNTA ${String(index + 1).padStart(2, '0')} · ${escapeHtml(question.category.toUpperCase())} · ${escapeHtml(question.topic)}</span>
      <span class="correction-verdict ${isCorrect ? 'verdict-correct' : 'verdict-wrong'}">${isCorrect ? '✓ CORRECTA' : '× INCORRECTA'}</span></div>
      <h3>${escapeHtml(question.prompt)}</h3>
      <div class="answer-line ${isCorrect ? '' : 'wrong-answer'}"><b>${'Tu respuesta:'}</b> ${LETTERS[picked]}. ${escapeHtml(chosenOption)}</div>
      <div class="answer-line correct-answer"><b>Correcta:</b> ${LETTERS[question.answer]}. ${escapeHtml(correctOption)}</div>
      <div class="explanation">${escapeHtml(question.explanation)}</div>
      <p class="memory-trick">🧠 <b>Truco para recordarlo:</b> ${escapeHtml(question.trick)}</p>
      <div class="teacher-callout"><span>¿No lo entiendes?</span><button class="secondary-button" data-teacher-question="${escapeHtml(question.id)}" data-teacher-zero-start>Explícamelo desde cero · Profesor →</button></div>
    </article>`;
  }).join('') : '<div class="correction-card">¡No tienes fallos en este simulacro! Vuelve a la corrección completa para repasar las explicaciones.</div>';
}

document.querySelector('#startExam').addEventListener('click', startExam);
document.querySelector('#retryExam').addEventListener('click', startExam);
document.querySelector('#questionGrid').addEventListener('click', event => {
  if (!(event.target instanceof Element)) return;
  const button = /** @type {HTMLButtonElement | null} */ (event.target.closest('.grid-question'));
  if (!button) return;
  currentIndex = Number(button.dataset.index);
  renderQuestion();
});
document.querySelector('#previousQuestion').addEventListener('click', () => { if (currentIndex > 0) { currentIndex--; renderQuestion(); } });
document.querySelector('#nextQuestion').addEventListener('click', () => { if (currentIndex < attemptQuestions.length - 1) { currentIndex++; renderQuestion(); } });
document.querySelector('#finishExam').addEventListener('click', finishExam);
document.querySelector('#backToDashboard').addEventListener('click', () => {
  if (answers.some(answer => answer !== null) && !window.confirm('Si sales ahora, perderás las respuestas de este simulacro. ¿Quieres salir?')) return;
  showScreen(dashboard);
});
document.querySelector('#backFromResults').addEventListener('click', () => showScreen(dashboard));
document.querySelector('#returnDashboard').addEventListener('click', () => showScreen(dashboard));
document.querySelector('#reviewMistakes').addEventListener('click', () => {
  document.querySelector('#correctionsSection').scrollIntoView({ behavior: 'smooth' });
  if (lastResult && lastResult.wrong > 0) renderCorrections(true);
});
document.querySelector('#filterWrong').addEventListener('click', () => renderCorrections(!wrongOnly));
document.querySelector('#resetProgress').addEventListener('click', () => {
  if (!readHistory().length) {
    showToast('Todavía no hay historial que borrar.');
    return;
  }
  if (!window.confirm('¿Borrar el historial y las estadísticas guardadas en este dispositivo?')) return;
  if (saveHistory([])) {
    renderDashboard();
    showToast('Historial borrado. Puedes empezar de nuevo cuando quieras.');
  }
});

renderDashboard();
