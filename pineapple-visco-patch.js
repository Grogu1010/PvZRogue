window.__patchPvZRoguePineappleVisco = function patchPvZRoguePineappleVisco(source) {
  function replaceRequired(from, to, label) {
    if (!source.includes(from)) throw new Error(`Pineapple/Visco patch could not find ${label}.`);
    source = source.replace(from, to);
  }

  replaceRequired(
    '  vadervine: { name: "Vader Vine", icon: "🌑", cost: 225, hp: 520, kind: "melee", damage: 92, punchRate: 1.25, saber: true },\n};',
    '  vadervine: { name: "Vader Vine", icon: "🌑", cost: 225, hp: 520, kind: "melee", damage: 92, punchRate: 1.25, saber: true },\n  pineapplepuncher: { name: "Pineapple Puncher", icon: "🍍", cost: 400, hp: 1625, kind: "pineapple", damage: 6000, punchCd: 7, radius: 1 },\n};',
    'Pineapple Puncher definition'
  );

  replaceRequired(
    '  gargantuar: { name: "Gargantuar", icon: "🗿", points: 15, hp: 1850, speed: 3.2, damage: 180, unlock: 8, flying: false },\n};',
    '  gargantuar: { name: "Gargantuar", icon: "🗿", points: 15, hp: 1850, speed: 3.2, damage: 180, unlock: 8, flying: false },\n  viscoelastic: { name: "Viscoelastic Zombie", icon: "🫧", points: 10, hp: 1250, speed: 6.2, damage: 72, unlock: 7, flying: false, heavy: true },\n};',
    'Viscoelastic Zombie definition'
  );

  replaceRequired(
    '  vadervine: [\n    ["Sith Training", "+35% saber damage", p => ({ ...p, damageMult: (p.damageMult || 1) * 1.35 })],\n    ["Faster Swings", "+30% attack speed", p => ({ ...p, punchRateMult: (p.punchRateMult || 1) * 1.3 })],\n    ["Dark Armor", "+180 HP", p => ({ ...p, hpFlat: (p.hpFlat || 0) + 180 })],\n    ["Force Push", "Lightsaber hits shove zombies backward", p => ({ ...p, forcePush: true })],\n    ["Force Choke", "Lightsaber hits briefly stun zombies", p => ({ ...p, forceChoke: true })],\n    ["Sith Sweep", "Attacks can reach adjacent lanes", p => ({ ...p, crossLane: true })],\n    ["Deflection", "Attackers take 18 damage", p => ({ ...p, thorns: (p.thorns || 0) + 18 })],\n    ["Unlimited Power", "+25% damage and attack speed", p => ({ ...p, damageMult: (p.damageMult || 1) * 1.25, punchRateMult: (p.punchRateMult || 1) * 1.25 })],\n  ],\n};',
`  vadervine: [
    ["Sith Training", "+35% saber damage", p => ({ ...p, damageMult: (p.damageMult || 1) * 1.35 })],
    ["Faster Swings", "+30% attack speed", p => ({ ...p, punchRateMult: (p.punchRateMult || 1) * 1.3 })],
    ["Dark Armor", "+180 HP", p => ({ ...p, hpFlat: (p.hpFlat || 0) + 180 })],
    ["Force Push", "Lightsaber hits shove zombies backward", p => ({ ...p, forcePush: true })],
    ["Force Choke", "Lightsaber hits briefly stun zombies", p => ({ ...p, forceChoke: true })],
    ["Sith Sweep", "Attacks can reach adjacent lanes", p => ({ ...p, crossLane: true })],
    ["Deflection", "Attackers take 18 damage", p => ({ ...p, thorns: (p.thorns || 0) + 18 })],
    ["Unlimited Power", "+25% damage and attack speed", p => ({ ...p, damageMult: (p.damageMult || 1) * 1.25, punchRateMult: (p.punchRateMult || 1) * 1.25 })],
  ],
  pineapplepuncher: [
    ["Brass Knuckles", "+35% Skull Crushing Punch damage", p => ({ ...p, damageMult: (p.damageMult || 1) * 1.35 })],
    ["Dense Crown", "+35% health", p => ({ ...p, hpMult: (p.hpMult || 1) * 1.35 })],
    ["Short Temper", "Punch cooldown drops from 7s to about 5.5s", p => ({ ...p, punchCdMult: (p.punchCdMult || 1) * 0.78 })],
    ["Hydraulic Roots", "Normal zombies are knocked back 1 extra tile", p => ({ ...p, knockbackFlat: (p.knockbackFlat || 0) + 1 })],
    ["Garg Juggler", "Gargantuars are knocked back 3 tiles instead of 2", p => ({ ...p, gargKnockbackFlat: (p.gargKnockbackFlat || 0) + 1 })],
    ["BOGOF", "Every second Pineapple Puncher you place is free", p => ({ ...p, bogof: true })],
    ["Aftershock", "Punches stagger nearby zombies for 0.7s", p => ({ ...p, aftershockStun: true })],
    ["Fault Line", "Punches also deal 35% damage to zombies directly behind the target", p => ({ ...p, faultLine: true })],
    ["3x3 Earthquake", "Epic: every punch erupts a 3x3 quake for 55% punch damage", p => ({ ...p, earthquake: true })],
    ["One Punch Fruit", "Epic: instantly destroys the strongest non-Gargantuar zombie type", p => ({ ...p, infiniteCrusher: true })],
  ],
};`,
    'Pineapple Puncher buff pool'
  );

  replaceRequired(
    '  const rarity = item.type === "debuff" ? "Legendary" : rarityForBuff(item.name);',
    '  const rarity = item.type === "debuff" ? "Legendary" : item.name === "BOGOF" ? "Legendary" : (item.name === "3x3 Earthquake" || item.name === "One Punch Fruit") ? "Epic" : rarityForBuff(item.name);',
    'Pineapple buff rarities'
  );

  replaceRequired(
`function cardCost(type, state) {
  let cost = applyPlantStats(type, state.plantMods, state).cost;
  if (state.packetPrinter && (state.plantsPlaced + 1) % 3 === 0) cost = Math.max(0, cost - 25);
  return cost;
}`,
`function cardCost(type, state) {
  let cost = applyPlantStats(type, state.plantMods, state).cost;
  if (type === "pineapplepuncher" && (state.plantMods.pineapplepuncher || {}).bogof && ((state.pineapplePlaced || 0) + 1) % 2 === 0) cost = 0;
  if (state.packetPrinter && (state.plantsPlaced + 1) % 3 === 0) cost = Math.max(0, cost - 25);
  return cost;
}`,
    'BOGOF card cost'
  );

  replaceRequired(
    '      return { ...prev, sun: prev.sun - cost, plants, plantsPlaced: prev.plantsPlaced + 1 };',
    '      return { ...prev, sun: prev.sun - cost, plants, plantsPlaced: prev.plantsPlaced + 1, pineapplePlaced: (prev.pineapplePlaced || 0) + (prev.selected === "pineapplepuncher" ? 1 : 0) };',
    'Pineapple placement counter'
  );

  replaceRequired(
`          target.hp -= stats.damage * surge;
          if (stats.mods.forcePush) target.x += 34;
          if (stats.mods.forceChoke) target.stun = Math.max(target.stun, 0.7);
          next.cd = (1 / stats.punchRate) * s.cooldownMult;`,
`          const viscoReflectsMelee = target.type === "viscoelastic" && (next.type === "bonkchoy" || next.type === "vadervine");
          if (viscoReflectsMelee) {
            target.hp -= stats.damage * surge * 0.2;
            next.hp -= stats.damage * surge * 0.5;
            if (DEVICE_TIER !== "ultra") floaties.push({ id: makeId("viscoReflect"), text: "↩ REFLECT", x: target.x, y: target.row * CELL_H + 10, life: 0.55 });
          } else {
            target.hp -= stats.damage * surge;
            if (stats.mods.forcePush) target.x += 34;
            if (stats.mods.forceChoke) target.stun = Math.max(target.stun, 0.7);
          }
          next.cd = (1 / stats.punchRate) * s.cooldownMult;`,
    'Viscoelastic melee reflection'
  );

  replaceRequired(
    '      if (stats.kind === "chomper" && next.cd <= 0) {',
`      if (stats.kind === "pineapple" && next.cd <= 0) {
        const punchOriginX = next.col * CELL_W + CELL_W / 2;
        const target = zombies
          .filter(z => !z.flying && z.row === next.row && z.x >= punchOriginX - 8 && z.x <= punchOriginX + CELL_W * (stats.radius || 1) + 28)
          .sort((a,b) => a.x - b.x)[0];
        if (target) {
          const strongestNonGarg = Object.entries(zombieDefs)
            .filter(([type]) => type !== "gargantuar")
            .sort((a,b) => (b[1].hp || 0) - (a[1].hp || 0))[0]?.[0];
          const infiniteHit = stats.mods.infiniteCrusher && target.type === strongestNonGarg;
          const visco = target.type === "viscoelastic";
          const baseDamage = stats.damage;
          if (infiniteHit) {
            target.hp = -1e15;
            if (DEVICE_TIER !== "ultra") floaties.push({ id: makeId("onePunch"), text: "∞ DAMAGE", x: target.x, y: target.row * CELL_H + 4, life: 0.8 });
          } else if (visco) {
            target.hp -= baseDamage * 0.1;
            next.hp -= baseDamage * 0.35;
            if (DEVICE_TIER !== "ultra") floaties.push({ id: makeId("viscoPunch"), text: "BOING ↩", x: target.x, y: target.row * CELL_H + 4, life: 0.75 });
          } else {
            target.hp -= baseDamage;
            const heavy = target.type === "gargantuar" || zombieDefs[target.type]?.heavy;
            const tiles = heavy ? 2 + (target.type === "gargantuar" ? (stats.mods.gargKnockbackFlat || 0) : 0) : 4 + (stats.mods.knockbackFlat || 0);
            target.x += CELL_W * tiles;
          }

          if (stats.mods.faultLine) {
            zombies.forEach(z => {
              if (z.id !== target.id && z.row === target.row && z.x > target.x && z.x < target.x + CELL_W * 1.5) {
                z.hp -= baseDamage * (z.type === "viscoelastic" ? 0.08 : 0.35);
              }
            });
          }

          if (stats.mods.earthquake) {
            const centerCol = Math.floor(target.x / CELL_W);
            zombies.forEach(z => {
              const zCol = Math.floor(z.x / CELL_W);
              if (Math.abs(z.row - target.row) <= 1 && Math.abs(zCol - centerCol) <= 1 && z.id !== target.id) {
                z.hp -= baseDamage * (z.type === "viscoelastic" ? 0.1 : 0.55);
                if (z.type !== "viscoelastic") z.x += CELL_W;
              }
            });
            if (DEVICE_TIER !== "ultra") floaties.push({ id: makeId("quake"), text: "💥 3x3 QUAKE", x: punchOriginX, y: next.row * CELL_H - 4, life: 0.65 });
          }

          if (stats.mods.aftershockStun) {
            zombies.forEach(z => {
              if (Math.abs(z.row - next.row) <= 1 && Math.abs(z.x - target.x) <= CELL_W * 1.5 && z.type !== "viscoelastic") z.stun = Math.max(z.stun, 0.7);
            });
          }

          next.cd = (stats.punchCd || 7) * (stats.mods.punchCdMult || 1) * s.cooldownMult;
          if (DEVICE_TIER !== "ultra") floaties.push({ id: makeId("skullPunch"), text: "💀 SKULL CRUSH", x: target.x, y: target.row * CELL_H + 18, life: 0.55 });
        }
      }

      if (stats.kind === "chomper" && next.cd <= 0) {`,
    'Pineapple Puncher combat'
  );

  replaceRequired(
    '        target.hp -= pr.damage * (target.flying ? pr.airMult : 1) * (targetMods.damageTaken || 1);',
`        const viscoReflectsBeam = target.type === "viscoelastic" && pr.source === "laserbean";
        if (viscoReflectsBeam) {
          target.hp -= pr.damage * 0.12 * (targetMods.damageTaken || 1);
          const sourcePlant = plants.filter(p => p.type === "laserbean" && p.row === pr.row && p.hp > 0).sort((a,b) => b.col - a.col)[0];
          if (sourcePlant) sourcePlant.hp -= pr.damage * 0.4;
          pr.pierce = 1;
          if (DEVICE_TIER !== "ultra") floaties.push({ id: makeId("beamReflect"), text: "↩ BEAM", x: target.x, y: target.row * CELL_H + 8, life: 0.5 });
        } else {
          target.hp -= pr.damage * (target.flying ? pr.airMult : 1) * (targetMods.damageTaken || 1);
        }`,
    'Viscoelastic Laser Bean reflection'
  );

  const pineappleSprite = String.raw`
function PineapplePuncherSprite({ action = "idle", small = false }) {
  const punching = action === "attack";
  return (
    <SpriteFrame small={small} action={punching ? "attack" : "idle"}>
      <LeafShadow />
      <defs>
        <radialGradient id="ppFruit" cx="35%" cy="25%" r="78%"><stop offset="0" stopColor="#fff082"/><stop offset=".48" stopColor="#f4bd32"/><stop offset="1" stopColor="#be681f"/></radialGradient>
        <linearGradient id="ppLeaf" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#8de05f"/><stop offset="1" stopColor="#2e7d36"/></linearGradient>
        <radialGradient id="ppGlove" cx="35%" cy="25%" r="75%"><stop offset="0" stopColor="#ff8277"/><stop offset=".55" stopColor="#df3737"/><stop offset="1" stopColor="#8b181d"/></radialGradient>
      </defs>
      <path d="M19 17 L14 4 L25 11 L26 -1 L33 10 L40 0 L39 12 L51 5 L45 18 Z" fill="url(#ppLeaf)" stroke="#235f31" strokeWidth="2"/>
      <path d="M18 20 C10 28 11 46 20 57 C27 63 41 62 48 54 C56 44 54 27 45 20 C38 15 25 15 18 20 Z" fill="url(#ppFruit)" stroke="#8f4d1e" strokeWidth="2.5"/>
      <path d="M18 28 L46 49 M15 38 L39 59 M27 18 L52 40 M46 22 L19 55 M53 32 L29 59 M37 17 L14 45" stroke="#a96623" strokeWidth="1.5" opacity=".6"/>
      <path d="M20 31 Q27 25 33 30" stroke="#553319" strokeWidth="2.7" fill="none" strokeLinecap="round"/><ellipse cx="27" cy="33" rx="2.3" ry="3.4" fill="#25180f"/>
      <path d="M31 47 C36 50 40 49 44 45" stroke="#59351b" strokeWidth="2.4" fill="none" strokeLinecap="round"/>
      <path d="M19 57 C12 54 7 57 6 62 C13 64 20 62 25 59 Z M43 57 C49 53 57 56 59 62 C52 64 45 62 39 59 Z" fill="#4a9e45" stroke="#266b32" strokeWidth="1.8"/>
      <motion.g animate={punching ? { x: [0, 19, -3, 0], rotate: [0, -8, 4, 0] } : { x: [0, 1, 0] }} transition={{ duration: punching ? .24 : 1.35, repeat: Infinity, ease: "easeInOut" }} style={{ transformOrigin: "44px 40px" }}>
        <path d="M42 40 C47 39 50 40 53 43" stroke="#5f963f" strokeWidth="5" fill="none" strokeLinecap="round"/>
        <path d="M49 35 C58 31 65 36 64 44 C63 51 54 53 48 48 C45 44 46 39 49 35 Z" fill="url(#ppGlove)" stroke="#74141a" strokeWidth="2"/>
        <path d="M52 36 C52 31 57 29 60 33 M57 36 C58 31 63 31 64 36" fill="none" stroke="#ff9b91" strokeWidth="1.5" strokeLinecap="round"/>
      </motion.g>
    </SpriteFrame>
  );
}
`;

  replaceRequired(
    'function PlantSprite({ type, action = "idle", small = false }) {',
    pineappleSprite + '\nfunction PlantSprite({ type, action = "idle", small = false }) {\n  if (type === "pineapplepuncher") return <PineapplePuncherSprite action={action} small={small} />;',
    'Pineapple Puncher sprite hook'
  );

  replaceRequired(
    '        {type === "buckethead" && !armorGone && (',
`        {type === "viscoelastic" && (
          <motion.g animate={LOW_SPEC ? undefined : { scale: [1, 1.025, 1], opacity: [.9, 1, .9] }} transition={{ duration: 1.1, repeat: Infinity }} style={{ transformOrigin: "34px 30px" }}>
            <path d="M13 11 C20 1 49 0 57 12 C64 23 60 47 52 57 C42 64 22 63 13 53 C6 42 5 23 13 11 Z" fill="#8a5bd8" fillOpacity=".42" stroke="#c7a9ff" strokeWidth="3"/>
            <path d="M16 19 C26 12 42 12 54 18 M13 37 C24 43 45 43 58 35" fill="none" stroke="#e8dcff" strokeWidth="2" opacity=".55"/>
            <circle cx="20" cy="27" r="3" fill="#f2eaff" opacity=".5"/><circle cx="51" cy="45" r="4" fill="#d8c4ff" opacity=".4"/>
          </motion.g>
        )}

        {type === "buckethead" && !armorGone && (`,
    'Viscoelastic armor sprite'
  );

  return source;
};
