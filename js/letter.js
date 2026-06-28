/* ============================================================
   letter.js — Animated love letter with envelope open
   ============================================================ */

(function initLetter() {
  let letterOpened = false;

  const letterLines = [
    'My dearest love,',
    '',
    'If I could wrap this whole letter in gold,',
    'I still would not do justice to how much',
    'today means to me.',
    '',
    'On your birthday, the universe did something',
    'incredibly generous — it gave you to the world.',
    'And somehow, of all the people in it,',
    'you found your way to me.',
    '',
    'You are my calm in the chaos.',
    'My reason to laugh on the hard days.',
    'The person I want to tell everything to',
    '— even the things that make no sense.',
    '',
    'You are not just my husband.',
    'You are my home.',
    '',
    'Thank you for every ordinary Tuesday.',
    'Every late-night conversation.',
    'Every eye-roll that turned into a smile.',
    'Every moment you chose me.',
    '',
    'Happy Birthday, my favorite human.',
    'Here\'s to forever — and then some.',
    '',
    'Yours, completely and without regret,',
    '❤️ Your Wife',
  ];

  window.openEnvelope = function() {
    if (letterOpened) return;
    letterOpened = true;

    const flap = document.getElementById('envelopeFlap');
    const envelope = document.getElementById('envelope');
    const paper = document.getElementById('letterPaper');
    const contentDiv = document.getElementById('letterContent');

    // Open flap
    flap.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    flap.style.transform = 'rotateX(180deg)';
    flap.style.transformOrigin = 'top center';

    setTimeout(() => {
      // Hide envelope, show paper
      envelope.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      envelope.style.opacity = '0';
      envelope.style.transform = 'scale(0.9)';

      setTimeout(() => {
        envelope.style.display = 'none';
        paper.classList.remove('hidden');

        // Build letter lines
        letterLines.forEach((line, i) => {
          const span = document.createElement('span');
          span.className = 'letter-line';
          span.innerHTML = line === '' ? '&nbsp;' : line;
          if (i === 0) {
            span.style.fontWeight = '700';
            span.style.fontSize = '1.3rem';
            span.style.color = '#8b5e3c';
          }
          if (line.includes('❤️')) {
            span.style.color = '#a0522d';
            span.style.fontWeight = '600';
          }
          contentDiv.appendChild(span);
        });

        // Animate each line in
        gsap.utils.toArray('.letter-line').forEach((line, i) => {
          gsap.to(line, {
            opacity: 1,
            x: 0,
            duration: 0.5,
            delay: i * 0.07,
            ease: 'power2.out',
          });
        });
      }, 400);
    }, 900);
  };
})();
