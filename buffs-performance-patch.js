window.__patchPvZRogueBuffsPerformance = function patchPvZRogueBuffsPerformance(source) {
  function replaceRequired(from, to, label) {
    if (!source.includes(from)) throw new Error(`Buff/performance patch could not find ${label}.`);
    source = source.replace(from, to);
  }

  replaceRequired(
    '  sunshroom: Array.from({length:15}).map((_,i)=>["Sun Shroom Buff "+(i+1),"Boost",p=>p]),',
`  sunshroom: [
    ["Golden Cap", "+10 sun per bloom", p => ({ ...p, sunFlat: (p.sunFlat || 0) + 10 })],
    ["Quick Mycelium", "+25% sun production speed", p => ({ ...p, sunRateMult: (p.sunRateMult || 1) * 1.25 })],
    ["Pocket Fungus", "Cost -10 sun", p => ({ ...p, costFlat: (p.costFlat || 0) - 10 })],
    ["Thick Stalk", "+100 HP", p => ({ ...p, hpFlat: (p.hpFlat || 0) + 100 })],
    ["Double Puff", "+20% chance to double a bloom", p => ({ ...p, doubleBloom: (p.doubleBloom || 0) + 0.2 })],
    ["Emergency Glow", "Produces faster while sun is low", p => ({ ...p, lowSunBoost: true })],
    ["Bank Spores", "Blooms increase max sun bank", p => ({ ...p, bankGain: (p.bankGain || 0) + 5 })],
    ["Rogue Spores", "Collected blooms generate rogue points", p => ({ ...p, rogueSun: true })],
    ["Gilded Cycle", "Every fifth bloom gives a huge sun bonus", p => ({ ...p, goldenBloom: true })],
    ["Solar Shot", "Old uncollected sun can fire at zombies", p => ({ ...p, sunShooter: true })],
    ["Huge Harvest", "+20 sun per bloom", p => ({ ...p, sunFlat: (p.sunFlat || 0) + 20 })],
    ["Rapid Colony", "+35% production speed", p => ({ ...p, sunRateMult: (p.sunRateMult || 1) * 1.35 })],
    ["Mushroom Economy", "Another -10 sun cost", p => ({ ...p, costFlat: (p.costFlat || 0) - 10 })],
    ["Fortified Cap", "+25% HP", p => ({ ...p, hpMult: (p.hpMult || 1) * 1.25 })],
    ["Dawn Chorus", "+10 sun and +15% production speed", p => ({ ...p, sunFlat: (p.sunFlat || 0) + 10, sunRateMult: (p.sunRateMult || 1) * 1.15 })],
  ],`,
    'Sun Shroom placeholder buffs'
  );

  replaceRequired(
    '  snapdragon: Array.from({length:15}).map((_,i)=>["Snapdragon Buff "+(i+1),"Boost",p=>p]),',
`  snapdragon: [
    ["Hotter Breath", "+30% fire damage", p => ({ ...p, damageMult: (p.damageMult || 1) * 1.3 })],
    ["Rapid Exhale", "+25% attack speed", p => ({ ...p, fireRateMult: (p.fireRateMult || 1) * 1.25 })],
    ["Longer Snout", "+1 tile flame reach", p => ({ ...p, flameRangeFlat: (p.flameRangeFlat || 0) + 1 })],
    ["Wildfire Reach", "+2 tiles flame reach", p => ({ ...p, flameRangeFlat: (p.flameRangeFlat || 0) + 2 })],
    ["Dragon Scales", "+140 HP", p => ({ ...p, hpFlat: (p.hpFlat || 0) + 140 })],
    ["Cheap Hatchling", "Cost -20 sun", p => ({ ...p, costFlat: (p.costFlat || 0) - 20 })],
    ["Scorching Breath", "Fire slows scorched zombies", p => ({ ...p, scorchSlow: true })],
    ["Inferno", "+45% fire damage", p => ({ ...p, damageMult: (p.damageMult || 1) * 1.45 })],
    ["Twin Lungs", "18% chance to breathe twice", p => ({ ...p, flameDoubleChance: (p.flameDoubleChance || 0) + 0.18 })],
    ["Wide Maw", "Flames reach one extra lane up and down", p => ({ ...p, flameLaneBonus: (p.flameLaneBonus || 0) + 1 })],
    ["Cinder Guard", "Attackers take 14 damage", p => ({ ...p, thorns: (p.thorns || 0) + 14 })],
    ["Fireproof Roots", "Takes 15% less bite damage", p => ({ ...p, damageTakenMult: (p.damageTakenMult || 1) * 0.85 })],
    ["Hot Streak", "+35% attack speed", p => ({ ...p, fireRateMult: (p.fireRateMult || 1) * 1.35 })],
    ["Lingering Embers", "Breath applies burning damage", p => ({ ...p, burnDps: Math.max(p.burnDps || 0, 8) })],
    ["Ancient Dragon", "+25% damage and HP", p => ({ ...p, damageMult: (p.damageMult || 1) * 1.25, hpMult: (p.hpMult || 1) * 1.25 })],
  ],`,
    'Snapdragon placeholder buffs'
  );

  replaceRequired(
    '  torchwood: Array.from({length:15}).map((_,i)=>["Torchwood Buff "+(i+1),"Boost",p=>p]),',
`  torchwood: [
    ["Hotter Core", "+20% ignited-pea damage", p => ({ ...p, igniteMult: (p.igniteMult || 1) * 1.2 })],
    ["Blue Flame", "+35% ignited-pea damage", p => ({ ...p, igniteMult: (p.igniteMult || 1) * 1.35 })],
    ["Resin Armor", "+180 HP", p => ({ ...p, hpFlat: (p.hpFlat || 0) + 180 })],
    ["Cheap Timber", "Cost -25 sun", p => ({ ...p, costFlat: (p.costFlat || 0) - 25 })],
    ["Ember Bark", "Attackers take 18 damage", p => ({ ...p, thorns: (p.thorns || 0) + 18 })],
    ["Furnace Core", "+25% ignited-pea damage", p => ({ ...p, igniteMult: (p.igniteMult || 1) * 1.25 })],
    ["Smoldering Peas", "Ignited peas also slow", p => ({ ...p, emberSlow: true })],
    ["Burn Through", "Ignited peas gain +1 pierce", p => ({ ...p, emberPierce: (p.emberPierce || 0) + 1 })],
    ["Hardwood", "+30% HP", p => ({ ...p, hpMult: (p.hpMult || 1) * 1.3 })],
    ["Ash Shield", "Takes 18% less damage", p => ({ ...p, damageTakenMult: (p.damageTakenMult || 1) * 0.82 })],
    ["Kindling Stack", "+15% ignited-pea damage", p => ({ ...p, igniteMult: (p.igniteMult || 1) * 1.15 })],
    ["Coal Heart", "+220 HP", p => ({ ...p, hpFlat: (p.hpFlat || 0) + 220 })],
    ["Fireline", "Ignited peas gain another +1 pierce", p => ({ ...p, emberPierce: (p.emberPierce || 0) + 1 })],
    ["Kiln Dried", "Cost -20 sun and +15% HP", p => ({ ...p, costFlat: (p.costFlat || 0) - 20, hpMult: (p.hpMult || 1) * 1.15 })],
    ["Living Furnace", "+30% ignited damage and +25% HP", p => ({ ...p, igniteMult: (p.igniteMult || 1) * 1.3, hpMult: (p.hpMult || 1) * 1.25 })],
  ],`,
    'Torchwood placeholder buffs'
  );

  replaceRequired(
    '  iceberglettuce: Array.from({length:15}).map((_,i)=>["Iceberg Buff "+(i+1),"Boost",p=>p]),',
`  iceberglettuce: [
    ["Deep Freeze", "+2 seconds freeze duration", p => ({ ...p, freezeFlat: (p.freezeFlat || 0) + 2 })],
    ["Colder Still", "+3 seconds freeze duration", p => ({ ...p, freezeFlat: (p.freezeFlat || 0) + 3 })],
    ["Long Slide", "+1 tile trigger range", p => ({ ...p, freezeRangeFlat: (p.freezeRangeFlat || 0) + 1 })],
    ["Black Ice", "Deals 45 damage when freezing", p => ({ ...p, chillDamage: (p.chillDamage || 0) + 45 })],
    ["Flash Freeze", "Freezes every zombie in its trigger area", p => ({ ...p, freezeSplash: true })],
    ["Cold Front", "Freeze can reach adjacent lanes", p => ({ ...p, freezeLaneBonus: (p.freezeLaneBonus || 0) + 1 })],
    ["Permafrost", "25% chance to survive after freezing", p => ({ ...p, surviveFreezeChance: (p.surviveFreezeChance || 0) + 0.25 })],
    ["Frost Armor", "+120 HP", p => ({ ...p, hpFlat: (p.hpFlat || 0) + 120 })],
    ["Absolute Zero", "+5 seconds freeze duration", p => ({ ...p, freezeFlat: (p.freezeFlat || 0) + 5 })],
    ["Brittle Bite", "Freeze deals +70 damage", p => ({ ...p, chillDamage: (p.chillDamage || 0) + 70 })],
    ["Ice Sheet", "+2 tiles trigger range", p => ({ ...p, freezeRangeFlat: (p.freezeRangeFlat || 0) + 2 })],
    ["Polar Burst", "Freeze reaches two extra lanes", p => ({ ...p, freezeLaneBonus: (p.freezeLaneBonus || 0) + 2 })],
    ["Second Winter", "+20% chance to survive after freezing", p => ({ ...p, surviveFreezeChance: (p.surviveFreezeChance || 0) + 0.2 })],
    ["Frozen Core", "+25% HP and +2 seconds freeze", p => ({ ...p, hpMult: (p.hpMult || 1) * 1.25, freezeFlat: (p.freezeFlat || 0) + 2 })],
    ["Ice Age", "Area freeze, +3 seconds duration and +50 damage", p => ({ ...p, freezeSplash: true, freezeFlat: (p.freezeFlat || 0) + 3, chillDamage: (p.chillDamage || 0) + 50 })],
  ],`,
    'Iceberg Lettuce placeholder buffs'
  );

  replaceRequired(
`      if (stats.kind === "flame" && next.cd <= 0) {
        const reach = (stats.range || 3) * CELL_W;
        const targets = zombies.filter(z => !z.flying && Math.abs(z.row - next.row) <= 1 && z.x > next.col * CELL_W + 20 && z.x < next.col * CELL_W + reach);
        if (targets.length) {
          targets.forEach(z => { z.hp -= stats.damage; });
          floaties.push({ id: makeId("flame"), text: "🔥", x: next.col * CELL_W + 52, y: next.row * CELL_H + 14, life: 0.35 });
          next.cd = (1 / stats.fireRate) * s.cooldownMult;
        }
      }`,
`      if (stats.kind === "flame" && next.cd <= 0) {
        const reach = ((stats.range || 3) + (stats.mods.flameRangeFlat || 0)) * CELL_W;
        const laneRadius = 1 + (stats.mods.flameLaneBonus || 0);
        const targets = zombies.filter(z => !z.flying && Math.abs(z.row - next.row) <= laneRadius && z.x > next.col * CELL_W + 20 && z.x < next.col * CELL_W + reach);
        if (targets.length) {
          const burnOnce = list => list.forEach(z => {
            z.hp -= stats.damage;
            if (stats.mods.scorchSlow) z.slow = Math.max(z.slow, 2.5);
            if (stats.mods.burnDps) z.poison = Math.max(z.poison, stats.mods.burnDps);
          });
          burnOnce(targets);
          if (stats.mods.flameDoubleChance && Math.random() < stats.mods.flameDoubleChance) burnOnce(targets);
          if (DEVICE_TIER !== "ultra") floaties.push({ id: makeId("flame"), text: "🔥", x: next.col * CELL_W + 52, y: next.row * CELL_H + 14, life: 0.35 });
          next.cd = (1 / stats.fireRate) * s.cooldownMult;
        }
      }`,
    'Snapdragon combat block'
  );

  replaceRequired(
`      if (stats.kind === "iceberg" && next.cd <= 0) {
        const target = zombies.find(z => !z.flying && z.row === next.row && z.x > next.col * CELL_W - 8 && z.x < (next.col + 2) * CELL_W);
        if (target) {
          target.stun = Math.max(target.stun, stats.freezeTime || 6);
          target.slow = Math.max(target.slow, stats.freezeTime || 6);
          floaties.push({ id: makeId("freeze"), text: "❄ FREEZE", x: target.x, y: target.row * CELL_H + 8, life: 0.8 });
          next.hp = 0;
        }
      }`,
`      if (stats.kind === "iceberg" && next.cd <= 0) {
        const range = (2 + (stats.mods.freezeRangeFlat || 0)) * CELL_W;
        const laneRadius = stats.mods.freezeLaneBonus || 0;
        const candidates = zombies.filter(z => !z.flying && Math.abs(z.row - next.row) <= laneRadius && z.x > next.col * CELL_W - 8 && z.x < next.col * CELL_W + range);
        const target = candidates.sort((a,b) => a.x - b.x)[0];
        if (target) {
          const affected = stats.mods.freezeSplash ? candidates : [target];
          const freezeTime = (stats.freezeTime || 6) + (stats.mods.freezeFlat || 0);
          affected.forEach(z => {
            z.stun = Math.max(z.stun, freezeTime);
            z.slow = Math.max(z.slow, freezeTime);
            if (stats.mods.chillDamage) z.hp -= stats.mods.chillDamage;
          });
          if (DEVICE_TIER !== "ultra") floaties.push({ id: makeId("freeze"), text: "❄ FREEZE", x: target.x, y: target.row * CELL_H + 8, life: 0.8 });
          if (Math.random() < (stats.mods.surviveFreezeChance || 0)) next.cd = 8;
          else next.hp = 0;
        }
      }`,
    'Iceberg combat block'
  );

  replaceRequired(
`      if (crossed) {
        pr.ignited = true;
        pr.damage *= 1.5;
      }`,
`      if (crossed) {
        const torchMods = s.plantMods.torchwood || {};
        pr.ignited = true;
        pr.damage *= 1.5 * (torchMods.igniteMult || 1);
        if (torchMods.emberSlow) pr.slow = true;
        if (torchMods.emberPierce) pr.pierce += torchMods.emberPierce;
      }`,
    'Torchwood ignition effects'
  );

  replaceRequired(
    'const LOW_SPEC = !!window.__PVZ_LOW_SPEC__;\nconst TICK_MS = LOW_SPEC ? 180 : 100;',
    'const DEVICE_TIER = window.__PVZ_DEVICE_TIER__ || (window.__PVZ_LOW_SPEC__ ? "low" : "full");\nconst LOW_SPEC = DEVICE_TIER === "ultra" || DEVICE_TIER === "low";\nconst TICK_MS = DEVICE_TIER === "ultra" ? 260 : DEVICE_TIER === "low" ? 190 : DEVICE_TIER === "medium" ? 125 : 100;',
    'adaptive tick-rate constants'
  );

  source = source.replace('}, LOW_SPEC ? 5000 : 1500);', '}, DEVICE_TIER === "ultra" ? 10000 : DEVICE_TIER === "low" ? 6000 : DEVICE_TIER === "medium" ? 3000 : 1500);');
  source = source.replace('{LOW_SPEC ? "Low-spec" : "Full FX"}', '{DEVICE_TIER === "ultra" ? "Potato FX" : DEVICE_TIER === "low" ? "Low FX" : DEVICE_TIER === "medium" ? "Medium FX" : "Full FX"}');
  source = source.replace(
    'let floaties = prev.floaties.map(f => ({ ...f, life: f.life - dt, y: f.y - 16 * dt }));',
    'let floaties = DEVICE_TIER === "ultra" ? [] : prev.floaties.map(f => ({ ...f, life: f.life - dt, y: f.y - 16 * dt }));'
  );

  return source;
};
