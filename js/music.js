/* ============================================================
   music.js — Floating glass music player
   ============================================================ */

(function initMusic() {
  // Playlist — user can add actual audio src URLs
  const playlist = [
    { title: 'Perfect', artist: 'Ed Sheeran', src: '' },
    { title: 'All of Me', artist: 'John Legend', src: '' },
    { title: 'A Thousand Years', artist: 'Christina Perri', src: '' },
    { title: 'Can\'t Help Falling in Love', artist: 'Elvis Presley', src: '' },
    { title: 'Thinking Out Loud', artist: 'Ed Sheeran', src: '' },
    { title: 'Make You Feel My Love', artist: 'Adele', src: '' },
  ];

  let currentTrack = 0;
  let isPlaying = false;
  const audio = document.getElementById('bgMusic');
  const player = document.getElementById('musicPlayer');
  const toggle = document.getElementById('musicToggle');

  function loadTrack(idx) {
    const track = playlist[idx];
    document.getElementById('musicTitle').textContent = track.title;
    document.getElementById('musicArtist').textContent = track.artist;
    if (track.src) {
      audio.src = track.src;
    }
  }

  function play() {
    if (!playlist[currentTrack].src) {
      // No audio file — show visual only
      document.getElementById('playPause').textContent = '⏸';
      document.getElementById('musicVinyl').classList.add('playing');
      isPlaying = true;
      simulateProgress();
      return;
    }
    audio.play().catch(() => {});
    document.getElementById('playPause').textContent = '⏸';
    document.getElementById('musicVinyl').classList.add('playing');
    isPlaying = true;
  }

  function pause() {
    audio.pause();
    document.getElementById('playPause').textContent = '▶';
    document.getElementById('musicVinyl').classList.remove('playing');
    isPlaying = false;
  }

  // Simulate progress when no audio file
  let simProgress = 0;
  let simTimer;
  function simulateProgress() {
    clearInterval(simTimer);
    simTimer = setInterval(() => {
      if (!isPlaying) return;
      simProgress = (simProgress + 0.2) % 100;
      document.getElementById('musicFill').style.width = simProgress + '%';
    }, 200);
  }

  window.togglePlay = function() {
    if (isPlaying) pause();
    else play();
  };

  window.prevTrack = function() {
    currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
    loadTrack(currentTrack);
    if (isPlaying) play();
  };

  window.nextTrack = function() {
    currentTrack = (currentTrack + 1) % playlist.length;
    loadTrack(currentTrack);
    if (isPlaying) play();
  };

  window.setVolume = function(val) {
    audio.volume = parseFloat(val);
  };

  window.seekMusic = function(e) {
    if (!audio.duration) return;
    const bar = document.getElementById('musicProgressBar');
    const rect = bar.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pct * audio.duration;
  };

  // Update progress from audio
  audio.addEventListener('timeupdate', () => {
    if (!audio.duration) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    document.getElementById('musicFill').style.width = pct + '%';
  });

  audio.addEventListener('ended', () => window.nextTrack());

  // Toggle player visibility
  toggle.addEventListener('click', () => {
    player.classList.toggle('hidden');
    if (!player.classList.contains('hidden') && !isPlaying) {
      // Auto-animate the player entrance
      gsap.fromTo(player,
        { opacity: 0, y: 20, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.5)' }
      );
    }
  });

  loadTrack(0);

  // Auto-show player on unlock
  EventBus.on('mainUnlocked', () => {
    setTimeout(() => {
      player.classList.remove('hidden');
      gsap.fromTo(player,
        { opacity: 0, y: 30, scale: 0.85 },
        { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'back.out(1.7)', delay: 2 }
      );
    }, 500);
  });

  EventBus.on('candlesBlown', () => {
    // Auto-play music when candles blown
    play();
  });
})();
