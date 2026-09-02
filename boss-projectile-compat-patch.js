window.__patchPvZRogueBossProjectileCompatBefore = function patchPvZRogueBossProjectileCompatBefore(source) {
  const withAir = '              hitsAir: !!stats.hitsAir, source: next.type, slow: stats.mods.slowOnHit || 0, splash: stats.mods.splash || 0,';
  const legacy = '              source: next.type, slow: stats.mods.slowOnHit || 0, splash: stats.mods.splash || 0,';
  if (source.includes(withAir)) source = source.replace(withAir, legacy);

  const boardWithMods = '<PlantSprite type={p.type} action={plantAction} mods={state.plantMods?.[p.type]} />';
  const boardLegacy = '<PlantSprite type={p.type} action={plantAction} />';
  if (source.includes(boardWithMods)) source = source.replace(boardWithMods, boardLegacy);

  return source;
};

window.__patchPvZRogueBossProjectileCompatAfter = function patchPvZRogueBossProjectileCompatAfter(source) {
  const bossTagged = '              source: next.type, fire: !!stats.firePlant, slow: stats.mods.slowOnHit || 0, splash: stats.mods.splash || 0,';
  const combined = '              hitsAir: !!stats.hitsAir, source: next.type, fire: !!stats.firePlant, slow: stats.mods.slowOnHit || 0, splash: stats.mods.splash || 0,';
  if (!source.includes(combined) && source.includes(bossTagged)) source = source.replace(bossTagged, combined);

  const boardLegacy = '<PlantSprite type={p.type} action={plantAction} />';
  const boardWithMods = '<PlantSprite type={p.type} action={plantAction} mods={state.plantMods?.[p.type]} />';
  if (source.includes(boardLegacy)) source = source.replace(boardLegacy, boardWithMods);

  return source;
};
