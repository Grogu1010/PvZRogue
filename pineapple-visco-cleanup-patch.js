window.__patchPvZRoguePineappleViscoCleanup = function patchPvZRoguePineappleViscoCleanup(source) {
  function replaceRequired(from, to, label) {
    if (!source.includes(from)) throw new Error(`Pineapple/Visco cleanup could not find ${label}.`);
    source = source.replace(from, to);
  }

  replaceRequired(
    '["3x3 Earthquake", "Epic: every punch erupts a 3x3 quake for 55% punch damage", p => ({ ...p, earthquake: true })],',
    '["Groundbreaker", "Epic: every Skull Crushing Punch detonates a 3x3 shockwave for 55% punch damage", p => ({ ...p, earthquake: true })],',
    'earthquake buff name'
  );

  replaceRequired(
    '["One Punch Fruit", "Epic: instantly destroys the strongest non-Gargantuar zombie type", p => ({ ...p, infiniteCrusher: true })],',
    '["One Punch Fruit", "Epic: Skull Crushing Punch instantly destroys Bucket Heads. Viscoelastic armor cannot be selected by this effect.", p => ({ ...p, infiniteCrusher: true })],',
    'One Punch Fruit description'
  );

  replaceRequired(
    'item.name === "3x3 Earthquake" || item.name === "One Punch Fruit"',
    'item.name === "Groundbreaker" || item.name === "One Punch Fruit"',
    'Pineapple Epic rarity name'
  );

  replaceRequired(
`          const strongestNonGarg = Object.entries(zombieDefs)
            .filter(([type]) => type !== "gargantuar")
            .sort((a,b) => (b[1].hp || 0) - (a[1].hp || 0))[0]?.[0];
          const infiniteHit = stats.mods.infiniteCrusher && target.type === strongestNonGarg;`,
`          const onePunchTarget = "buckethead";
          const infiniteHit = stats.mods.infiniteCrusher && target.type === onePunchTarget;`,
    'One Punch Fruit target logic'
  );

  replaceRequired(
`  gargantuar: [
    ["No Smash", "Gargantuars cannot instantly smash anything. They must eat blocking plants normally and cannot eat Spikeweed.", d => ({ ...d, gargantuar: { ...d.gargantuar, noSmash: true, damage: d.gargantuar.damage * 0.7 } })],
    ["Kale Imps", "Gargantuars throw ally Kale Imps that move right and attack zombies", d => ({ ...d, gargantuar: { ...d.gargantuar, kaleImps: true } })],
  ],
};`,
`  gargantuar: [
    ["No Smash", "Gargantuars cannot instantly smash anything. They must eat blocking plants normally and cannot eat Spikeweed.", d => ({ ...d, gargantuar: { ...d.gargantuar, noSmash: true, damage: d.gargantuar.damage * 0.7 } })],
    ["Kale Imps", "Gargantuars throw ally Kale Imps that move right and attack zombies", d => ({ ...d, gargantuar: { ...d.gargantuar, kaleImps: true } })],
  ],
  viscoelastic: [
    ["Solvent Soak", "Viscoelastic armor loses its reflection property and takes 35% more damage", d => ({ ...d, viscoelastic: { ...d.viscoelastic, reflectDisabled: true, damageTaken: (d.viscoelastic.damageTaken || 1) * 1.35 } })],
    ["Thin Polymer", "Viscoelastic Zombies lose 55% HP and move 25% slower", d => ({ ...d, viscoelastic: { ...d.viscoelastic, hp: d.viscoelastic.hp * 0.45, speed: d.viscoelastic.speed * 0.75 } })],
  ],
};`,
    'Viscoelastic zombie debuffs'
  );

  source = source.replace(
    'const viscoReflectsMelee = target.type === "viscoelastic" && (next.type === "bonkchoy" || next.type === "vadervine");',
    'const viscoReflectsMelee = target.type === "viscoelastic" && !(s.zombieMods.viscoelastic || {}).reflectDisabled && (next.type === "bonkchoy" || next.type === "vadervine");'
  );

  source = source.replace(
    '          const visco = target.type === "viscoelastic";',
    '          const visco = target.type === "viscoelastic" && !(s.zombieMods.viscoelastic || {}).reflectDisabled;'
  );

  source = source.replace(
    'const viscoReflectsBeam = target.type === "viscoelastic" && pr.source === "laserbean";',
    'const viscoReflectsBeam = target.type === "viscoelastic" && !targetMods.reflectDisabled && pr.source === "laserbean";'
  );

  return source;
};