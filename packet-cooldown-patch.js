window.__patchPvZRoguePacketCooldowns = function patchPvZRoguePacketCooldowns(source) {
  function req(from, to, label) {
    if (!source.includes(from)) throw new Error(`Packet cooldown patch could not find ${label}.`);
    source = source.replace(from, to);
  }

  const anchor = 'function cardCost(type, state) {';
  if (!source.includes(anchor)) throw new Error('Packet cooldown patch could not find cardCost.');
  source = source.replace(anchor, `const PLANT_PACKET_COOLDOWNS = {
  wallnut: 15,
  tallnut: 20,
  cherrybomb: 15,
  iceberglettuce: 15,
  pineapplepuncher: 20,
  chomper: 20,
};

function packetCooldownFor(type, state) {
  if ((state.plantMods?.[type] || {}).noPacketCooldown) return 0;
  return (PLANT_PACKET_COOLDOWNS[type] ?? 4) * (state.cooldownMult || 1);
}

function cardCost(type, state) {`);

  req(
    '    noSunCap: false,\n    spawnMeter: 0,',
    '    noSunCap: false,\n    packetCooldowns: {},\n    spawnMeter: 0,',
    'packet cooldown state'
  );

  req(
    '    s.spawnMeter += dt;',
    '    s.packetCooldowns = Object.fromEntries(Object.entries(s.packetCooldowns || {}).map(([type,left]) => [type, Math.max(0, left - dt)]));\n    s.spawnMeter += dt;',
    'packet cooldown ticking'
  );

  req(
    '      const cost = cardCost(prev.selected, prev);\n      if (prev.sun < cost) return prev;',
    '      const cost = cardCost(prev.selected, prev);\n      if ((prev.packetCooldowns?.[prev.selected] || 0) > 0) return prev;\n      if (prev.sun < cost) return prev;',
    'placement cooldown gate'
  );

  req(
    '      return { ...prev, sun: prev.sun - cost, plants, plantsPlaced: prev.plantsPlaced + 1, pineapplePlaced: (prev.pineapplePlaced || 0) + (prev.selected === "pineapplepuncher" ? 1 : 0) };',
    '      return { ...prev, sun: prev.sun - cost, plants, plantsPlaced: prev.plantsPlaced + 1, pineapplePlaced: (prev.pineapplePlaced || 0) + (prev.selected === "pineapplepuncher" ? 1 : 0), packetCooldowns: { ...(prev.packetCooldowns || {}), [prev.selected]: packetCooldownFor(prev.selected, prev) } };',
    'placement cooldown start'
  );

  source = source.replace(
    'cherrybomb: { name:"Cherry Nuclear Option", desc:"Cherry Bomb gets 5x damage, +3 radius, near-instant fuse and costs 0.", mod:p=>({...p,damageMult:(p.damageMult||1)*5,radiusFlat:(p.radiusFlat||0)+3,fuseMult:(p.fuseMult||1)*0.15,costFlat:(p.costFlat||0)-999}) },',
    'cherrybomb: { name:"Cherry Nuclear Option", desc:"Cherry Bomb gets 5x damage, +3 radius, near-instant fuse, costs 0 and has NO packet cooldown.", mod:p=>({...p,damageMult:(p.damageMult||1)*5,radiusFlat:(p.radiusFlat||0)+3,fuseMult:(p.fuseMult||1)*0.15,costFlat:(p.costFlat||0)-999,noPacketCooldown:true}) },'
  );

  // Cooldown gameplay is mandatory; card decoration is deliberately optional.
  // The seed-bank markup is changed by the immersive UI patch, so startup must
  // never fail just because a cosmetic cooldown label cannot be injected.
  const cardVars = '                  const cost = cardCost(type, state);\n                  const selected = state.selected === type && !state.shovel;';
  if (source.includes(cardVars)) {
    source = source.replace(
      cardVars,
      '                  const cost = cardCost(type, state);\n                  const cooldownLeft = state.packetCooldowns?.[type] || 0;\n                  const selected = state.selected === type && !state.shovel;'
    );
    const costLine = '<div className="text-[8px] leading-tight">{cost}</div>';
    if (source.includes(costLine)) {
      source = source.replace(costLine, '<div className="text-[8px] leading-tight">{cooldownLeft > 0 ? cooldownLeft.toFixed(1) + "s" : cost}</div>');
    }
  }

  return source;
};
