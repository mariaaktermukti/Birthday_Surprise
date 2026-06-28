/* ============================================================
   roast.js — 100+ line roast generator
   ============================================================ */

(function initRoast() {
  let roastCount = 0;
  let lastIndex = -1;

  const roasts = [
    // Blanket / sleep crimes
    "Still thinks he'll win an argument. Cute.",
    "Professional blanket thief. No arrest. No remorse.",
    "CEO of saying '5 minutes' and taking 45.",
    "Certified snack hunter. Hunt is always successful.",
    "Has a PhD in Annoying His Wife (with distinction).",
    "Sleeps like a champion. Wakes up like a confused golden retriever.",
    "Declares 'I'm not tired' then passes out mid-sentence.",
    "Snores in HD. Literally surround sound.",
    "Falls asleep 0.3 seconds after saying 'I'm watching this.'",
    "Professional pillow hog. No compensation offered.",
    "Dreams so dramatically you'd think he's the main character.",
    "Has attended every single nap. Never missed one.",

    // Food expert
    "Can smell a snack from 3 floors away. Gift or curse? Both.",
    "Eats the last slice every single time. And looks innocent.",
    "Orders 'just a small thing' and arrives with a feast.",
    "Could find a pizza place on a deserted island.",
    "Has strong opinions about how to store leftovers. Wrong opinions.",
    "Menu expert. Decides in 40 minutes. Orders the same thing anyway.",
    "Can taste if the food is 5% less good than last time. Alarming.",
    "The phrase 'I'm not hungry' has never left his mouth. Ever.",

    // Listening skills
    "Has amazing hearing. Selectively.", 
    "Listening mode: loading... (0%)",
    "Nods while wife talks. Has retained 11% of information. Impressive.",
    "Once heard something the first time. We still talk about it.",
    "'What did I say?' — Him, having said nothing.",
    "Expert at the 'uh huh' while clearly not listening.",
    "Hears the TV from another room. Misses wife from 2 feet away.",
    "'I was listening, I just wasn't paying attention.' - Him, probably.",

    // Relationship expert
    "Thinks he's always right. Statistically wrong 97% of the time.",
    "Tries to win arguments with logic. Logic has never won here.",
    "His negotiation tactics: puppy eyes + 'but I love you.'",
    "Believes 'I'll do it later' is a valid scheduling system.",
    "Has never once admitted he was cold. Even in winter. It's fine.",
    "Convinced he knows a 'shortcut.' Arrives 25 minutes late.",
    "Google Maps says 10 minutes. He says 5. Always 15. No exceptions.",
    "Drives past the destination confidently. Twice.",
    "Refuses directions until geographically lost at soul level.",

    // Gaming / screen time
    "'One more game' is his autobiography title.",
    "Has never voluntarily put the phone down. Not once in history.",
    "Could pause real life if he could pause a game. He cannot.",
    "Lost track of time in a game. Time has sued for abandonment.",
    "Says 'I'll be right there.' Reports indicate he was not right there.",
    "The remote mysteriously ends up with him every single time.",
    "Champion of 'just five more minutes.' Undefeated since 2018.",

    // Husband humor
    "Makes Dad jokes before becoming a dad. True talent.",
    "Laughs at his own jokes loudest. Iconic behavior.",
    "His humor is an acquired taste. I've fully acquired it, unfortunately.",
    "Tells the same story 4 times. Gets funnier each time. (It doesn't.)",
    "Comedy tour: 24/7. No tickets. No way to leave.",
    "Makes faces at the worst possible moments. Cannot be stopped.",

    // Love and chaos
    "Lovable disaster. Luxury edition.",
    "Walking plot twist. Every single day.",
    "Chaotic good. Mostly chaotic.",
    "Arrives with zero plan. Always ends up fine. Very frustrating.",
    "The type to 'figure it out' and somehow do so. Annoying.",
    "Can improvise everything except a birthday present.",
    "Terrible at surprises. Amazing at being the surprise.",

    // Domestic expert
    "His definition of 'clean' is a diplomatic mystery.",
    "Laundry: in progress. Since last Tuesday.",
    "Has moved something to 'a better place.' Neither knows where.",
    "Can fix anything. Fixes things that weren't broken. Balance.",
    "Proudly says 'I'll handle it' then we handle it together.",
    "Dishwasher loading philosophy: unique and wrong.",

    // Deep ones
    "Still thinks he's the funniest one in this relationship. Not wrong. But also not right.",
    "The only man who can turn getting lost into an adventure. Every time.",
    "Once said he wasn't dramatic. Seven minutes later: scene.",
    "Expert at making things 10% more complicated than needed.",
    "Always knows where everything is. Except his keys. And wallet.",
    "Has a backup plan for nothing and somehow always succeeds.",
    "Walks into a room, forgets why, leaves. Legendary memory.",
    "His organizational system is 'I know where everything is.' He does not.",
    "Cannot multitask. Multitasks anyway. Results: uncertain.",
    "Tries to whisper. Audible to neighbors.",
    "The 'one last thing' before bed has never been one thing.",
    "Expert napper. Woke up at 3pm once saying 'what day is it?'",
    "Can quote every movie but misses his wife's point every time. Talent.",
    "Has a 'system' for everything. System defies all logic.",
    "Temperature negotiation: loses every time, still negotiates.",
    "Leaves lights on in every room. Powering a small city.",
    "Finds excuses to avoid plans. Never misses food.",
    "Hates shopping. Spends 45 minutes in one store.",
    "Promises he won't fall asleep during the movie. Movie cries.",
    "Thinks he's subtle. He is not subtle.",
    "Champions 'I'll remember it' without writing it down. Chaos follows.",
    "Always the last one ready. Mysteriously the first to say 'let's go.'",
    "Favorite sport: arguing with GPS.",
    "Has texted 'on my way' from the shower. Multiple times.",
    "Morning person? No. Night person? Also no. Nap person. Yes.",
    "Expert at starting conversations when the other person is falling asleep.",
    "Says 'we should do that sometime.' Sometime has not come.",
    "Brilliant mind. Total disaster. Perfect husband.",
    "Makes everything better just by being in the room. Even when annoying.",
    "Has accidentally become my favorite person. Still processing this.",
    "Deeply, impossibly, ridiculously lovable. I'd keep him forever.",
    "Certified heart-stealer. No charges filed. None will be.",
    "Could drive me crazy and I'd still pick him. Every day. Even Mondays.",
    "His superpower: being the reason I smile when I don't want to.",
    "Somehow knows exactly when I need a hug. Frustratingly perfect.",
    "Makes ordinary days feel like something worth remembering.",
    "Absolute menace. Also the greatest gift I ever received.",
    "100% irreplaceable. Unfortunately for him, he knows it.",
    "If there's a next life, I'm finding him there too. He's stuck with me.",
  ];

  const roastEmojis = ['🔥', '😂', '💀', '👑', '🫡', '😏', '💅', '🤣', '😤', '🥹', '🤦', '😈'];

  window.generateRoast = function() {
    const btn = document.getElementById('roastBtn');
    btn.style.transform = 'scale(0.95)';
    setTimeout(() => { btn.style.transform = ''; }, 150);

    roastCount++;

    // Pick a non-repeating roast
    let idx;
    do { idx = randInt(0, roasts.length - 1); } while (idx === lastIndex);
    lastIndex = idx;

    const text = document.getElementById('roastText');
    const emoji = document.getElementById('roastEmoji');
    const counter = document.getElementById('roastCounter');

    // Fade out → in
    text.style.opacity = '0';
    text.style.transform = 'translateY(10px)';
    emoji.style.transform = 'scale(0.5) rotate(20deg)';

    setTimeout(() => {
      text.textContent = `"${roasts[idx]}"`;
      emoji.textContent = pick(roastEmojis);
      text.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      emoji.style.transition = 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)';
      text.style.opacity = '1';
      text.style.transform = '';
      emoji.style.transform = 'scale(1) rotate(0deg)';
    }, 200);

    counter.textContent = `${roastCount} roast${roastCount > 1 ? 's' : ''} delivered 🔥`;

    // Occasional confetti shower after every 5 roasts
    if (roastCount % 5 === 0) {
      EventBus.emit('triggerConfetti', { x: 0.5, y: 0.3, count: 60 });
    }
  };
})();
