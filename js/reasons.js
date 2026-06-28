/* ============================================================
   reasons.js — 100 reasons I love you, auto-cycling
   ============================================================ */

(function initReasons() {
  const reasons = [
    "The way your eyes crinkle when you laugh, even when you don't mean to.",
    "You make ordinary mornings feel like something worth waking up for.",
    "Your voice. No matter what you're saying, it sounds like home.",
    "The fact that you always know when I need a hug without me saying so.",
    "You're impossibly patient with me, even when I know I don't deserve it.",
    "The way you sneak extra food onto my plate when you think I'm not watching.",
    "Your laugh is my favorite sound in every room.",
    "You remember things I've said that I've already forgotten.",
    "You make me want to be a better version of myself.",
    "You've never once made me feel like a burden.",
    "The ridiculous faces you make when you think no one's looking.",
    "You say sorry first. Every time. Even when it should be me.",
    "You love me on the days when I'm hardest to love.",
    "The way you get excited about small things. It makes life bigger.",
    "You make me feel safe in a world that often doesn't.",
    "Your terrible jokes that I pretend not to find funny.",
    "The way you defend me when I can't defend myself.",
    "You never try to change me. You just love me as I am.",
    "The warmth of your hand, always finding mine.",
    "You listen even when I repeat myself for the fifth time.",
    "You believe in me more than I believe in myself.",
    "Your stubbornness — which drives me crazy and also keeps us going.",
    "The way you sleep with absolute confidence and zero awareness.",
    "You are my safe place in every storm.",
    "You show up. Even when it's hard. You always show up.",
    "Your honesty, even when it's uncomfortable.",
    "You make me feel chosen, every single day.",
    "The sound of you laughing in the next room is my favorite background noise.",
    "You care about people in a way that makes the world warmer.",
    "You've seen my worst days and still decided to stay.",
    "Your sense of direction is terrible but your heart always finds me.",
    "You challenge me to grow without making me feel small.",
    "The way you look at me like I'm your whole world.",
    "You turn problems into adventures. Unknowingly. Consistently.",
    "You love deeply, even when you pretend not to.",
    "The little things you do without being asked.",
    "You make every celebration feel more special by just being in it.",
    "You notice when something is wrong before I even say a word.",
    "The way your eyes light up around the things you love.",
    "You've never once made me feel unloved. Not even once.",
    "You hold my hand like it means something, because it does.",
    "You are gentle with my feelings even when you're frustrated.",
    "Your willingness to try, even when you're afraid.",
    "The fact that you exist in the same world as me is a gift.",
    "You make hard things easier just by being next to me.",
    "Your commitment to us, even on the days when it's not easy.",
    "The way you forgive me, completely, without holding on.",
    "You remind me of the good in the world just by being you.",
    "Your smile. Especially the one you save for me.",
    "You make me feel like the luckiest person in every room.",
    "The way you're always on my side, even when you tell me I'm wrong.",
    "You still surprise me, after all this time.",
    "You've loved me through my changes and stayed anyway.",
    "Your heart is one of the most generous I've ever known.",
    "You make home feel like the best place to be.",
    "The quiet moments with you are my favorite kind of loud.",
    "You are my first call, every single time.",
    "You've given me memories I'll still be smiling about when I'm old.",
    "The way you care about the people I care about.",
    "You make me feel seen in a way no one else ever has.",
    "Your courage. In small ways and in big ones.",
    "You are the answer to a question I didn't know I was asking.",
    "The way you hold space for my feelings without trying to fix them.",
    "You have made my life more beautiful just by being in it.",
    "You are genuinely, deeply, impossibly kind.",
    "The way you love our life — and the way that makes me love it too.",
    "You are funnier than you know and kinder than you believe.",
    "Your faith in us, even when I've tested it.",
    "The way you look when you're thinking about something you love.",
    "You've taught me that home isn't a place. It's a person.",
    "You fight for us. Quietly, constantly, without giving up.",
    "The way you make everything feel like a little adventure.",
    "Your patience is something I'll never be able to fully repay.",
    "You've given me more love than I thought I deserved.",
    "The way you understand me without me having to explain.",
    "You fill the ordinary parts of life with something worth savoring.",
    "Your strength. In the ways that matter most.",
    "The way you grow. Year by year. It's one of my favorite things to witness.",
    "You are present with me in a way that makes me feel real.",
    "You would do anything for the people you love. And I know it.",
    "The warmth you bring into every space you walk into.",
    "You make the future feel like something to look forward to.",
    "You are, quite simply, my favorite person.",
    "The way you say my name when you're happy to see me.",
    "You've made every chapter better than the last.",
    "The love you give — freely, generously, without conditions.",
    "You have made me believe in the kind of love I once thought only existed in stories.",
    "The way you look at me still makes my heart do something embarrassing.",
    "You are not perfect. But you are perfectly mine.",
    "Every morning with you is one I'm grateful for.",
    "You are the reason this day — your birthday — is one of my favorite days.",
    "You are loved beyond measure, beyond words, beyond any list I could write.",
    "You are the best thing that has ever happened to me.",
    "Happy Birthday. Thank you for being born. Thank you for being you.",
    "I love you. That's it. That's the reason. All one hundred of them.",
    "If I had a hundred more lives, I'd choose you in every single one.",
    "Being yours is the greatest privilege of my life.",
    "You are my everything — and today, the world celebrates that.",
    "More than yesterday. Less than tomorrow. Always. ❤️",
  ];

  let currentIndex = 0;
  let autoPlay = true;
  let timer;
  const INTERVAL = 4000;

  function showReason(index) {
    const text = document.getElementById('reasonText');
    const num = document.getElementById('reasonNumber');
    const card = document.getElementById('currentReason');

    // Exit animation
    text.style.opacity = '0';
    text.style.transform = 'translateY(12px)';
    card.style.transform = 'scale(0.97)';

    setTimeout(() => {
      text.textContent = reasons[index];
      num.textContent = `#${index + 1}`;

      text.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      card.style.transition = 'transform 0.4s ease';
      text.style.opacity = '1';
      text.style.transform = '';
      card.style.transform = 'scale(1)';
    }, 300);
  }

  window.nextReason = function() {
    currentIndex = (currentIndex + 1) % reasons.length;
    showReason(currentIndex);
    resetTimer();
  };

  window.prevReason = function() {
    currentIndex = (currentIndex - 1 + reasons.length) % reasons.length;
    showReason(currentIndex);
    resetTimer();
  };

  window.toggleAutoPlay = function() {
    autoPlay = !autoPlay;
    const btn = document.getElementById('autoPlayBtn');
    if (autoPlay) {
      btn.textContent = '⏸ Pause';
      startTimer();
    } else {
      btn.textContent = '▶ Play';
      clearInterval(timer);
    }
  };

  function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
      currentIndex = (currentIndex + 1) % reasons.length;
      showReason(currentIndex);
    }, INTERVAL);
  }

  function resetTimer() {
    if (autoPlay) startTimer();
  }

  EventBus.on('mainUnlocked', () => {
    showReason(0);
    startTimer();

    // Scroll animation
    gsap.fromTo('#currentReason',
      { opacity: 0, y: 30 },
      {
        scrollTrigger: {
          trigger: '#currentReason',
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
      }
    );
  });
})();
