window.__patchPvZRogueBossProjectileCompatBefore = function patchPvZRogueBossProjectileCompatBefore(source) {
  const withAir = '              hitsAir: !!stats.hitsAir, source: next.type, slow: stats.mods.slowOnHit || 0, splash: stats.mods.splash || 0,';
  const legacy = '              source: next.type, slow: stats.mods.slowOnHit || 0, splash: stats.mods.splash || 0,';
  if (source.includes(withAir)) return source.replace(withAir, legacy);
  if (source.includes(legacy)) return source;
  throw new Error('Boss projectile compat could not find shooter projectile fields.');
};

window.__patchPvZRogueBossProjectileCompatAfter = function patchPvZRogueBossProjectileCompatAfter(source) {
  const bossTagged = '              source: next.type, fire: !!stats.firePlant, slow: stats.mods.slowOnHit || 0, splash: stats.mods.splash || 0,';
  const combined = '              hitsAir: !!stats.hitsAir, source: next.type, fire: !!stats.firePlant, slow: stats.mods.slowOnHit || 0, splash: stats.mods.splash || 0,';
  if (source.includes(combined)) return source;
  if (source.includes(bossTagged)) return source.replace(bossTagged, combined);
  throw new Error('Boss projectile compat could not restore anti-air projectile fields.');
};
