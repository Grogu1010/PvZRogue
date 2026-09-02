window.__patchPvZRogueFirePeaResistanceFix = function patchPvZRogueFirePeaResistanceFix(source) {
  const replaceIfPresent = (from, to) => { if (source.includes(from)) source = source.replace(from, to); };

  replaceIfPresent(
    '  viscoelastic: { name: "Viscoelastic Zombie", icon: "🫧", points: 10, hp: 1250, speed: 6.2, damage: 72, unlock: 7, flying: false, heavy: true },',
    '  viscoelastic: { name: "Viscoelastic Zombie", icon: "🫧", points: 10, hp: 1250, speed: 6.2, damage: 72, unlock: 7, flying: false, heavy: true, fireproof: true, explosionProof: true },'
  );
  replaceIfPresent(
    '  coolbrainz: { name: "Mr Cool-Brainz", icon: "🧊", points: 40, hp: 9000, speed: 1.45, damage: 145, unlock: 25, flying: false, heavy: true, boss: true, immovable: true, fireproof: true, explosionProof: true, lanesTall: 3 },',
    '  coolbrainz: { name: "Mr Cool-Brainz", icon: "🧊", points: 40, hp: 9000, speed: 1.45, damage: 145, unlock: 25, flying: false, heavy: true, boss: true, immovable: true, fireWeakness: 1.7, lanesTall: 3 },'
  );

  replaceIfPresent(
    '  viscoelastic: { does: "Viscoelastic armor absorbs and reflects concentrated impact and energy attacks.", weak: ["Peashooter", "Cabbage Pult", "Snapdragon"], strong: ["Laser Bean", "Bonk Choy", "Pineapple Puncher"] },',
    '  viscoelastic: { does: "Viscoelastic armor absorbs and reflects concentrated impact and energy attacks. It is completely fireproof and explosion-proof.", weak: ["Peashooter", "Cabbage Pult", "Spikeweed"], strong: ["Fire plants", "Explosions", "Energy / impact attacks"] },'
  );
  replaceIfPresent(
    '  coolbrainz: { does: "COUNT 25 BOSS. Three lanes tall and immune to knockback. After 10 seconds he freeze-rays one of his occupied lanes, then freezes one random plant every 5 seconds. Frozen plants cannot act and zombies walk through them. Killing him shatters every ice block.", weak: ["Snapdragon thawing", "Fire Peashooter thawing", "Torchwood thawing"], strong: ["Explosions", "Knockback", "Fire damage"] },',
    '  coolbrainz: { does: "COUNT 25 BOSS. Three lanes tall and immune to knockback. After 10 seconds he freeze-rays one occupied lane, then freezes one random plant every 5 seconds. Frozen plants cannot act and zombies walk through them. Killing him shatters every ice block. Fire attacks deal 1.7x damage to him.", weak: ["Fire Peashooter (1.7x)", "Snapdragon (1.7x)", "Torchwood support"], strong: ["Knockback", "Frozen plants", "Slow setups"] },'
  );

  replaceIfPresent(
    '        if (target.type === "coolbrainz" && (pr.fire || pr.source === "firepeashooter")) { pr.pierce = 0; if (DEVICE_TIER !== "ultra") floaties.push({id:makeId("fireproof"),text:"FIREPROOF",x:target.x,y:target.row*CELL_H+8,life:.5}); continue; }',
    '        if (target.type === "viscoelastic" && (pr.fire || pr.source === "firepeashooter")) { pr.pierce = 0; if (DEVICE_TIER !== "ultra") floaties.push({id:makeId("fireproof"),text:"FIREPROOF",x:target.x,y:target.row*CELL_H+8,life:.5}); continue; }\n        if (target.type === "coolbrainz" && (pr.fire || pr.source === "firepeashooter")) { target.hp -= pr.damage * 0.7; if (DEVICE_TIER !== "ultra") floaties.push({id:makeId("fireweak"),text:"🔥 1.7x",x:target.x,y:target.row*CELL_H+8,life:.45}); }'
  );

  replaceIfPresent(
    'if (Math.abs(z.row - p.row) <= rad && Math.abs(zCol - p.col) <= rad && z.type !== "coolbrainz") z.hp -= (stats.damage || 3600) * (z.type === "gargantuar" ? (stats.gargBonus || 1.25) : 1);',
    'if (Math.abs(z.row - p.row) <= rad && Math.abs(zCol - p.col) <= rad && z.type !== "viscoelastic") z.hp -= (stats.damage || 3600) * (z.type === "gargantuar" ? (stats.gargBonus || 1.25) : 1);'
  );
  replaceIfPresent(
    'if (z.type !== "coolbrainz") z.hp -= stats.damage;\n            if (stats.mods.scorchSlow && z.type !== "coolbrainz")',
    'if (z.type !== "viscoelastic") z.hp -= stats.damage * (z.type === "coolbrainz" ? 1.7 : 1);\n            if (stats.mods.scorchSlow && z.type !== "viscoelastic")'
  );
  replaceIfPresent(
    'if (stats.mods.burnDps && z.type !== "coolbrainz") z.poison = Math.max(z.poison, stats.mods.burnDps);',
    'if (stats.mods.burnDps && z.type !== "viscoelastic") z.poison = Math.max(z.poison, stats.mods.burnDps * (z.type === "coolbrainz" ? 1.7 : 1));'
  );

  const spriteAnchor = 'function PlantSprite({ type, action = "idle", small = false, mods = null }) {';
  if (source.includes(spriteAnchor) && !source.includes('function FirePeashooterSprite(')) {
    const sprite = String.raw`
function FirePeashooterSprite({ action = "idle", small = false }) {
  const attacking = action === "attack";
  return (
    <SpriteFrame small={small} action={attacking ? "attack" : "idle"}>
      <LeafShadow />
      <defs>
        <radialGradient id="firePeaHead" cx="35%" cy="28%" r="78%"><stop offset="0" stopColor="#ffd76a"/><stop offset=".48" stopColor="#ff7b2e"/><stop offset="1" stopColor="#c53b16"/></radialGradient>
        <linearGradient id="firePeaStem" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7bd34f"/><stop offset="1" stopColor="#287232"/></linearGradient>
        <linearGradient id="firePeaLeaf" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#a0ed68"/><stop offset="1" stopColor="#33853c"/></linearGradient>
      </defs>
      <motion.g animate={attacking ? {y:[0,-2,0],rotate:[0,-2.5,0,2,0]} : {y:[0,-1,0],rotate:[0,1.2,0,-1.2,0]}} transition={{duration:attacking?.34:1.8,repeat:Infinity,ease:"easeInOut"}} style={{transformOrigin:"31px 39px"}}>
        <path d="M31 58 C28 48 29 39 33 31 C37 23 41 19 45 16" fill="none" stroke="url(#firePeaStem)" strokeWidth="6" strokeLinecap="round"/>
        <path d="M11 57 C18 49 27 49 34 56 C25 63 17 63 11 57 Z" fill="url(#firePeaLeaf)" stroke="#24652e" strokeWidth="1.6"/>
        <path d="M30 57 C37 49 47 49 54 56 C44 63 36 62 30 57 Z" fill="url(#firePeaLeaf)" stroke="#24652e" strokeWidth="1.6"/>
        <motion.path d="M17 22 C11 17 12 9 18 4 C18 10 24 11 23 17 C23 22 20 24 17 22 Z" fill="#ffb128" stroke="#d94716" strokeWidth="1.5" animate={{scaleY:[1,1.18,.92,1],rotate:[-2,3,-2]}} transition={{duration:.55,repeat:Infinity}} style={{transformOrigin:"18px 20px"}}/>
        <ellipse cx="33" cy="28" rx="17" ry="15" fill="url(#firePeaHead)" stroke="#8d2d14" strokeWidth="2.2"/>
        <motion.g animate={attacking ? {x:[0,4,0],scaleX:[1,1.07,1]} : {x:[0,.7,0]}} transition={{duration:attacking?.19:1.3,repeat:Infinity}} style={{transformOrigin:"48px 28px"}}>
          <ellipse cx="48" cy="28" rx="13" ry="10" fill="url(#firePeaHead)" stroke="#8d2d14" strokeWidth="2.2"/>
          <ellipse cx="56" cy="28" rx="5.2" ry="3.8" fill="#6a1e10"/><ellipse cx="56" cy="28" rx="2.5" ry="1.8" fill="#2f0e08"/>
          <motion.g animate={attacking ? {scale:[.8,1.35,.85],x:[0,5,0]} : {scale:[.9,1.05,.9]}} transition={{duration:attacking?.2:.75,repeat:Infinity}} style={{transformOrigin:"63px 28px"}}><path d="M60 28 C64 23 70 23 73 28 C70 33 64 33 60 28 Z" fill="#ffd85f"/><path d="M62 28 C65 25 69 25 71 28 C69 31 65 31 62 28 Z" fill="#ff5a1f"/></motion.g>
        </motion.g>
        <path d="M23 22 Q30 18 36 22" stroke="#692418" strokeWidth="2.3" fill="none" strokeLinecap="round"/><ellipse cx="31" cy="25" rx="4.5" ry="5.5" fill="#fff1cf"/><ellipse cx="31.8" cy="25.4" rx="1.7" ry="2.5" fill="#23130e"/><circle cx="30.3" cy="23.5" r=".8" fill="#fff"/>
        <circle cx="21" cy="33" r="1.4" fill="#ffd55b"/><circle cx="39" cy="17" r="1.2" fill="#ffd55b"/>
      </motion.g>
    </SpriteFrame>
  );
}
`;
    source = source.replace(spriteAnchor, sprite + '\n' + spriteAnchor + '\n  if (type === "firepeashooter") return <FirePeashooterSprite action={action} small={small} />;');
  }

  return source;
};
