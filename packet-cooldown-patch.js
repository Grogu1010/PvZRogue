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

  req(
`                {plantCards.map(type => {
                  const def = plantDefs[type];
                  const cost = cardCost(type, state);
                  const selected = state.selected === type && !state.shovel;
                  return (
                    <button key={type} onClick={() => setState(s => ({ ...s, selected: type, shovel: false }))} className={\`flex items-center gap-1 rounded-md border px-1 py-0.5 text-left transition \${selected ? "border-lime-100 bg-lime-300 text-green-950" : "border-white/10 bg-black/25 hover:bg-white/15"}\`}>
                      <div className="w-5 shrink-0 leading-none"><PlantSprite type={type} small /></div>
                      <div className="min-w-0">
                        <div className="max-w-[72px] truncate text-[8px] font-bold leading-tight">{def.name}</div>
                        <div className="text-[8px] leading-tight">{cost}</div>
                      </div>
                    </button>`,
`                {plantCards.map(type => {
                  const def = plantDefs[type];
                  const cost = cardCost(type, state);
                  const cooldownLeft = state.packetCooldowns?.[type] || 0;
                  const selected = state.selected === type && !state.shovel;
                  return (
                    <button key={type} onClick={() => setState(s => ({ ...s, selected: type, shovel: false }))} className={\`relative flex items-center gap-1 overflow-hidden rounded-md border px-1 py-0.5 text-left transition \${selected ? "border-lime-100 bg-lime-300 text-green-950" : "border-white/10 bg-black/25 hover:bg-white/15"} \${cooldownLeft > 0 ? "opacity-60" : ""}\`}>
                      <div className="w-5 shrink-0 leading-none"><PlantSprite type={type} small /></div>
                      <div className="min-w-0">
                        <div className="max-w-[72px] truncate text-[8px] font-bold leading-tight">{def.name}</div>
                        <div className="text-[8px] leading-tight">{cooldownLeft > 0 ? cooldownLeft.toFixed(1) + "s" : cost}</div>
                      </div>
                      {cooldownLeft > 0 && <div className="absolute inset-x-0 bottom-0 h-0.5 bg-sky-300" style={{width: String(Math.min(100,(cooldownLeft/Math.max(.01,packetCooldownFor(type,state)))*100)) + "%"}} />}
                    </button>`,
    'seed packet cooldown UI'
  );

  return source;
};
