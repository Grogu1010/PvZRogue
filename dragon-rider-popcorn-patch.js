window.__patchPvZRogueDragonRiderPopcorn = function patchPvZRogueDragonRiderPopcorn(source) {
  function req(from, to, label) {
    if (!source.includes(from)) throw new Error(`Dragon Rider/Popping Corn patch could not find ${label}.`);
    source = source.replace(from, to);
  }

  req(
    '  firepeashooter: { name: "Fire Peashooter", icon: "🔥", cost: 175, hp: 310, kind: "shooter", damage: 38, fireRate: 1.28, firePlant: true },\n};',
    '  firepeashooter: { name: "Fire Peashooter", icon: "🔥", cost: 175, hp: 310, kind: "shooter", damage: 38, fireRate: 1.28, firePlant: true },\n  poppingcornkernel: { name: "Popping Corn Kernel", icon: "🌽", cost: 125, hp: 300, kind: "airtrap", damage: 3000, fireRate: 1.0, airOnly: true },\n};',
    'Popping Corn Kernel definition'
  );

  req(
    '  coolbrainz: { name: "Mr Cool-Brainz", icon: "🧊", points: 40, hp: 430000, speed: 1.45, damage: 1200, unlock: 25, flying: false, heavy: true, boss: true, immovable: true, noScale: true, fireWeakness: 1.7, lanesTall: 3 },\n};',
    '  coolbrainz: { name: "Mr Cool-Brainz", icon: "🧊", points: 40, hp: 430000, speed: 1.45, damage: 1200, unlock: 25, flying: false, heavy: true, boss: true, immovable: true, noScale: true, fireWeakness: 1.7, lanesTall: 3 },\n  dragonrider: { name: "Dragon Rider Zombie", icon: "🐉", points: 8, hp: 1000, speed: 22, damage: 55, unlock: 6, flying: true, heavy: true, dragonMount: true },\n};',
    'Dragon Rider definition'
  );

  const globalAnchor = 'const globalBuffs = [';
  if (!source.includes(globalAnchor)) throw new Error('Dragon Rider/Popping Corn patch could not find global buff anchor.');
  source = source.replace(globalAnchor, `plantBuffs.poppingcornkernel = [
  ["Bigger Pop", "+35% pop damage", p => ({ ...p, damageMult: (p.damageMult || 1) * 1.35 })],
  ["Hair Trigger", "+30% reset speed", p => ({ ...p, fireRateMult: (p.fireRateMult || 1) * 1.3 })],
  ["Cheap Cob", "Cost -25 sun", p => ({ ...p, costFlat: (p.costFlat || 0) - 25 })],
  ["Thick Husk", "+150 HP", p => ({ ...p, hpFlat: (p.hpFlat || 0) + 150 })],
  ["Kettle Pop", "+50% pop damage", p => ({ ...p, damageMult: (p.damageMult || 1) * 1.5 })],
  ["Rapid Heat", "+45% reset speed", p => ({ ...p, fireRateMult: (p.fireRateMult || 1) * 1.45 })],
  ["Armored Cob", "+30% HP", p => ({ ...p, hpMult: (p.hpMult || 1) * 1.3 })],
  ["Sky Mine", "+75% pop damage", p => ({ ...p, damageMult: (p.damageMult || 1) * 1.75 })],
  ["Butter Salt", "Pop briefly stuns airborne targets", p => ({ ...p, airStun: Math.max(p.airStun || 0, 1.25) })],
  ["Popcorn Cannon", "+100% damage and +25% reset speed", p => ({ ...p, damageMult: (p.damageMult || 1) * 2, fireRateMult: (p.fireRateMult || 1) * 1.25 })],
];

${globalAnchor}`);

  const repeatAnchor = 'const REPEATABLE_BUFF_NAMES = new Set([';
  if (!source.includes(repeatAnchor)) throw new Error('Dragon Rider/Popping Corn patch could not find debuff anchor.');
  source = source.replace(repeatAnchor, `zombieDebuffs.dragonrider = [
  ["Dragon Only", "No rider. The dragon has only its scaled 820/1000 HP share and leaves no grounded zombie behind.", d => ({ ...d, dragonrider: { ...d.dragonrider, hp: d.dragonrider.hp * 0.82, dragonOnly: true } })],
  ["Scared Dragon", "Dragon Riders fly 35% slower and their fire breath deals 35% less damage.", d => ({ ...d, dragonrider: { ...d.dragonrider, speed: d.dragonrider.speed * 0.65, damage: d.dragonrider.damage * 0.65 } })],
];

${repeatAnchor}`);

  const firePeaMythic = '  firepeashooter: { name:"Supernova Pea", desc:"Fire Peashooter gets 6x damage, 3x fire rate and +6 pierce.", mod:p=>({...p,damageMult:(p.damageMult||1)*6,fireRateMult:(p.fireRateMult||1)*3,pierce:(p.pierce||1)+6}) },';
  if (source.includes(firePeaMythic)) source = source.replace(firePeaMythic, firePeaMythic + '\n  poppingcornkernel: { name:"No-Fly Zone", desc:"Popping Corn deals 5x damage, resets 4x faster, and can pop airborne enemies one lane above or below too.", mod:p=>({...p,damageMult:(p.damageMult||1)*5,fireRateMult:(p.fireRateMult||1)*4,airLaneRadius:1}) },');

  source = source.replace(
    '  balloon: { does: "Flies over ordinary blockers unless grounded or hit by anti-air plants.", weak: ["Cactus", "Cabbage Pult", "Laser Bean"], strong: ["Wall Nut", "Spikeweed", "Bonk Choy"] },',
    '  balloon: { does: "Flies over ordinary blockers unless grounded or hit by anti-air plants. Popping Corn Kernel can pop it directly overhead and force a surviving Balloon Zombie down into a Basic Zombie.", weak: ["Popping Corn Kernel", "Cactus", "Cabbage Pult"], strong: ["Wall Nut", "Spikeweed", "Bonk Choy"] },'
  );
  const coolIntel = '  coolbrainz: { does: "COUNT 25 BOSS. Three lanes tall, immune to knockback, and exempt from normal zombie scaling. After 10 seconds he freeze-rays one occupied lane, then freezes one random plant every 5 seconds. Frozen plants cannot act and zombies walk through them. Killing him shatters every ice block. Fire attacks deal 1.7x damage to him.", weak: ["Fire Peashooter (1.7x)", "Snapdragon (1.7x)", "Torchwood-supported fire"], strong: ["Knockback", "Frozen plants", "Slow setups"] },';
  if (source.includes(coolIntel)) source = source.replace(coolIntel, '  dragonrider: { does: "Fast airborne rider on a fire-breathing dragon. The dragon is the first 82% of its scaled HP (820 of 1000 base); after that scaled dragon HP is destroyed, the surviving rider falls as a Basic Zombie. Popping Corn Kernel can blast the mount away if the hit does not kill the whole unit.", weak: ["Popping Corn Kernel", "Cactus", "Laser Bean"], strong: ["Ground-only plants", "Wall Nut", "Backline sun producers"] },\n' + coolIntel);

  source = source.replace('  const unlocked = Object.entries(zombieDefs).filter(([, z]) => z.unlock <= state.buffCount);', '  const unlocked = Object.entries(zombieDefs).filter(([, z]) => z.unlock <= state.buffCount && !z.boss);');
  source = source.replace('    throwCd: type === "gargantuar" ? 7 + Math.random() * 3 : 0,', '    throwCd: type === "gargantuar" ? 7 + Math.random() * 3 : 0,\n    dragonFireCd: type === "dragonrider" ? 1.2 + Math.random() * 1.2 : 0,');

  const shooterAnchor = '      if ((stats.kind === "shooter" || stats.kind === "lobber") && next.cd <= 0) {';
  if (!source.includes(shooterAnchor)) throw new Error('Dragon Rider/Popping Corn patch could not find attack loop.');
  source = source.replace(shooterAnchor, `      if (stats.kind === "airtrap" && next.cd <= 0) {
        const laneRadius = stats.mods.airLaneRadius || 0;
        const left = next.col * CELL_W + 2;
        const right = (next.col + 1) * CELL_W - 2;
        const target = zombies.filter(z => z.flying && Math.abs(z.row-next.row) <= laneRadius && z.x >= left && z.x <= right).sort((a,b)=>Math.abs(a.row-next.row)-Math.abs(b.row-next.row) || a.x-b.x)[0];
        if (target) {
          target.hp -= stats.damage;
          if (stats.mods.airStun) target.stun = Math.max(target.stun || 0, stats.mods.airStun);
          if (target.hp > 0 && target.type === "dragonrider") target.forceDismount = true;
          if (target.hp > 0 && target.type === "balloon") target.forcePop = true;
          next.cd = (1 / Math.max(.1, stats.fireRate || 1)) * s.cooldownMult;
          if (DEVICE_TIER !== "ultra") floaties.push({id:makeId("cornPop"),text:"🍿 POP!",x:next.col*CELL_W+16,y:next.row*CELL_H-8,life:.7});
        }
      }

${shooterAnchor}`);

  const bossAiAnchor = '      if (next.type === "coolbrainz") {';
  if (!source.includes(bossAiAnchor)) throw new Error('Dragon Rider/Popping Corn patch could not find zombie AI loop.');
  source = source.replace(bossAiAnchor, `      if (next.type === "dragonrider") {
        const dragonMods = s.zombieMods.dragonrider || {};
        const riderThreshold = dragonMods.dragonOnly ? 0 : next.maxHp * 0.18;
        if (!dragonMods.dragonOnly && next.hp > 0 && (next.forceDismount || next.hp <= riderThreshold)) {
          const basicStats = applyZombieStats("basic", s);
          next.type = "basic"; next.flying = false; next.groundedAir = false;
          next.speed = basicStats.speed; next.damage = basicStats.damage;
          next.maxHp = Math.max(1, riderThreshold); next.hp = Math.min(next.hp, next.maxHp); next.forceDismount = false;
          if (DEVICE_TIER !== "ultra") floaties.push({id:makeId("dismount"),text:"🐉 RIDER DOWN!",x:next.x-22,y:next.row*CELL_H+2,life:.9});
        } else if (next.hp > 0) {
          next.dragonFireCd = Math.max(0,(next.dragonFireCd||0)-dt);
          if (next.dragonFireCd <= 0) {
            const fireTarget = plants.filter(p=>p.hp>0 && p.row===next.row && p.col*CELL_W+24<next.x && next.x-(p.col*CELL_W+24)<=CELL_W*4).sort((a,b)=>b.col-a.col)[0];
            if (fireTarget) {
              const breathDamage = next.damage * 1.25;
              fireTarget.hp -= breathDamage;
              plants.forEach(p=>{if(p.id!==fireTarget.id && p.row===fireTarget.row && Math.abs(p.col-fireTarget.col)<=1)p.hp-=breathDamage*.35;});
              next.dragonFireCd = 2.6;
              if (DEVICE_TIER !== "ultra") floaties.push({id:makeId("dragonFire"),text:"🔥 DRAGON FIRE",x:fireTarget.col*CELL_W+8,y:fireTarget.row*CELL_H+5,life:.75});
            }
          }
        }
      }
      if (next.type === "balloon" && next.forcePop && next.hp > 0) {
        const basicStats = applyZombieStats("basic", s);
        next.type = "basic"; next.flying = false; next.groundedAir = false;
        next.speed = basicStats.speed; next.damage = basicStats.damage; next.maxHp = basicStats.hp; next.hp = Math.min(next.hp,next.maxHp); next.forcePop = false;
        if (DEVICE_TIER !== "ultra") floaties.push({id:makeId("balloonPop"),text:"🎈 POPPED!",x:next.x-15,y:next.row*CELL_H+4,life:.75});
      }

${bossAiAnchor}`);

  const plantSpriteAnchor = 'function PlantSprite({ type, action = "idle", small = false, mods = null }) {';
  if (!source.includes(plantSpriteAnchor)) throw new Error('Dragon Rider/Popping Corn patch could not find PlantSprite.');
  const cornArt = String.raw`
function PoppingCornKernelSprite({ action="idle", small=false }) {
  const pop = action === "attack";
  return <SpriteFrame small={small} action={pop?"attack":"idle"}><LeafShadow/><motion.g animate={pop?{y:[0,3,-5,0],scaleY:[1,.9,1.12,1]}:{rotate:[-1,1,-1]}} transition={{duration:pop?.25:1.7,repeat:Infinity}} style={{transformOrigin:"32px 57px"}}>
    <path d="M12 59 C16 40 22 25 31 16 C27 34 28 49 32 59 Z" fill="#4da83b" stroke="#216728" strokeWidth="2"/><path d="M52 59 C48 40 42 25 33 16 C37 34 36 49 32 59 Z" fill="#62bd43" stroke="#216728" strokeWidth="2"/>
    <rect x="23" y="8" width="18" height="45" rx="9" fill="#f4c83f" stroke="#9c6816" strokeWidth="2.2"/>
    {[0,1,2,3,4,5].map(r=><g key={r}>{[0,1,2].map(c=><circle key={c} cx={28+c*4} cy={14+r*6} r="1.7" fill={(r+c)%2?"#ffe96a":"#fff4a0"}/>)}</g>)}
    <path d="M26 9 L32 2 L38 9" fill="#54a93c" stroke="#216728" strokeWidth="1.5"/><circle cx="29" cy="29" r="1.8" fill="#34220d"/><circle cx="35" cy="29" r="1.8" fill="#34220d"/><path d="M29 35 Q32 38 35 35" stroke="#5a3b10" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
    {pop&&<motion.g animate={{y:[0,-26],opacity:[1,0],scale:[.7,1.25]}} transition={{duration:.35,repeat:Infinity}}><circle cx="25" cy="6" r="3" fill="#fff9e8"/><circle cx="33" cy="3" r="3.6" fill="#fff9e8"/><circle cx="41" cy="7" r="2.8" fill="#fff9e8"/></motion.g>}
  </motion.g></SpriteFrame>;
}
`;
  source = source.replace(plantSpriteAnchor, cornArt + '\n' + plantSpriteAnchor + '\n  if (type === "poppingcornkernel") return <PoppingCornKernelSprite action={action} small={small} />;');

  const zombieSpriteAnchor = 'function ZombieSprite({ type, hpPct = 100, action = "walk", noSmash = false, flying = false, groundedAir = false }) {';
  if (!source.includes(zombieSpriteAnchor)) throw new Error('Dragon Rider/Popping Corn patch could not find ZombieSprite.');
  const dragonArt = String.raw`
function DragonRiderZombieSprite() {
  return <svg viewBox="0 0 96 82" className="h-full w-full overflow-visible"><motion.g animate={{y:[0,-3,0,2,0]}} transition={{duration:.7,repeat:Infinity,ease:"easeInOut"}}>
    <ellipse cx="46" cy="73" rx="31" ry="5" fill="#061d13" opacity=".25"/>
    <motion.path d="M37 45 C21 25 6 28 3 40 C15 34 24 42 34 53 Z" fill="#72b84a" stroke="#285f2f" strokeWidth="2.3" animate={{rotate:[-10,11,-10]}} transition={{duration:.34,repeat:Infinity}} style={{transformOrigin:"38px 45px"}}/>
    <motion.path d="M55 45 C73 25 88 28 93 40 C80 34 70 42 59 53 Z" fill="#69aa43" stroke="#285f2f" strokeWidth="2.3" animate={{rotate:[10,-11,10]}} transition={{duration:.34,repeat:Infinity}} style={{transformOrigin:"55px 45px"}}/>
    <path d="M19 50 C28 31 54 29 70 41 C76 47 73 59 63 64 C48 70 28 65 19 57 Z" fill="#57913b" stroke="#25552b" strokeWidth="2.6"/><path d="M66 42 C78 35 89 40 94 48 C89 55 80 55 69 51 Z" fill="#6cac46" stroke="#25552b" strokeWidth="2.3"/><circle cx="84" cy="44" r="2.3" fill="#ffd85c"/><circle cx="84.5" cy="44" r=".8" fill="#2b1708"/>
    <motion.path d="M92 49 C101 45 105 50 110 48 C104 55 100 58 92 53 Z" fill="#ff8b2c" stroke="#d44d17" strokeWidth="1.4" animate={{scaleX:[.7,1.15,.8]}} transition={{duration:.25,repeat:Infinity}} style={{transformOrigin:"92px 51px"}}/>
    <path d="M20 54 L8 61 L15 47" fill="#477c34" stroke="#25552b" strokeWidth="2"/>
    <g transform="translate(38 10)"><path d="M8 14 C5 25 7 34 14 40 L27 38 C31 27 28 18 21 13 Z" fill="#704d38" stroke="#3a291e" strokeWidth="2"/><ellipse cx="17" cy="10" rx="11" ry="10" fill="#79a96b" stroke="#34503a" strokeWidth="2"/><path d="M9 5 C14 0 23 0 28 6" stroke="#ece4c4" strokeWidth="2.5"/><circle cx="14" cy="10" r="1.8" fill="#162019"/><circle cx="21" cy="10" r="1.8" fill="#162019"/><path d="M13 16 Q18 19 23 15" stroke="#263226" strokeWidth="2" fill="none"/><path d="M8 25 L1 31 M26 24 L33 30" stroke="#79a96b" strokeWidth="4" strokeLinecap="round"/></g>
    <path d="M42 51 Q49 47 58 50" stroke="#d5c184" strokeWidth="2.5" fill="none"/>
  </motion.g></svg>;
}
`;
  source = source.replace(zombieSpriteAnchor, dragonArt + '\n' + zombieSpriteAnchor + '\n  if (type === "dragonrider") return <DragonRiderZombieSprite />;');

  source = source.replace('Unlocked zombies: <b>{Object.values(zombieDefs).filter(z => z.unlock <= state.buffCount).length}/6</b>', 'Unlocked zombies: <b>{Object.values(zombieDefs).filter(z => z.unlock <= state.buffCount && !z.boss).length}/{Object.values(zombieDefs).filter(z => !z.boss).length}</b>');
  return source;
};
