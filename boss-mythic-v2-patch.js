window.__patchPvZRogueBossMythic = function patchPvZRogueBossMythic(source) {
  function req(from, to, label) {
    if (!source.includes(from)) throw new Error(`Boss/Mythic patch could not find ${label}.`);
    source = source.replace(from, to);
  }

  req(
    '  pineapplepuncher: { name: "Pineapple Puncher", icon: "🍍", cost: 400, hp: 1625, kind: "pineapple", damage: 6000, punchCd: 7, radius: 1 },\n};',
    '  pineapplepuncher: { name: "Pineapple Puncher", icon: "🍍", cost: 400, hp: 1625, kind: "pineapple", damage: 6000, punchCd: 7, radius: 1 },\n  firepeashooter: { name: "Fire Peashooter", icon: "🔥", cost: 175, hp: 310, kind: "shooter", damage: 38, fireRate: 1.28, firePlant: true },\n};',
    'Fire Peashooter definition'
  );

  req(
    '  viscoelastic: { name: "Viscoelastic Zombie", icon: "🫧", points: 10, hp: 1250, speed: 6.2, damage: 72, unlock: 7, flying: false, heavy: true },\n};',
    '  viscoelastic: { name: "Viscoelastic Zombie", icon: "🫧", points: 10, hp: 1250, speed: 6.2, damage: 72, unlock: 7, flying: false, heavy: true, fireproof: true, explosionProof: true },\n  coolbrainz: { name: "Mr Cool-Brainz", icon: "🧊", points: 40, hp: 430000, speed: 1.45, damage: 1200, unlock: 25, flying: false, heavy: true, boss: true, immovable: true, noScale: true, fireWeakness: 1.7, lanesTall: 3 },\n};',
    'boss and Visco definitions'
  );

  req(
    '  const scale = Math.pow(1.2, state.buffCount);',
    '  const scale = base.noScale ? 1 : Math.pow(1.2, state.buffCount);',
    'boss scaling exemption'
  );

  const globalAnchor = 'const globalBuffs = [';
  if (!source.includes(globalAnchor)) throw new Error('Boss/Mythic patch could not find global buff anchor.');
  source = source.replace(globalAnchor, `plantBuffs.firepeashooter = [
  ["Hotter Peas", "+35% fire pea damage", p => ({ ...p, damageMult: (p.damageMult || 1) * 1.35 })],
  ["Rapid Ignition", "+25% fire rate", p => ({ ...p, fireRateMult: (p.fireRateMult || 1) * 1.25 })],
  ["Cinder Shot", "Fire peas pierce +1 zombie", p => ({ ...p, pierce: (p.pierce || 1) + 1 })],
  ["Cheap Kindling", "Cost -20 sun", p => ({ ...p, costFlat: (p.costFlat || 0) - 20 })],
  ["Heat Shield", "+100 HP", p => ({ ...p, hpFlat: (p.hpFlat || 0) + 100 })],
  ["Twin Flames", "18% chance to fire twice", p => ({ ...p, doubleChance: (p.doubleChance || 0) + 0.18 })],
  ["Scorch Shot", "Fire peas slow targets", p => ({ ...p, slowOnHit: (p.slowOnHit || 0) + 0.18 })],
  ["Wildfire", "+25% damage and +1 pierce", p => ({ ...p, damageMult: (p.damageMult || 1) * 1.25, pierce: (p.pierce || 1) + 1 })],
  ["Blue Flame Peas", "+50% damage", p => ({ ...p, damageMult: (p.damageMult || 1) * 1.5 })],
  ["Furnace Stalk", "+25% damage and HP", p => ({ ...p, damageMult: (p.damageMult || 1) * 1.25, hpMult: (p.hpMult || 1) * 1.25 })],
];

${globalAnchor}`);

  req(
    '    debuffsUnlocked: false,\n    spawnMeter: 0,',
    '    debuffsUnlocked: false,\n    seenZombieTypes: [],\n    zombieIntro: null,\n    coolBrainzSpawned: false,\n    coolBrainzDefeated: false,\n    mythicReward: null,\n    noSunCap: false,\n    spawnMeter: 0,',
    'boss/codex state fields'
  );

  const helpers = String.raw`
const ZOMBIE_INTEL = {
  basic: { does: "A standard lane walker that bites blocking plants.", weak: ["Peashooter", "Bonk Choy", "Spikeweed"], strong: ["Low-HP plants", "Unprotected lanes", "Slow setups"] },
  imp: { does: "Very fast, fragile pressure zombie. Gargantuars can throw more of them.", weak: ["Spikeweed", "Snapdragon", "Cabbage Pult"], strong: ["Slow shooters", "Empty lanes", "Backline sun plants"] },
  conehead: { does: "Armored early zombie with more health than a Basic.", weak: ["Bonk Choy", "Chomper", "Laser Bean"], strong: ["Single Peashooters", "Sun producers", "Light chip damage"] },
  balloon: { does: "Flies over ordinary blockers unless grounded or hit by anti-air plants.", weak: ["Cactus", "Cabbage Pult", "Laser Bean"], strong: ["Wall Nut", "Spikeweed", "Bonk Choy"] },
  buckethead: { does: "Heavy armor makes it the toughest ordinary zombie before specialist enemies.", weak: ["Chomper", "Pineapple Puncher", "Laser Bean"], strong: ["Peashooter", "Spikeweed", "Sunflower"] },
  gargantuar: { does: "Massive tank that hits extremely hard and throws Imps.", weak: ["Pineapple Puncher", "Chomper", "Stacked ranged fire"], strong: ["Wall Nut", "Tall Nut", "Single-target chip"] },
  viscoelastic: { does: "Viscoelastic armor reflects concentrated impact and energy attacks. It is completely fireproof and explosion-proof.", weak: ["Peashooter", "Cabbage Pult", "Spikeweed"], strong: ["Fire plants", "Explosions", "Energy / impact attacks"] },
  coolbrainz: { does: "COUNT 25 BOSS. Three lanes tall, immune to knockback, and exempt from normal zombie scaling. After 10 seconds he freeze-rays one occupied lane, then freezes one random plant every 5 seconds. Frozen plants cannot act and zombies walk through them. Killing him shatters every ice block. Fire attacks deal 1.7x damage to him.", weak: ["Fire Peashooter (1.7x)", "Snapdragon (1.7x)", "Torchwood-supported fire"], strong: ["Knockback", "Frozen plants", "Slow setups"] },
};

const MYTHIC_MODS = {
  peashooter: { name:"Pea Gatling Apocalypse", desc:"Peashooter fires 6 extra peas, triple damage and +6 pierce.", mod:p=>({...p,extraShots:(p.extraShots||0)+6,damageMult:(p.damageMult||1)*3,pierce:(p.pierce||1)+6}) },
  sunflower: { name:"Pocket Sun", desc:"Sunflowers produce +500 sun, four times faster, and always double bloom.", mod:p=>({...p,sunFlat:(p.sunFlat||0)+500,sunRateMult:(p.sunRateMult||1)*4,doubleBloom:1}) },
  wallnut: { name:"Fortress Nut", desc:"Wall Nuts gain 5x HP, 300 thorns and block air.", mod:p=>({...p,hpMult:(p.hpMult||1)*5,thorns:(p.thorns||0)+300,blocksAir:true}) },
  tallnut: { name:"Citadel Nut", desc:"Tall Nuts gain 5x HP, 500 thorns and regenerate 50 HP/sec.", mod:p=>({...p,hpMult:(p.hpMult||1)*5,thorns:(p.thorns||0)+500,regen:(p.regen||0)+50}) },
  chomper: { name:"World Eater", desc:"Chomper bites almost instantly, reaches 4 tiles both ways and never needs to chew.", mod:p=>({...p,biteRateMult:(p.biteRateMult||1)*10,biteRange:(p.biteRange||1)+3,backbite:true,freeBiteChance:1,biteDamageMult:(p.biteDamageMult||1)*10}) },
  cherrybomb: { name:"Cherry Nuclear Option", desc:"Cherry Bomb gets 5x damage, +3 radius, near-instant fuse and costs 0.", mod:p=>({...p,damageMult:(p.damageMult||1)*5,radiusFlat:(p.radiusFlat||0)+3,fuseMult:(p.fuseMult||1)*0.15,costFlat:(p.costFlat||0)-999}) },
  spikeweed: { name:"Planet of Spikes", desc:"Spikeweed gets 8x damage, 5x HP and gigantic retaliation damage.", mod:p=>({...p,damageMult:(p.damageMult||1)*8,hpMult:(p.hpMult||1)*5,thorns:(p.thorns||0)+400}) },
  cactus: { name:"Needle Railgun", desc:"Cactus gets 4x damage, 3x fire rate and +8 pierce.", mod:p=>({...p,damageMult:(p.damageMult||1)*4,fireRateMult:(p.fireRateMult||1)*3,pierce:(p.pierce||1)+8}) },
  cabbagepult: { name:"Orbital Cabbage", desc:"Cabbage Pult gets 5x damage, 3x fire rate and massive splash.", mod:p=>({...p,damageMult:(p.damageMult||1)*5,fireRateMult:(p.fireRateMult||1)*3,splash:Math.max(p.splash||0,1.5),pierce:(p.pierce||1)+3}) },
  bonkchoy: { name:"Pineapple Crown", desc:"A Pineapple Puncher rides on Bonk Choy. Their HP combines, Choy keeps punching, and the elevated Skull Crusher hits air every 7 seconds.", mod:p=>({...p,hpFlat:(p.hpFlat||0)+1625,pineappleStack:true,hitsAir:true}) },
  laserbean: { name:"Death Star Bean", desc:"Laser Bean gets 6x damage, 3x fire rate and effectively unlimited pierce.", mod:p=>({...p,damageMult:(p.damageMult||1)*6,fireRateMult:(p.fireRateMult||1)*3,pierce:999}) },
  sunshroom: { name:"Solar Colony", desc:"Sun Shrooms produce +400 sun, 5x faster and always double bloom.", mod:p=>({...p,sunFlat:(p.sunFlat||0)+400,sunRateMult:(p.sunRateMult||1)*5,doubleBloom:1}) },
  snapdragon: { name:"Dragon God", desc:"Snapdragon gets 5x damage, +4 range, +4 lane reach and 3x attack speed.", mod:p=>({...p,damageMult:(p.damageMult||1)*5,flameRangeFlat:(p.flameRangeFlat||0)+4,flameLaneBonus:(p.flameLaneBonus||0)+4,fireRateMult:(p.fireRateMult||1)*3}) },
  torchwood: { name:"Living Sun", desc:"Torchwood gets 5x HP and ignited peas gain 5x more power and +6 pierce.", mod:p=>({...p,hpMult:(p.hpMult||1)*5,igniteMult:(p.igniteMult||1)*5,emberPierce:(p.emberPierce||0)+6}) },
  iceberglettuce: { name:"Absolute Winter", desc:"Iceberg freezes the whole board for ages, deals 500 freeze damage and always survives.", mod:p=>({...p,freezeLaneBonus:5,freezeRangeFlat:9,freezeFlat:(p.freezeFlat||0)+20,chillDamage:(p.chillDamage||0)+500,freezeSplash:true,surviveFreezeChance:1}) },
  vadervine: { name:"Rule of Two", desc:"Vader Vine gets 5x saber damage, 3x attack speed, cross-lane Force powers and anti-air.", mod:p=>({...p,damageMult:(p.damageMult||1)*5,punchRateMult:(p.punchRateMult||1)*3,crossLane:true,forcePush:true,forceChoke:true,hitsAir:true}) },
  pineapplepuncher: { name:"Worldbreaker", desc:"Pineapple Puncher gets 3x damage, charges in 2.5 seconds, always Groundbreaks and can punch air.", mod:p=>({...p,damageMult:(p.damageMult||1)*3,punchCdMult:(p.punchCdMult||1)*0.36,earthquake:true,hitsAir:true}) },
  firepeashooter: { name:"Supernova Pea", desc:"Fire Peashooter gets 6x damage, 3x fire rate and +6 pierce.", mod:p=>({...p,damageMult:(p.damageMult||1)*6,fireRateMult:(p.fireRateMult||1)*3,pierce:(p.pierce||1)+6}) },
  global: { name:"Bottomless Bank", desc:"Removes the maximum sun cap completely." },
};

function zombieIntelStats(type, state) {
  const st = applyZombieStats(type, state);
  const def = zombieDefs[type];
  return { hp:Math.round(st.hp), speed:Number(st.speed).toFixed(2), damage:Math.round(st.damage), unlock:def.unlock, tags:[st.flying?"Flying":null,def.heavy?"Heavy":null,def.boss?"BOSS":null,def.immovable?"No knockback":null,def.noScale?"Fixed boss stats":null,def.fireWeakness?"Fire takes 1.7x":null,def.fireproof?"Fireproof":null,def.explosionProof?"Explosion-proof":null].filter(Boolean) };
}

function grantRandomMythic(state) {
  const eligible = [...new Set([...(state.seedLoadout || []), "global"])].filter(k => MYTHIC_MODS[k]);
  const key = eligible[Math.floor(Math.random()*eligible.length)] || "global";
  const reward = MYTHIC_MODS[key];
  if (key === "global") return { ...state, noSunCap:true, maxSun:Number.MAX_SAFE_INTEGER, mythicReward:{...reward,target:"GLOBAL",rarity:"MYTHIC"} };
  const mods = { ...state.plantMods, [key]: reward.mod({ ...(state.plantMods[key] || {}) }) };
  return { ...state, plantMods:mods, mythicReward:{ name:reward.name, desc:reward.desc, target:plantDefs[key]?.name || key, rarity:"MYTHIC" } };
}

function CoolBrainzSprite() {
  return <svg viewBox="0 0 92 120" className="h-full w-full overflow-visible"><defs><linearGradient id="cbCoat" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c9f7ff"/><stop offset="1" stopColor="#3678aa"/></linearGradient></defs><motion.g animate={{y:[0,-2,0],rotate:[0,-1,0,1,0]}} transition={{duration:2.2,repeat:Infinity}} style={{transformOrigin:"46px 90px"}}><ellipse cx="46" cy="108" rx="31" ry="8" fill="#062c43" opacity=".35"/><path d="M27 49 C17 65 18 94 28 107 L65 107 C73 88 72 63 62 49 Z" fill="url(#cbCoat)" stroke="#174e76" strokeWidth="3"/><ellipse cx="46" cy="35" rx="25" ry="23" fill="#7daf6d" stroke="#36553b" strokeWidth="3"/><path d="M23 28 C26 6 67 5 69 28 C60 18 31 17 23 28 Z" fill="#8ee8ff" stroke="#25749d" strokeWidth="3"/><path d="M27 23 L17 13 M38 18 L35 4 M52 18 L57 4 M65 24 L76 13" stroke="#e9fcff" strokeWidth="4" strokeLinecap="round"/><path d="M31 35 Q37 30 41 35 M51 35 Q56 30 61 35" stroke="#142e3e" strokeWidth="3" fill="none"/><circle cx="37" cy="37" r="2"/><circle cx="56" cy="37" r="2"/><path d="M36 47 Q47 52 59 45" stroke="#142e3e" strokeWidth="3" fill="none"/><motion.g animate={{rotate:[-4,5,-4]}} transition={{duration:1.3,repeat:Infinity}} style={{transformOrigin:"78px 77px"}}><rect x="72" y="67" width="15" height="26" rx="5" fill="#21445d"/><path d="M84 70 L92 61" stroke="#c9f7ff" strokeWidth="5" strokeLinecap="round"/></motion.g></motion.g></svg>;
}
`;

  const helperAnchor = 'function blankPlantMods() {';
  if (!source.includes(helperAnchor)) throw new Error('Boss/Mythic patch could not find helper anchor.');
  source = source.replace(helperAnchor, helpers + '\n' + helperAnchor);

  req(
    'function ZombieSprite({ type, hpPct = 100, action = "walk", noSmash = false, flying = false, groundedAir = false }) {',
    'function ZombieSprite({ type, hpPct = 100, action = "walk", noSmash = false, flying = false, groundedAir = false }) {\n  if (type === "coolbrainz") return <CoolBrainzSprite />;',
    'boss sprite hook'
  );

  req(
    '              source: next.type, slow: stats.mods.slowOnHit || 0, splash: stats.mods.splash || 0,',
    '              source: next.type, fire: !!stats.firePlant, slow: stats.mods.slowOnHit || 0, splash: stats.mods.splash || 0,',
    'fire projectile tag'
  );
  source = source.replace('        pr.ignited = true;\n        pr.damage *=', '        pr.ignited = true;\n        pr.fire = true;\n        pr.damage *=');

  req(
    '    while (s.spawnMeter >= 5) {\n      s.spawnMeter -= 5;\n      zombies.push(createZombie(s));\n    }',
`    if (s.buffCount >= 25 && !s.coolBrainzSpawned) {
      zombies.push(createZombie(s, "coolbrainz", 2, BOARD_W + 38));
      s.coolBrainzSpawned = true;
    }
    while (s.spawnMeter >= 5) {
      s.spawnMeter -= 5;
      zombies.push(createZombie(s));
    }
    const seenNow = new Set(s.seenZombieTypes || []);
    const unseen = zombies.find(z => !seenNow.has(z.type));
    if (unseen && !s.zombieIntro && !s.mythicReward) {
      s.seenZombieTypes = [...seenNow, unseen.type];
      s.zombieIntro = unseen.type;
      s.running = false;
    }`,
    'boss spawn and zombie intro trigger'
  );

  req(
    '      const next = { ...p };\n      next.cd = Math.max(0, next.cd - dt);\n      next.timer += dt;',
`      const next = { ...p };
      next.cd = Math.max(0, next.cd - dt);
      next.timer += dt;
      next.fireThawCd = Math.max(0, (next.fireThawCd || 0) - dt);
      const isFirePlant = !!stats.firePlant || next.type === "snapdragon" || next.type === "torchwood" || next.type === "firepeashooter";
      if (isFirePlant && next.fireThawCd <= 0) {
        const frozenTargets = plants.filter(fp => fp.frozenHp > 0 && (next.type === "snapdragon" ? Math.abs(fp.row-next.row)<=1 && Math.abs(fp.col-next.col)<=3 : next.type === "torchwood" ? Math.abs(fp.row-next.row)<=1 && Math.abs(fp.col-next.col)<=1 : fp.row===next.row));
        const iceTarget = frozenTargets.sort((a,b)=>Math.abs(a.col-next.col)-Math.abs(b.col-next.col))[0];
        if (iceTarget) {
          const thawDamage = next.type === "torchwood" ? 60 : Math.max(1, stats.damage || 30);
          iceTarget.frozenHp = Math.max(0, iceTarget.frozenHp - thawDamage);
          next.fireThawCd = next.type === "torchwood" ? 1.25 : Math.max(.3,(1/(stats.fireRate||1.2))*s.cooldownMult);
          if (iceTarget.frozenHp <= 0 && DEVICE_TIER !== "ultra") floaties.push({id:makeId("melt"),text:"🔥 THAWED",x:iceTarget.col*CELL_W+20,y:iceTarget.row*CELL_H+10,life:.7});
        }
      }
      if (next.frozenHp > 0) return next;
      if (next.type === "bonkchoy" && stats.mods.pineappleStack) {
        const ox = next.col*CELL_W + CELL_W/2;
        const skyTarget = zombies.filter(z => z.row===next.row && z.x>=ox-8 && z.x<=ox+CELL_W+28).sort((a,b)=>a.x-b.x)[0];
        next.stackPunchCharge = skyTarget ? (next.stackPunchCharge||0)+dt : 0;
        if (skyTarget && next.stackPunchCharge >= 7*s.cooldownMult) {
          skyTarget.hp -= 6000;
          if (!zombieDefs[skyTarget.type]?.immovable && skyTarget.type !== "viscoelastic") skyTarget.x += CELL_W*(zombieDefs[skyTarget.type]?.heavy?2:4);
          next.stackPunchCharge = 0;
          if (DEVICE_TIER !== "ultra") floaties.push({id:makeId("crownPunch"),text:"👑💀 CROWN PUNCH",x:skyTarget.x,y:skyTarget.row*CELL_H+8,life:.7});
        }
      }`,
    'freeze handling and Bonk mythic combat'
  );

  req(
    'return p.row === next.row && p.hp > 0 && stats.kind !== "spike" && next.x > p.col * CELL_W + 18 && next.x < p.col * CELL_W + 56 && (!next.flying || stats.blocksAir);',
    'return !p.frozenHp && (p.row === next.row || (next.type === "coolbrainz" && Math.abs(p.row-next.row)<=1)) && p.hp > 0 && stats.kind !== "spike" && next.x > p.col * CELL_W + 18 && next.x < p.col * CELL_W + 56 && (!next.flying || stats.blocksAir);',
    'frozen bypass and boss three-lane collision'
  );

  req(
    '      if (next.poison) next.hp -= next.poison * dt;\n\n      if (next.type === "gargantuar"',
`      if (next.poison) next.hp -= next.poison * dt;
      if (next.type === "coolbrainz") {
        next.bossAge = (next.bossAge || 0) + dt;
        next.freezeCd = Math.max(0,(next.freezeCd ?? 5)-dt);
        const fireImmune = p => p.type === "snapdragon" || p.type === "torchwood" || p.type === "firepeashooter" || !!plantDefs[p.type]?.firePlant;
        if (!next.openingFreezeDone && next.bossAge >= 10) {
          const lane = [1,2,3][Math.floor(Math.random()*3)];
          plants.forEach(p => { if (p.row===lane && !fireImmune(p)) p.frozenHp = Math.max(p.frozenHp||0,350); });
          next.openingFreezeDone = true; next.freezeCd = 5;
          if (DEVICE_TIER !== "ultra") floaties.push({id:makeId("freezeRay"),text:"❄ FREEZE RAY — LANE "+(lane+1),x:Math.max(8,next.x-120),y:lane*CELL_H+8,life:1.2});
        } else if (next.openingFreezeDone && next.freezeCd <= 0) {
          const candidates = plants.filter(p=>p.hp>0 && !p.frozenHp && !fireImmune(p));
          const victim = candidates[Math.floor(Math.random()*candidates.length)];
          if (victim) { victim.frozenHp=350; if (DEVICE_TIER!=="ultra") floaties.push({id:makeId("spotFreeze"),text:"🧊 FROZEN",x:victim.col*CELL_W+18,y:victim.row*CELL_H+8,life:.8}); }
          next.freezeCd=5;
        }
      }

      if (next.type === "gargantuar"`,
    'boss freeze AI'
  );

  source = source.replace('z.row === pr.row && z.x >= minX', '(z.row === pr.row || (z.type === "coolbrainz" && Math.abs(pr.row-z.row)<=1)) && z.x >= minX');
  source = source.replace('        const viscoReflectsBeam = target.type === "viscoelastic"', '        if (target.type === "viscoelastic" && (pr.fire || pr.source === "firepeashooter")) { pr.pierce = 0; if (DEVICE_TIER !== "ultra") floaties.push({id:makeId("fireproof"),text:"FIREPROOF",x:target.x,y:target.row*CELL_H+8,life:.5}); continue; }\n        if (target.type === "coolbrainz" && (pr.fire || pr.source === "firepeashooter")) { target.hp -= pr.damage * 0.7; if (DEVICE_TIER !== "ultra") floaties.push({id:makeId("fireweak"),text:"🔥 1.7x",x:target.x,y:target.row*CELL_H+8,life:.45}); }\n        const viscoReflectsBeam = target.type === "viscoelastic"');

  req(
    'if (Math.abs(z.row - p.row) <= rad && Math.abs(zCol - p.col) <= rad) z.hp -= (stats.damage || 3600) * (z.type === "gargantuar" ? (stats.gargBonus || 1.25) : 1);',
    'if (Math.abs(z.row - p.row) <= rad && Math.abs(zCol - p.col) <= rad && z.type !== "viscoelastic") z.hp -= (stats.damage || 3600) * (z.type === "gargantuar" ? (stats.gargBonus || 1.25) : 1);',
    'Visco explosion immunity'
  );
  source = source.replace('z.hp -= stats.damage;\n            if (stats.mods.scorchSlow)', 'if (z.type !== "viscoelastic") z.hp -= stats.damage * (z.type === "coolbrainz" ? 1.7 : 1);\n            if (stats.mods.scorchSlow && z.type !== "viscoelastic")');
  source = source.replace('if (stats.mods.burnDps) z.poison = Math.max(z.poison, stats.mods.burnDps);', 'if (stats.mods.burnDps && z.type !== "viscoelastic") z.poison = Math.max(z.poison, stats.mods.burnDps * (z.type === "coolbrainz" ? 1.7 : 1));');
  source = source.replace('              target.x += CELL_W * tiles;', '              if (!zombieDefs[target.type]?.immovable) target.x += CELL_W * tiles;');
  source = source.replace('if (z.type !== "viscoelastic") z.x += CELL_W;', 'if (z.type !== "viscoelastic" && !zombieDefs[z.type]?.immovable) z.x += CELL_W;');
  source = source.replace('if (stats.mods.forcePush) target.x += 34;', 'if (stats.mods.forcePush && !zombieDefs[target.type]?.immovable) target.x += 34;');

  req(
    '    const killed = zombies.filter(z => z.hp <= 0);\n    for (const z of killed) {',
`    const killed = zombies.filter(z => z.hp <= 0);
    for (const z of killed) {
      if (z.type === "coolbrainz" && !s.coolBrainzDefeated) {
        s.coolBrainzDefeated = true;
        plants.forEach(p => { p.frozenHp = 0; });
        const awarded = grantRandomMythic(s);
        Object.assign(s, awarded);
        s.running = false;
      }`,
    'boss death Mythic award'
  );

  req(
    '<PlantSprite type={p.type} action={plantAction} />',
    '<div className="relative"><PlantSprite type={p.type} action={plantAction} />{p.type === "bonkchoy" && (state.plantMods.bonkchoy || {}).pineappleStack && <div className="absolute -top-8 left-1/2 h-10 w-10 -translate-x-1/2"><PineapplePuncherSprite small /></div>}{p.frozenHp > 0 && <div className="absolute inset-[-4px] rounded-xl border-2 border-cyan-100/80 bg-cyan-300/35"><div className="absolute left-1 top-1 text-[9px] font-black text-white">ICE {Math.ceil(p.frozenHp)}</div></div>}</div>',
    'frozen/Mythic plant visual'
  );

  const uiAnchor = '<AnimatePresence>{state.floaties.map(f => <motion.div key={f.id}';
  if (!source.includes(uiAnchor)) throw new Error('Boss/Mythic patch could not find popup UI anchor.');
  source = source.replace(uiAnchor, `{state.zombieIntro && (()=>{const type=state.zombieIntro;const def=zombieDefs[type];const info=ZOMBIE_INTEL[type]||{does:"Unknown threat.",weak:[],strong:[]};const st=zombieIntelStats(type,state);return <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/75 p-4"><motion.div initial={{scale:.82,opacity:0}} animate={{scale:1,opacity:1}} className="w-full max-w-2xl rounded-2xl border border-cyan-200/40 bg-slate-950/95 p-4 text-white shadow-2xl"><div className="flex gap-4"><div className="h-40 w-36 shrink-0 rounded-xl border border-white/15 bg-gradient-to-b from-sky-900/60 to-emerald-950/50 p-2"><ZombieSprite type={type} hpPct={100} flying={!!def.flying}/></div><div className="min-w-0 flex-1"><div className="text-xs font-black uppercase tracking-[.24em] text-cyan-300">New Zombie Spotted</div><div className="mt-1 text-3xl font-black">{def.name}</div><p className="mt-2 text-sm text-slate-200">{info.does}</p><div className="mt-3 grid grid-cols-4 gap-2 text-xs"><div className="rounded-lg bg-white/5 p-2"><b>HP</b><div>{st.hp.toLocaleString()}</div></div><div className="rounded-lg bg-white/5 p-2"><b>Damage</b><div>{st.damage}</div></div><div className="rounded-lg bg-white/5 p-2"><b>Speed</b><div>{st.speed}</div></div><div className="rounded-lg bg-white/5 p-2"><b>Appears</b><div>Count {st.unlock}</div></div></div>{st.tags.length>0&&<div className="mt-2 flex flex-wrap gap-1">{st.tags.map(t=><span key={t} className="rounded-full bg-cyan-900/60 px-2 py-1 text-[10px] font-bold text-cyan-100">{t}</span>)}</div>}<div className="mt-3 grid grid-cols-2 gap-3 text-xs"><div><div className="font-black text-lime-300">STRONG AGAINST</div>{info.strong.map(x=><div key={x}>• {x}</div>)}</div><div><div className="font-black text-rose-300">WEAK TO / COUNTERS</div>{info.weak.map(x=><div key={x}>• {x}</div>)}</div></div><button onClick={()=>setState(s=>({...s,zombieIntro:null,running:true}))} className="mt-4 rounded-lg bg-cyan-300 px-4 py-2 font-black text-slate-950">Got it</button></div></div></motion.div></div>})()}
            {state.mythicReward && <div className="fixed inset-0 z-[520] flex items-center justify-center bg-black/80 p-4"><motion.div initial={{scale:.75,opacity:0}} animate={{scale:1,opacity:1}} className="w-full max-w-xl rounded-3xl border-2 border-fuchsia-300 bg-gradient-to-b from-red-950 to-slate-950 p-6 text-center text-white shadow-2xl"><div className="text-sm font-black tracking-[.35em] text-fuchsia-300">MYTHIC MODIFIER</div><div className="mt-2 text-4xl font-black text-red-300">{state.mythicReward.name}</div><div className="mt-1 text-sm font-bold text-amber-200">{state.mythicReward.target}</div><p className="mx-auto mt-4 max-w-md text-base text-slate-100">{state.mythicReward.desc}</p><button onClick={()=>setState(s=>({...s,mythicReward:null,running:true}))} className="mt-5 rounded-xl bg-red-300 px-5 py-2 font-black text-red-950">UNLEASH IT</button></motion.div></div>}
            ${uiAnchor}`);

  source = source.replace('Math.min(state.maxSun, state.sun', '(state.noSunCap ? state.sun : Math.min(state.maxSun, state.sun');
  source = source.replace('Math.min(prev.maxSun, prev.sun + orb.amount)', '(prev.noSunCap ? prev.sun + orb.amount : Math.min(prev.maxSun, prev.sun + orb.amount))');
  source = source.replace('Math.min(prev.maxSun, prev.sun + refund)', '(prev.noSunCap ? prev.sun + refund : Math.min(prev.maxSun, prev.sun + refund))');
  source = source.replaceAll('Math.min(s.maxSun, sun + 25)', '(s.noSunCap ? sun + 25 : Math.min(s.maxSun, sun + 25))');
  source = source.replaceAll('Math.min(s.maxSun, sun + 250)', '(s.noSunCap ? sun + 250 : Math.min(s.maxSun, sun + 250))');
  source = source.replace('Math.min(next.maxSun, next.sun + 250)', '(next.noSunCap ? next.sun + 250 : Math.min(next.maxSun, next.sun + 250))');

  return source;
};
