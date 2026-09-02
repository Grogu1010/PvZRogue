window.__patchPvZRogueSunshroomGrowth = function patchPvZRogueSunshroomGrowth(source) {
  function req(from, to, label) {
    if (!source.includes(from)) throw new Error(`Sun-shroom growth patch could not find ${label}.`);
    source = source.replace(from, to);
  }

  // Document the daytime growth curve on the plant definition itself.
  req(
    '  sunshroom: { name: "Sun Shroom", icon: "🍄", cost: 25, hp: 220, kind: "sun", sunRate: 6.2, sunAmount: 25 },',
    '  sunshroom: { name: "Sun Shroom", icon: "🍄", cost: 25, hp: 220, kind: "sun", sunRate: 6.2, sunAmount: 25, growthAt: [3, 8], tierSun: [25, 50, 75], daylightBloomLimit: 12 },',
    'Sun-shroom definition'
  );

  const oldSunProduction = `      if (stats.kind === "sun") {
        let rate = stats.sunRate;
        if (stats.mods.lowSunBoost && sun < 100) rate *= 0.65;
        if (next.timer >= rate) {
          next.timer = 0;
          next.bloomCount += 1;
          let amount = stats.sunAmount;
          if (stats.mods.doubleBloom && Math.random() < stats.mods.doubleBloom) amount *= 2;
          if (stats.mods.goldenBloom && next.bloomCount % 5 === 0) amount += 50;
          if (stats.mods.bankGain) s.maxSun += stats.mods.bankGain;
          suns.push({ id: makeId("sun"), amount, x: next.col * CELL_W + 28, y: next.row * CELL_H + 18, row: next.row, life: 12, age: 0, fromSunflower: true });
        }
      }`;

  const newSunProduction = `      if (stats.kind === "sun") {
        let rate = stats.sunRate;
        if (stats.mods.lowSunBoost && sun < 100) rate *= 0.65;
        if (next.timer >= rate) {
          next.timer = 0;
          next.bloomCount += 1;
          const isSunShroom = next.type === "sunshroom";
          const shroomTier = isSunShroom ? (next.bloomCount <= 3 ? 1 : next.bloomCount <= 8 ? 2 : 3) : 0;
          const shroomBase = shroomTier === 1 ? 25 : shroomTier === 2 ? 50 : 75;
          let amount = isSunShroom
            ? Math.round((shroomBase + (stats.mods.sunFlat || 0)) * s.sunValueMult)
            : stats.sunAmount;
          if (stats.mods.doubleBloom && Math.random() < stats.mods.doubleBloom) amount *= 2;
          if (stats.mods.goldenBloom && next.bloomCount % 5 === 0) amount += 50;
          if (stats.mods.bankGain) s.maxSun += stats.mods.bankGain;
          suns.push({ id: makeId("sun"), amount, x: next.col * CELL_W + 28, y: next.row * CELL_H + 18, row: next.row, life: 12, age: 0, fromSunflower: !isSunShroom, fromSunShroom: isSunShroom, sunShroomTier: shroomTier });
          if (isSunShroom) {
            if (next.bloomCount === 3 && DEVICE_TIER !== "ultra") floaties.push({ id: makeId("shroomGrow2"), text: "🍄 GROW! 50☀", x: next.col * CELL_W + 10, y: next.row * CELL_H + 8, life: 1.1 });
            if (next.bloomCount === 8 && DEVICE_TIER !== "ultra") floaties.push({ id: makeId("shroomGrow3"), text: "🍄 GROW! 75☀", x: next.col * CELL_W + 10, y: next.row * CELL_H + 8, life: 1.1 });
            if (next.bloomCount >= 12) {
              next.hp = 0;
              if (DEVICE_TIER !== "ultra") floaties.push({ id: makeId("shroomWilt"), text: "☀ DAYLIGHT WILT", x: next.col * CELL_W + 4, y: next.row * CELL_H + 8, life: 1.2 });
            }
          }
        }
      }`;

  req(oldSunProduction, newSunProduction, 'sun production loop');

  // Visually grow only live board Sun-shrooms. Keep the exact PlantSprite call inside
  // the wrapper so the later boss compatibility/frozen-plant transform can still find it.
  const boardSprite = '<PlantSprite type={p.type} action={plantAction} mods={state.plantMods?.[p.type]} />';
  const grownBoardSprite = '<div className="relative flex items-center justify-center" style={{ transform: p.type === "sunshroom" ? `scale(${p.bloomCount >= 8 ? 1.34 : p.bloomCount >= 3 ? 1.16 : 0.9}) translateY(${p.bloomCount >= 8 ? -3 : p.bloomCount >= 3 ? -1 : 2}px)` : undefined, transition: "transform 320ms ease" }}><PlantSprite type={p.type} action={plantAction} mods={state.plantMods?.[p.type]} />{p.type === "sunshroom" && <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded bg-black/55 px-1 text-[7px] font-black text-yellow-100">T{p.bloomCount >= 8 ? 3 : p.bloomCount >= 3 ? 2 : 1}</div>}</div>';
  req(boardSprite, grownBoardSprite, 'board Sun-shroom growth visual');

  const sunOrb = '{(state.suns || []).map(orb => <button key={orb.id} onMouseEnter={() => collectSun(orb.id)} className="absolute z-[75] text-2xl drop-shadow-lg transition hover:scale-125" style={{ left: orb.x, top: orb.y }} title={`Collect ${orb.amount} sun`}>☀️</button>)}';
  const tieredSunOrb = '{(state.suns || []).map(orb => <button key={orb.id} onMouseEnter={() => collectSun(orb.id)} className={`absolute z-[75] drop-shadow-lg transition hover:scale-125 ${orb.fromSunShroom && orb.sunShroomTier === 3 ? "text-4xl" : orb.fromSunShroom && orb.sunShroomTier === 2 ? "text-3xl" : "text-2xl"}`} style={{ left: orb.x, top: orb.y }} title={`Collect ${orb.amount} sun`}>☀️</button>)}';
  req(sunOrb, tieredSunOrb, 'large Sun-shroom sun visual');

  return source;
};
