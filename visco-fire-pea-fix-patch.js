window.__patchPvZRogueViscoFirePeas = function patchPvZRogueViscoFirePeas(source) {
  // Remember the pea's pre-ignition impact damage so Visco can ignore only the fire bonus.
  const projectileFields = '              hitsAir: !!stats.hitsAir, source: next.type, fire: !!stats.firePlant, slow: stats.mods.slowOnHit || 0, splash: stats.mods.splash || 0,';
  const projectileFieldsWithBase = '              hitsAir: !!stats.hitsAir, source: next.type, fire: !!stats.firePlant, baseImpactDamage: stats.damage, slow: stats.mods.slowOnHit || 0, splash: stats.mods.splash || 0,';
  if (source.includes(projectileFields)) source = source.replace(projectileFields, projectileFieldsWithBase);

  const oldViscoFireBlock = '        if (target.type === "viscoelastic" && (pr.fire || pr.source === "firepeashooter")) { pr.pierce = 0; if (DEVICE_TIER !== "ultra") floaties.push({id:makeId("fireproof"),text:"FIREPROOF",x:target.x,y:target.row*CELL_H+8,life:.5}); continue; }';
  const newViscoFireBlock = '        if (target.type === "viscoelastic" && (pr.fire || pr.source === "firepeashooter")) { pr.damage = pr.baseImpactDamage ?? pr.damage; pr.fire = false; pr.ignited = false; if (DEVICE_TIER !== "ultra") floaties.push({id:makeId("fireResist"),text:"FIRE BONUS BLOCKED",x:target.x,y:target.row*CELL_H+8,life:.5}); }';
  if (source.includes(oldViscoFireBlock)) source = source.replace(oldViscoFireBlock, newViscoFireBlock);

  source = source.replace(
    '  viscoelastic: { does: "Viscoelastic armor reflects concentrated impact and energy attacks. It is completely fireproof and explosion-proof.", weak: ["Peashooter", "Cabbage Pult", "Spikeweed"], strong: ["Fire plants", "Explosions", "Energy / impact attacks"] },',
    '  viscoelastic: { does: "Viscoelastic armor reflects concentrated impact and energy attacks. It is explosion-proof and immune to fire bonus damage/burns, but Fire Peas still deal their normal pea impact damage.", weak: ["Pea impact damage", "Cabbage Pult", "Spikeweed"], strong: ["Fire bonus / burns", "Explosions", "Energy / impact attacks"] },'
  );

  return source;
};
