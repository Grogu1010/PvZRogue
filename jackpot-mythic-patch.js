window.__patchPvZRogueJackpotMythic = function patchPvZRogueJackpotMythic(source) {
  // Jackpot should never appear in the ordinary buff draft anymore.
  source = source.replace(
    '  ["Jackpot", "Legendary: choose a plant to jackpot, then also jackpot one hidden random plant", s => ({ ...s, pendingPlantJackpot: true })],\n',
    ''
  );

  // If the old rarity helper still mentions Jackpot, remove it from Legendary classification.
  source = source.replace(
    'name === "Unlock Zombie Debuffs" || name === "Evergreen Drafts" || name === "Jackpot" || name === "Seed Vault"',
    'name === "Unlock Zombie Debuffs" || name === "Evergreen Drafts" || name === "Seed Vault"'
  );

  // Boss rewards get a dedicated Jackpot Mythic alongside the existing global Mythic.
  const globalMythic = '  global: { name:"Bottomless Bank", desc:"Removes the maximum sun cap completely." },';
  if (source.includes(globalMythic) && !source.includes('jackpot: { name:"Jackpot"')) {
    source = source.replace(
      globalMythic,
      '  jackpot: { name:"Jackpot", desc:"Choose one plant and instantly gain every missing non-MYTHIC modifier for it, then do the same for one hidden random plant." },\n' + globalMythic
    );
  }

  const eligibleOld = '  const eligible = [...new Set([...(state.seedLoadout || []), "global"])].filter(k => MYTHIC_MODS[k]);';
  const eligibleNew = '  const eligible = [...new Set([...(state.seedLoadout || []), "jackpot", "global"])].filter(k => MYTHIC_MODS[k]);';
  if (source.includes(eligibleOld)) source = source.replace(eligibleOld, eligibleNew);

  const globalBranch = '  if (key === "global") return { ...state, noSunCap:true, maxSun:Number.MAX_SAFE_INTEGER, mythicReward:{...reward,target:"GLOBAL",rarity:"MYTHIC"} };';
  if (source.includes(globalBranch) && !source.includes('if (key === "jackpot")')) {
    source = source.replace(
      globalBranch,
      '  if (key === "jackpot") return { ...state, pendingPlantJackpot:true, mythicReward:{...reward,target:"GLOBAL",rarity:"MYTHIC"} };\n' + globalBranch
    );
  }

  // Make Jackpot's non-Mythic rule explicit and future-proof. Even if a MYTHIC
  // modifier is later added to plantBuffs, Jackpot must skip it.
  source = source.replace(
    '    desc: `Gain every missing ${plantDefs[plant].name} buff, plus every buff for one hidden random plant.`,',
    '    desc: `Gain every missing non-MYTHIC ${plantDefs[plant].name} modifier, plus every non-MYTHIC modifier for one hidden random plant.`,'
  );

  source = source.replace(
    '  return (plantBuffs[plant] || []).length > 0 && (plantBuffs[plant] || []).every(([name]) => gotten.has(name));',
    '  const eligible = (plantBuffs[plant] || []).filter(([name]) => rarityForBuff(name) !== "MYTHIC");\n  return eligible.length > 0 && eligible.every(([name]) => gotten.has(name));'
  );

  source = source.replace(
    '  for (const [name, desc, fn] of plantBuffs[plant] || []) {\n    if (!already.has(name)) {',
    '  for (const [name, desc, fn] of plantBuffs[plant] || []) {\n    if (rarityForBuff(name) === "MYTHIC") continue;\n    if (!already.has(name)) {'
  );

  source = source.replace(
    '    desc: `Gain every missing ${plantDefs[choice.plant].name} buff, plus every buff for one hidden random plant.`,',
    '    desc: `Gain every missing non-MYTHIC ${plantDefs[choice.plant].name} modifier, plus every non-MYTHIC modifier for one hidden random plant.`,'
  );

  source = source.replace(
    'const missing = (plantBuffs[choice.plant] || []).filter(([name]) => !already.has(name));',
    'const missing = (plantBuffs[choice.plant] || []).filter(([name]) => rarityForBuff(name) !== "MYTHIC" && !already.has(name));'
  );

  source = source.replace(
    'if (!missing.length) return `${plantDefs[choice.plant].name} has no missing buffs. You still get one hidden random plant jackpot.`;',
    'if (!missing.length) return `${plantDefs[choice.plant].name} has no missing non-MYTHIC modifiers. You still get one hidden random plant jackpot.`;'
  );

  // Jackpot follow-up choices and log entries should visually read as Mythic too.
  source = source.replace('    rarity: "Legendary",\n    weight: 1,', '    rarity: "MYTHIC",\n    weight: 1,');
  source = source.replaceAll('rarity: "Legendary", type: "global", target:', 'rarity: "MYTHIC", type: "global", target:');
  source = source.replace('"Jackpot should be Legendary"', '"Jackpot is boss-only Mythic"');
  source = source.replace('console.assert(rarityForBuff("Jackpot") === "Legendary", "Jackpot is boss-only Mythic");', 'console.assert(!buildBuffPool(s).some(b => b.name === "Jackpot"), "Jackpot is boss-only Mythic");');

  return source;
};
