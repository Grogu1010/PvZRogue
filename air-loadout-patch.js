window.__patchPvZRogueAirLoadout = function patchPvZRogueAirLoadout(source) {
  function replaceRequired(from, to, label) {
    if (!source.includes(from)) throw new Error(`Air/loadout patch could not find ${label}.`);
    source = source.replace(from, to);
  }

  replaceRequired(
`function buildBuffPool(state) {
  const picked = new Set(state.pickedBuffNames || []);
  const pool = [];
  for (const [plant, buffs] of Object.entries(plantBuffs)) {
    for (const [name, desc, fn] of buffs) {
      if (state.allowBuffRepeats || !picked.has(name)) pool.push(withRarity({ type: "plant", plant, name, desc, fn }));
    }
  }`,
`function buildBuffPool(state) {
  const picked = new Set(state.pickedBuffNames || []);
  const pool = [];
  const selectedPlants = new Set((state.seedLoadout && state.seedLoadout.length) ? state.seedLoadout : Object.keys(plantDefs));
  for (const [plant, buffs] of Object.entries(plantBuffs)) {
    if (!selectedPlants.has(plant)) continue;
    for (const [name, desc, fn] of buffs) {
      if (state.allowBuffRepeats || !picked.has(name)) pool.push(withRarity({ type: "plant", plant, name, desc, fn }));
    }
  }`,
    'loadout-filtered buff pool'
  );

  replaceRequired(
    '  snapdragon: { name: "Snapdragon", icon: "🐲", cost: 150, hp: 430, kind: "flame", damage: 30, fireRate: 1.5, range: 3 },',
    '  snapdragon: { name: "Snapdragon", icon: "🐲", cost: 150, hp: 430, kind: "flame", damage: 30, fireRate: 1.5, range: 3, hitsAir: true },',
    'Snapdragon anti-air definition'
  );

  replaceRequired(
    '    ["Overgrowth", "+20% damage and HP", p => ({ ...p, damageMult: (p.damageMult || 1) * 1.2, hpMult: (p.hpMult || 1) * 1.2 })],',
    '    ["Skyward Stems", "Peas can hit flying zombies", p => ({ ...p, hitsAir: true })],\n    ["Overgrowth", "+20% damage and HP", p => ({ ...p, damageMult: (p.damageMult || 1) * 1.2, hpMult: (p.hpMult || 1) * 1.2 })],',
    'Peashooter anti-air buff'
  );

  replaceRequired(
    '              source: next.type, slow: stats.mods.slowOnHit || 0, splash: stats.mods.splash || 0,',
    '              source: next.type, hitsAir: !!stats.hitsAir, slow: stats.mods.slowOnHit || 0, splash: stats.mods.splash || 0,',
    'projectile anti-air flag'
  );

  replaceRequired(
    'const target = zombies.find(z => z.row === pr.row && z.x >= minX && z.x <= maxX && (!z.flying || z.groundedAir || pr.source === "cactus" || pr.source === "cabbagepult" || pr.source === "sunflower"));',
    'const target = zombies.find(z => z.row === pr.row && z.x >= minX && z.x <= maxX && (!z.flying || z.groundedAir || pr.hitsAir || pr.source === "cactus" || pr.source === "cabbagepult" || pr.source === "sunflower"));',
    'projectile collision anti-air check'
  );

  replaceRequired(
    '        const targets = zombies.filter(z => !z.flying && Math.abs(z.row - next.row) <= laneRadius && z.x > next.col * CELL_W + 20 && z.x < next.col * CELL_W + reach);',
    '        const targets = zombies.filter(z => (!z.flying || stats.hitsAir || z.groundedAir) && Math.abs(z.row - next.row) <= laneRadius && z.x > next.col * CELL_W + 20 && z.x < next.col * CELL_W + reach);',
    'Snapdragon flying target check'
  );

  replaceRequired(
    '        const targets = zombies.filter(z => !z.flying && hitRows.includes(z.row) && hitCols.includes(Math.floor(z.x / CELL_W)) && !(stats.mods.choynado && z.row === next.row && Math.floor(z.x / CELL_W) === next.col));',
    '        const targets = zombies.filter(z => (!z.flying || z.groundedAir || (next.type === "vadervine" && stats.mods.forceChoke)) && hitRows.includes(z.row) && hitCols.includes(Math.floor(z.x / CELL_W)) && !(stats.mods.choynado && z.row === next.row && Math.floor(z.x / CELL_W) === next.col));',
    'Vader Vine Force Choke anti-air check'
  );

  source = source.replace(
    'projectiles.push({ id: makeId("sunbolt"), row: orb.row ?? Math.floor(orb.y / CELL_H), x: orb.x, y: orb.y, damage: 1000, speed: 310, pierce: 1, source: "sunflower", slow: 0, splash: 0, stun: 0, poison: 0, airMult: 1 });',
    'projectiles.push({ id: makeId("sunbolt"), row: orb.row ?? Math.floor(orb.y / CELL_H), x: orb.x, y: orb.y, damage: 1000, speed: 310, pierce: 1, source: "sunflower", hitsAir: true, slow: 0, splash: 0, stun: 0, poison: 0, airMult: 1 });'
  );

  return source;
};
