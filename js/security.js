/* ============================================================
   security.js — Funny identity verification gate
   ============================================================ */

(function initSecurity() {
  const overlay = document.getElementById('securityCheck');
  const options = document.getElementById('securityOptions');
  const errorPanel = document.getElementById('securityError');
  const errorEmoji = document.getElementById('errorEmoji');
  const errorText = document.getElementById('errorText');
  const retryBtn = document.getElementById('retryBtn');

  // Error responses per wrong choice
  const errorMessages = {
    food: [
      { emoji: '🍕', text: 'Access Denied. This is not a pizza party. (Yet.)' },
      { emoji: '😂', text: 'Food Delivery? Please leave the bag and the whole birthday website.' },
      { emoji: '🚫', text: 'Unauthorized snack detected. Activating wife alert...' },
    ],
    fbi: [
      { emoji: '🕵️', text: 'FBI? The only investigation here is why you ate my fries.' },
      { emoji: '🚨', text: 'CLASSIFIED: This website is rated Husband Only.' },
      { emoji: '😂', text: 'Nice try, Agent. Our love is above your clearance level.' },
    ],
    stranger: [
      { emoji: '😏', text: 'Handsome? Debatable. Allowed? Absolutely not.' },
      { emoji: '🚫', text: 'Go buy your own birthday website, stranger.' },
      { emoji: '😂', text: 'This is not Tinder. Move along.' },
      { emoji: '💅', text: 'Impressive confidence. Wrong website though.' },
    ],
  };

  // Show after loader
  EventBus.on('loaderDone', () => {
    overlay.classList.remove('hidden');
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.5s ease';
    requestAnimationFrame(() => {
      overlay.style.opacity = '1';
    });
    initButtons();
  });

  function initButtons() {
    document.querySelectorAll('.security-btn').forEach(btn => {
      btn.addEventListener('click', () => handleChoice(btn.dataset.answer));
    });
    retryBtn.addEventListener('click', resetSecurity);
  }

  function handleChoice(answer) {
    if (answer === 'husband') {
      // SUCCESS!
      unlockWebsite();
    } else {
      // DENIED
      const msgs = errorMessages[answer] || [];
      const msg = pick(msgs) || { emoji: '😂', text: 'Access Denied! Nice try.' };
      showError(msg.emoji, msg.text);
    }
  }

  function showError(emoji, text) {
    options.style.display = 'none';
    errorEmoji.textContent = emoji;
    errorText.textContent = text;
    errorPanel.classList.remove('hidden');

    // Shake the modal
    const modal = document.querySelector('.security-modal');
    modal.style.animation = 'none';
    modal.offsetHeight; // reflow
    modal.style.animation = 'shakeModal 0.5s ease';
  }

  function resetSecurity() {
    errorPanel.classList.add('hidden');
    options.style.display = 'grid';
    // Re-shuffle buttons order for fun
    const btns = Array.from(options.querySelectorAll('.security-btn'));
    shuffle(btns).forEach(b => options.appendChild(b));
  }

  function unlockWebsite() {
    // Success animation
    const modal = document.querySelector('.security-modal');
    modal.innerHTML = `
      <div style="text-align:center; padding: 20px;">
        <div style="font-size:4rem; animation: popIn 0.5s cubic-bezier(0.34,1.56,0.64,1)">💕</div>
        <h2 style="font-family:var(--font-serif); font-size:2rem; color:var(--color-pink-light); margin-top:16px;">Identity Confirmed!</h2>
        <p style="font-family:var(--font-sans); color:rgba(255,209,220,0.4); margin-top:8px; font-size:0.875rem;">Welcome, my love. This was made just for you. ❤️</p>
      </div>
    `;
    setTimeout(() => {
      overlay.style.transition = 'opacity 0.8s ease';
      overlay.style.opacity = '0';
      setTimeout(() => {
        overlay.classList.add('hidden');
        document.getElementById('mainContent').classList.remove('hidden');
        EventBus.emit('mainUnlocked');
      }, 800);
    }, 1500);
  }
})();

// Inject shakeModal keyframe
const styleTag = document.createElement('style');
styleTag.textContent = `
  @keyframes shakeModal {
    0%, 100% { transform: translateX(0); }
    15% { transform: translateX(-12px) rotate(-1deg); }
    30% { transform: translateX(12px) rotate(1deg); }
    45% { transform: translateX(-8px); }
    60% { transform: translateX(8px); }
    75% { transform: translateX(-4px); }
    90% { transform: translateX(4px); }
  }
`;
document.head.appendChild(styleTag);
