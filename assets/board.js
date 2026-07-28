// ============================================================================
// BOARD RENDERER — shared between admin.html (clickable) and viewer.html
// (display-only). Builds the fixed 1920x1080 "stage" and keeps it scaled to
// fit any viewport.
//
// Display order differs by screen:
//   - admin: alphabetical, so the operator can find a name fast mid-show.
//   - viewer: shuffled (fixed seed, so it's stable across reloads) and then
//     repacked against each name's REAL measured width so rows still fill
//     edge to edge with minimal leftover space, despite the random order.
// ============================================================================

// Fixed-seed PRNG so repeated runs (and both screens' color assignment)
// are deterministic rather than different every reload.
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function shuffleWithSeed(list, seed) {
  const rng = mulberry32(seed);
  const arr = list.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
  }
  return arr;
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

// Best-fit-decreasing bin packing against each name's actual rendered width,
// so flex-wrap rows fill edge to edge instead of leaving ragged gaps.
function packForCoverage(containerWidth, gapPx, names, widthByName) {
  const items = names.map((name) => ({ name, width: widthByName[name] }));
  const sorted = items.slice().sort((a, b) => b.width - a.width);
  const rows = [];
  sorted.forEach((item) => {
    let bestRow = null;
    let bestRemaining = Infinity;
    rows.forEach((row) => {
      const remaining = containerWidth - (row.usedWidth + gapPx) - item.width;
      if (remaining >= 0 && remaining < bestRemaining) {
        bestRemaining = remaining;
        bestRow = row;
      }
    });
    if (bestRow) {
      bestRow.usedWidth += gapPx + item.width;
      bestRow.items.push(item.name);
    } else {
      rows.push({ usedWidth: item.width, items: [item.name] });
    }
  });
  return rows.flatMap((r) => r.items);
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
            <div class="reveal-portrait" id="revealPortrait">
              <img class="reveal-portrait-img" id="revealPortraitImg" alt="" />
              <div class="reveal-portrait-fallback" id="revealPortraitFallback"></div>
            </div>
            <div class="reveal-content">
              <div class="reveal-epic" id="revealEpic"></div>
              <div class="reveal-name" id="revealName"></div>
              <div class="reveal-divider"></div>
              <div class="reveal-quotemark reveal-quotemark-open">&ldquo;</div>
              <div class="reveal-quote" id="revealQuote"></div>
              <div class="reveal-quotemark reveal-quotemark-close">&ldquo;</div>
            </div>
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
  const portraitImgEl = root.querySelector('#revealPortraitImg');
  const portraitFallbackEl = root.querySelector('#revealPortraitFallback');

  const tileEls = {};
  const charByName = new Map(FLAT_CHARACTERS.map((c) => [c.name, c]));
  const allNames = FLAT_CHARACTERS.map((c) => c.name);

  const initialOrder = clickable
    ? allNames.slice().sort((a, b) => a.localeCompare(b))
    : shuffleWithSeed(allNames, 20260728);

  // Colors are assigned against whatever order is actually being displayed,
  // not a pre-repack order — otherwise the "never the same as the previous
  // name" guarantee doesn't hold once the viewer's rows get reordered by
  // packForCoverage.
  function buildRow(order) {
    const variants = assignVariants(order.length);
    cloud.innerHTML = '';
    Object.keys(tileEls).forEach((k) => delete tileEls[k]);
    order.forEach((name, i) => {
      const character = charByName.get(name);
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

      if (i < order.length - 1) {
        const sep = document.createElement('span');
        sep.className = 'name-separator';
        cloud.appendChild(sep);
      }
    });
  }

  buildRow(initialOrder);

  if (!clickable) {
    // Repack once the real webfont is active — measuring before it loads
    // would pack against fallback-font widths and could drift out of fit
    // once Poppins swaps in.
    const repack = () => {
      const gapPx = parseFloat(getComputedStyle(cloud).columnGap) || 0;
      const widthByName = {};
      initialOrder.forEach((name) => { widthByName[name] = tileEls[name].getBoundingClientRect().width; });
      const packed = packForCoverage(cloud.clientWidth, gapPx, initialOrder, widthByName);
      buildRow(packed);
    };
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(repack);
    } else {
      repack();
    }
  }

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
    cloud.querySelectorAll('.name-separator').forEach((el) => el.classList.toggle('is-dim', !!selected));

    if (revealed) {
      const character = FLAT_CHARACTERS.find((c) => c.name === revealed);
      if (character) {
        epicEl.textContent = character.epic;
        nameEl.textContent = character.name;
        quoteEl.textContent = character.quote;

        const initials = character.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
        const tileColor = tileEls[character.name] ? getComputedStyle(tileEls[character.name]).color : '';
        portraitFallbackEl.textContent = initials;
        portraitFallbackEl.style.color = tileColor;
        portraitFallbackEl.style.display = 'flex';
        portraitImgEl.style.display = 'none';
        portraitImgEl.onerror = () => {
          portraitImgEl.style.display = 'none';
          portraitFallbackEl.style.display = 'flex';
        };
        portraitImgEl.onload = () => {
          portraitImgEl.style.display = 'block';
          portraitFallbackEl.style.display = 'none';
        };
        // No real portraits yet — this looks for one at a conventional path
        // and falls back to initials if it's not there. Drop a photo in
        // assets/portraits/<name-slug>.jpg to have it appear automatically.
        portraitImgEl.src = 'assets/portraits/' + slugify(character.name) + '.jpg';
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
