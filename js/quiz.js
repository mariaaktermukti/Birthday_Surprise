/* ============================================================
   quiz.js — Funny interactive love quiz
   ============================================================ */

(function initQuiz() {
  const quizData = [
    {
      question: 'Who is always right?',
      options: ['Me', 'Also Me', 'Definitely Me', 'Wife ✓'],
      correct: 3,
      correctMsg: '🎉 Correct! See? She taught you well.',
      wrongMsgs: [
        '😂 Bold choice. Wrong universe though.',
        '😤 Incorrect. The answer is your wife. Always.',
        '🚫 Denied. Please retake this course.',
      ],
    },
    {
      question: 'What time is "I\'ll be ready in 5 minutes"?',
      options: ['5 minutes', '10 minutes', '25 minutes', '45 minutes ✓'],
      correct: 3,
      correctMsg: '🎊 Accurate. You know yourself!',
      wrongMsgs: [
        '😂 Optimistic. Wrong. But optimistic.',
        '🕐 Science disagrees. Try again.',
        '⏰ Close... but no. Never.',
      ],
    },
    {
      question: 'Who controls the TV remote?',
      options: ['Both of us equally', 'It\'s democratic', 'My wife ✓', 'Me'],
      correct: 2,
      correctMsg: '✅ Democracy works differently in this house.',
      wrongMsgs: [
        '😂 Cute. Next answer?',
        '🗳️ This is not a negotiation.',
        '❌ The remote has chosen. It chose her.',
      ],
    },
    {
      question: 'The last piece of food is...',
      options: ['For sharing', 'For whoever wants it', 'Mine ✓', 'For my wife'],
      correct: 2,
      correctMsg: '🍕 Honest! That\'s something, at least.',
      wrongMsgs: [
        '😂 Sure it is. We both know the truth.',
        '🙄 Statistically, it ends up with you.',
        '🍔 When has that ever happened?',
      ],
    },
    {
      question: 'How long does "I\'m not tired" last?',
      options: ['All night', 'A few hours', 'Until the couch', '3 minutes 47 seconds ✓'],
      correct: 3,
      correctMsg: '😴 Impressive self-awareness!',
      wrongMsgs: [
        '💤 Sweet lie. Beautiful lie.',
        '😂 The couch itself would disagree.',
        '🛋️ Almost. But not quite.',
      ],
    },
    {
      question: 'What is your role in the relationship?',
      options: ['The smart one', 'The funny one', 'The handsome one', 'The lucky one ✓'],
      correct: 3,
      correctMsg: '💍 CORRECT! And don\'t you ever forget it.',
      wrongMsgs: [
        '🧠 Debatable. Not confirmed.',
        '😂 See above — debatable.',
        '😍 True, but not the right answer.',
      ],
    },
  ];

  const container = document.getElementById('quizContainer');
  let currentQ = 0;
  let score = 0;

  function renderQuestion(index) {
    const q = quizData[index];
    container.innerHTML = `
      <div class="quiz-card glass-card">
        <div class="flex justify-between items-center mb-6">
          <span class="font-sans text-xs text-white/30 tracking-widest uppercase">Question ${index + 1} of ${quizData.length}</span>
          <span class="font-sans text-xs text-gold">Score: ${score}/${index}</span>
        </div>
        <div class="quiz-progress mb-6">
          <div style="height:2px; background:rgba(255,255,255,0.06); border-radius:100px; overflow:hidden;">
            <div style="height:100%; width:${((index) / quizData.length) * 100}%; background:linear-gradient(90deg, #FFD166, #FFB3C6); border-radius:100px; transition: width 0.5s ease;"></div>
          </div>
        </div>
        <p class="quiz-question font-serif">${q.question}</p>
        <div class="quiz-options">
          ${q.options.map((opt, i) => `
            <button class="quiz-option" data-index="${i}" onclick="answerQuiz(${i})">
              <span class="font-sans text-xs text-white/30 mr-3">${String.fromCharCode(65 + i)}.</span>
              ${opt}
            </button>
          `).join('')}
        </div>
        <div class="quiz-feedback" id="quizFeedback"></div>
      </div>
    `;
  }

  window.answerQuiz = function(selectedIndex) {
    const q = quizData[currentQ];
    const feedback = document.getElementById('quizFeedback');
    const options = document.querySelectorAll('.quiz-option');
    
    options.forEach(btn => btn.disabled = true);

    if (selectedIndex === q.correct) {
      // Correct!
      options[selectedIndex].classList.add('correct');
      feedback.textContent = q.correctMsg;
      feedback.style.display = 'block';
      feedback.style.background = 'rgba(255,209,102,0.08)';
      feedback.style.color = '#FFD166';
      feedback.style.border = '1px solid rgba(255,209,102,0.2)';
      score++;
      EventBus.emit('triggerConfetti', { x: rand(0.3, 0.7), y: 0.4, count: 40 });
    } else {
      // Wrong!
      options[selectedIndex].classList.add('wrong');
      options[q.correct].classList.add('correct');
      const wrongMsg = pick(q.wrongMsgs);
      feedback.textContent = wrongMsg;
      feedback.style.display = 'block';
      feedback.style.background = 'rgba(255,100,100,0.06)';
      feedback.style.color = '#FF6B6B';
      feedback.style.border = '1px solid rgba(255,100,100,0.15)';
    }

    setTimeout(() => {
      currentQ++;
      if (currentQ < quizData.length) {
        renderQuestion(currentQ);
      } else {
        showFinalScore();
      }
    }, 2000);
  };

  function showFinalScore() {
    const percent = Math.round((score / quizData.length) * 100);
    let verdict = '';
    let emoji = '';

    if (percent === 100) {
      verdict = "Perfect score! You know this relationship! ❤️";
      emoji = '👑';
    } else if (percent >= 66) {
      verdict = "Not bad! She's trained you well.";
      emoji = '🥹';
    } else if (percent >= 33) {
      verdict = "Room for improvement. Wife has feedback.";
      emoji = '😂';
    } else {
      verdict = "Are you sure you're her husband?";
      emoji = '🤔';
    }

    container.innerHTML = `
      <div class="quiz-card glass-card text-center">
        <div style="font-size:4rem; margin-bottom:16px;">${emoji}</div>
        <p class="font-serif text-3xl mb-4">Quiz Complete!</p>
        <p class="font-serif text-5xl text-gold mb-6">${score}/${quizData.length}</p>
        <p class="font-sans text-white/60 mb-8">${verdict}</p>
        <button class="roast-btn" style="margin:0 auto;" onclick="restartQuiz()">🔄 Try Again</button>
      </div>
    `;
  }

  window.restartQuiz = function() {
    currentQ = 0;
    score = 0;
    renderQuestion(0);
  };

  EventBus.on('mainUnlocked', () => {
    renderQuestion(0);
  });
})();
