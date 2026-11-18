(() => {
  const style = document.createElement("style");
  style.textContent = `
    .rarity-cinematic{position:fixed;inset:0;z-index:200;display:flex;align-items:center;justify-content:center;overflow:hidden;pointer-events:none;opacity:0;background:rgba(2,2,7,.96);transition:opacity .32s ease}
    .rarity-cinematic.show{opacity:1}.rarity-cinematic.hidden{display:none}
    .rarity-cinematic__flash{position:absolute;inset:0;opacity:0;background:#fff}
    .rarity-cinematic__vignette{position:absolute;inset:0;background:radial-gradient(circle,transparent 20%,rgba(0,0,0,.92) 76%)}
    .rarity-cinematic__stars,.rarity-cinematic__burst{position:absolute;inset:0}
    .rarity-cinematic__star{position:absolute;left:50%;top:50%;width:6px;height:6px;border-radius:50%;background:currentColor;box-shadow:0 0 18px currentColor;animation:cinematicStar 1.5s ease-in forwards}
    .rarity-cinematic__content{position:relative;z-index:3;width:min(780px,92vw);text-align:center}
    .rarity-cinematic__prelude{margin:0 0 16px;color:#d9d2e2;font-size:clamp(14px,2.5vw,21px);letter-spacing:.18em;opacity:0;animation:cinematicText .8s .25s forwards}
    .rarity-cinematic__title{margin:0;font-family:Georgia,serif;font-size:clamp(48px,11vw,112px);line-height:.9;letter-spacing:.08em;opacity:0;transform:scale(.6);animation:cinematicTitle .72s 1.28s cubic-bezier(.2,.9,.2,1.2) forwards}
    .rarity-cinematic__item{margin:24px 0 0;font-size:clamp(68px,14vw,140px);opacity:0;transform:translateY(30px) scale(.5);animation:cinematicItem .65s 1.9s forwards}
    .rarity-cinematic__name{margin:12px 0 0;font-size:clamp(18px,4vw,32px);font-weight:900;opacity:0;animation:cinematicText .5s 2.15s forwards}
    .rarity-cinematic.legendary{background:radial-gradient(circle at center,#4c310c 0,#120d05 44%,#020207 78%)}
    .rarity-cinematic.legendary .rarity-cinematic__title{color:#ffe69a;text-shadow:0 0 15px #fff2b0,0 0 45px #d4af37,0 0 90px #8b5a00}
    .rarity-cinematic.legendary .rarity-cinematic__name{color:#ffe69a}.rarity-cinematic.legendary .rarity-cinematic__burst{background:repeating-conic-gradient(from 0deg,transparent 0 10deg,#d4af3735 10deg 13deg,transparent 13deg 26deg);animation:cinematicBurst 3s ease-out}
    .rarity-cinematic.celestial{background:radial-gradient(circle at center,#541a4e 0,#1d0a2a 38%,#020207 78%)}
    .rarity-cinematic.celestial .rarity-cinematic__title{color:#fff;text-shadow:0 0 16px #fff,0 0 38px #f2b8ff,0 0 80px #e43767,0 0 130px #8c43ff}
    .rarity-cinematic.celestial .rarity-cinematic__name{color:#ffd6fb}.rarity-cinematic.celestial .rarity-cinematic__burst{background:repeating-conic-gradient(from 0deg,transparent 0 7deg,#fff5 7deg 9deg,transparent 9deg 18deg,#e4376744 18deg 21deg);animation:cinematicBurst 4.4s ease-out}
    .rarity-cinematic.celestial .rarity-cinematic__flash{animation:celestialFlash .7s 1.12s ease-out}
    body.legendary-shake{animation:legendaryShake .46s}.rarity-cinematic.celestial.show~*{}
    @keyframes cinematicStar{0%{opacity:1;transform:translate(var(--sx),var(--sy)) scale(1.4)}100%{opacity:0;transform:translate(-50%,-50%) scale(.1)}}
    @keyframes cinematicText{to{opacity:1}}
    @keyframes cinematicTitle{to{opacity:1;transform:scale(1)}}
    @keyframes cinematicItem{to{opacity:1;transform:none}}
    @keyframes cinematicBurst{0%{opacity:0;transform:scale(.15) rotate(0)}45%{opacity:1}100%{opacity:0;transform:scale(2.2) rotate(150deg)}}
    @keyframes celestialFlash{0%,100%{opacity:0}30%{opacity:1}}
    @keyframes legendaryShake{0%,100%{transform:none}20%{transform:translate(-5px,2px)}40%{transform:translate(6px,-3px)}60%{transform:translate(-4px,-1px)}80%{transform:translate(3px,2px)}}
    @media (prefers-reduced-motion:reduce){.rarity-cinematic *{animation-duration:.01ms!important;animation-delay:0ms!important}}
  `;
  document.head.appendChild(style);

  const overlay = document.createElement("div");
  overlay.id = "rarityCinematic";
  overlay.className = "rarity-cinematic hidden";
  overlay.innerHTML = `<div class="rarity-cinematic__flash"></div><div class="rarity-cinematic__stars" id="cinematicStars"></div><div class="rarity-cinematic__burst"></div><div class="rarity-cinematic__vignette"></div><div class="rarity-cinematic__content"><p class="rarity-cinematic__prelude" id="cinematicPrelude"></p><h2 class="rarity-cinematic__title" id="cinematicTitle"></h2><div class="rarity-cinematic__item" id="cinematicItem"></div><p class="rarity-cinematic__name" id="cinematicName"></p></div>`;
  document.body.appendChild(overlay);

  function cinematicStars(rarity) {
    const box = document.getElementById("cinematicStars");
    box.innerHTML = "";
    const colors = rarity === "Celestial" ? ["#ffffff", "#f3b8ff", "#e43767", "#9b72cf", "#d4af37"] : ["#fff4b0", "#d4af37", "#ffcf55"];
    for (let i = 0; i < (rarity === "Celestial" ? 90 : 55); i++) {
      const star = document.createElement("i");
      star.className = "rarity-cinematic__star";
      const angle = Math.random() * Math.PI * 2;
      const distance = 120 + Math.random() * Math.max(innerWidth, innerHeight) * .65;
      star.style.setProperty("--sx", `${Math.cos(angle) * distance}px`);
      star.style.setProperty("--sy", `${Math.sin(angle) * distance}px`);
      star.style.animationDelay = `${Math.random() * .65}s`;
      star.style.color = colors[Math.floor(Math.random() * colors.length)];
      box.appendChild(star);
    }
  }

  function specialSound(rarity) {
    if (typeof sound !== "function") return;
    if (rarity === "Legendary") {
      [0, 250, 520].forEach((delay, i) => setTimeout(() => tone([196, 294, 587][i], [.22, .25, .5][i]), delay));
    } else {
      [0, 360, 720, 1100].forEach((delay, i) => setTimeout(() => tone([110, 220, 440, 880][i], [.3, .3, .34, .7][i]), delay));
    }
  }

  window.playRarityCinematic = function(item, done) {
    const rarity = item.rarity;
    if (rarity !== "Legendary" && rarity !== "Celestial") {
      done();
      return;
    }
    const celestial = rarity === "Celestial";
    overlay.className = `rarity-cinematic ${rarity.toLowerCase()}`;
    document.getElementById("cinematicPrelude").textContent = celestial ? "The vault has chosen you." : "Something extraordinary is awakening...";
    document.getElementById("cinematicTitle").textContent = celestial ? "CELESTIAL" : "LEGENDARY REVEAL";
    document.getElementById("cinematicItem").textContent = item.icon;
    document.getElementById("cinematicName").textContent = item.name;
    cinematicStars(rarity);
    requestAnimationFrame(() => overlay.classList.add("show"));
    setTimeout(() => document.body.classList.add("legendary-shake"), celestial ? 1160 : 1280);
    setTimeout(() => document.body.classList.remove("legendary-shake"), celestial ? 1750 : 1800);
    specialSound(rarity);
    const duration = celestial ? 5000 : 3500;
    setTimeout(() => {
      overlay.classList.remove("show");
      setTimeout(() => {
        overlay.className = "rarity-cinematic hidden";
        done();
      }, 340);
    }, duration);
  };

  window.addLuckyCharmOrbit = function(active) {
    const stage = document.getElementById("vaultStage");
    if (!stage) return;
    stage.querySelectorAll(".lucky-orbit").forEach(node => node.remove());
    if (!active) return;
    for (let i = 0; i < 4; i++) {
      const leaf = document.createElement("span");
      leaf.className = "lucky-orbit";
      leaf.textContent = "ð";
      leaf.style.cssText = `position:absolute;left:50%;top:50%;z-index:5;font-size:25px;animation:luckyOrbit 1.5s linear infinite;animation-delay:${-i * .375}s;transform-origin:0 0;`;
      stage.appendChild(leaf);
    }
    if (!document.getElementById("luckyOrbitStyle")) {
      const s = document.createElement("style");
      s.id = "luckyOrbitStyle";
      s.textContent = "@keyframes luckyOrbit{from{transform:rotate(0deg) translateX(112px) rotate(0deg)}to{transform:rotate(360deg) translateX(112px) rotate(-360deg)}}";
      document.head.appendChild(s);
    }
  };

  const originalRoll = window.roll || roll;
  window.roll = function() {
    if (data.coins < 100) return toast("You need 100 coins.");
    const lucky = $("useLucky").checked && data.boosters.lucky > 0;
    data.coins -= 100;
    if (lucky) data.boosters.lucky--;
    $("rollBtn").disabled = true;
    const stage = $("vaultStage");
    stage.className = "vault-stage opening";
    addLuckyCharmOrbit(lucky);
    createVaultBurst();
    sound("vault");
    $("orb").classList.add("rolling");
    $("orb").textContent = "â¦";
    $("vaultResult").textContent = lucky ? "Lucky energy surrounds the vault..." : "The vault is awakening...";
    $("vaultDetail").textContent = "Rare energy is gathering.";
    save();

    setTimeout(() => {
      const item = choose(lucky);
      const old = data.collection[item.id] || 0;
      data.collection[item.id] = old + 1;
      let bonus = 0;
      if (old) {
        bonus = { Common: 15, Rare: 30, Epic: 60, Legendary: 150, Celestial: 400 }[item.rarity];
        data.coins += bonus;
        data.duplicates = (data.duplicates || 0) + 1;
      }
      addLuckyCharmOrbit(false);
      $("orb").classList.remove("rolling");

      playRarityCinematic(item, () => {
        stage.className = `vault-stage reveal-${item.rarity.toLowerCase()}`;
        $("orb").textContent = item.icon;
        $("vaultResult").textContent = `${item.rarity} Â· ${item.name}`;
        $("vaultDetail").textContent = old ? `Duplicate converted into ${bonus} coins.` : "New artifact added to your collection.";
        $("rollBtn").disabled = false;
        save();
        renderCollection();
        renderShop();
        updateLucky();
        sound(item.rarity === "Celestial" ? "complete" : "buy");
      });
    }, 2200);
  };

  const rollButton = document.getElementById("rollBtn");
  if (rollButton) rollButton.onclick = window.roll;
})();
