// ============================================================================
// BOARD RENDERER — shared between admin.html (clickable) and viewer.html
// (display-only). Builds the fixed 1920x1080 "stage" and keeps it scaled to
// fit any viewport, per the approved design reference.
// ============================================================================

// Fixed-seed PRNG so admin.html and viewer.html — loaded independently —
// always compute the identical color assignment for the same character list.
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Random per-name color, but never the same as the previous name in reading
// order — avoids both the "every 4th tile repeats" striping of a strict
// cycle and any two same-colored names sitting right next to each other.
function assignVariants(count) {
  const rng = mulberry32(1337);
  const variants = [];
  let prev = -1;
  for (let i = 0; i < count; i++) {
    let pick;
    do {
      pick = Math.floor(rng() * TILE_VARIANTS.length);
    } while (pick === prev);
    prev = pick;
    variants.push(pick);
  }
  return variants;
}

function renderBoard(root, { clickable, onTileClick } = {}) {
  root.innerHTML = `
    <div class="stage">
      <div class="canvas" id="canvas">
        <div class="dot" style="top:70px;left:60px;width:14px;height:14px;background:rgba(255,255,255,0.55)"></div>
        <div class="dot" style="top:130px;left:120px;width:8px;height:8px;background:rgba(255,255,255,0.4)"></div>
        <div class="dot" style="top:90px;right:140px;width:10px;height:10px;background:rgba(255,255,255,0.5)"></div>
        <div class="dot" style="bottom:60px;right:220px;width:14px;height:14px;background:rgba(223,138,92,0.5)"></div>

        <div class="name-cloud" id="nameCloud"></div>

        <div class="reveal-overlay" id="revealOverlay">
          <div class="reveal-card" id="revealCard">
            <div class="reveal-epic" id="revealEpic"></div>
            <div class="reveal-name" id="revealName"></div>
            <div class="reveal-quotemark reveal-quotemark-open">&ldquo;</div>
            <div class="reveal-quote" id="revealQuote"></div>
            <div class="reveal-quotemark reveal-quotemark-close">&ldquo;</div>
          </div>
        </div>
      </div>
    </div>
  `;

  const canvas = root.querySelector('#canvas');
  const cloud = root.querySelector('#nameCloud');
  const overlay = root.querySelector('#revealOverlay');
  const card = root.querySelector('#revealCard');
  const epicEl = root.querySelector('#revealEpic');
  const nameEl = root.querySelector('#revealName');
  const quoteEl = root.querySelector('#revealQuote');

  const tileEls = {};
  const variants = assignVariants(FLAT_CHARACTERS.length);

  FLAT_CHARACTERS.forEach((character, i) => {
    const tag = document.createElement('span');
    tag.className = 'name-tag name-tag-' + TILE_VARIANTS[variants[i]];
    tag.textContent = character.name;
    tag.dataset.name = character.name;
    if (clickable) {
      tag.style.cursor = 'pointer';
      tag.addEventListener('click', () => onTileClick && onTileClick(character.name));
    }
    cloud.appendChild(tag);
    tileEls[character.name] = tag;
  });

  if (clickable) {
    overlay.addEventListener('click', () => onTileClick && onTileClick(null, { reset: true }));
    card.addEventListener('click', (e) => e.stopPropagation());
  }

  function applyState(state) {
    const { selected, revealed } = state || {};
    Object.entries(tileEls).forEach(([name, el]) => {
      const isSelected = selected === name;
      el.classList.toggle('is-selected', isSelected);
      el.classList.toggle('is-dim', !!selected && !isSelected);
    });

    if (revealed) {
      const character = FLAT_CHARACTERS.find((c) => c.name === revealed);
      if (character) {
        epicEl.textContent = character.epic;
        nameEl.textContent = character.name;
        quoteEl.textContent = character.quote;
      }
      overlay.classList.add('visible');
    } else {
      overlay.classList.remove('visible');
    }
  }

  function fitToViewport() {
    const scale = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
    if (scale > 0) canvas.style.transform = 'scale(' + scale + ')';
  }
  fitToViewport();
  // Viewport dimensions can be unsettled on first paint (e.g. inside an
  // embedding iframe), so re-check once layout has actually completed.
  requestAnimationFrame(fitToViewport);
  window.addEventListener('load', fitToViewport);
  window.addEventListener('resize', fitToViewport);

  return { applyState };
}
