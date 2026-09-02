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
      '  jackpot: { name:"Jackpot", desc:"Choose one plant and instantly gain every missing modifier for it, then jackpot one hidden random plant too." },\n' + globalMythic
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

  // Jackpot follow-up choices and log entries should visually read as Mythic too.
  source = source.replace('    rarity: "Legendary",\n    weight: 1,', '    rarity: "MYTHIC",\n    weight: 1,');
  source = source.replaceAll('rarity: "Legendary", type: "global", target:', 'rarity: "MYTHIC", type: "global", target:');
  source = source.replace('"Jackpot should be Legendary"', '"Jackpot is boss-only Mythic"');
  source = source.replace('console.assert(rarityForBuff("Jackpot") === "Legendary", "Jackpot is boss-only Mythic");', 'console.assert(!buildBuffPool(s).some(b => b.name === "Jackpot"), "Jackpot is boss-only Mythic");');

  return source;
};
