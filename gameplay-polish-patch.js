window.__patchPvZRogueGameplay = function patchPvZRogueGameplay(source) {
  function replaceRequired(from, to, label) {
    if (!source.includes(from)) throw new Error(`Gameplay polish patch could not find ${label}.`);
    source = source.replace(from, to);
  }

  replaceRequired(
    '  iceberglettuce: { name: "Iceberg Lettuce", icon: "🧊", cost: 0, hp: 190, kind: "iceberg", freezeRadius: 0, freezeTime: 6 },\n};',
    '  iceberglettuce: { name: "Iceberg Lettuce", icon: "🧊", cost: 0, hp: 190, kind: "iceberg", freezeRadius: 0, freezeTime: 6 },\n  vadervine: { name: "Vader Vine", icon: "🌑", cost: 225, hp: 520, kind: "melee", damage: 92, punchRate: 1.25, saber: true },\n};',
    'Vader Vine plant definition'
  );

  replaceRequired(
    '  iceberglettuce: Array.from({length:15}).map((_,i)=>["Iceberg Buff "+(i+1),"Boost",p=>p]),\n};',
    '  iceberglettuce: Array.from({length:15}).map((_,i)=>["Iceberg Buff "+(i+1),"Boost",p=>p]),\n  vadervine: [\n    ["Sith Training", "+35% saber damage", p => ({ ...p, damageMult: (p.damageMult || 1) * 1.35 })],\n    ["Faster Swings", "+30% attack speed", p => ({ ...p, punchRateMult: (p.punchRateMult || 1) * 1.3 })],\n    ["Dark Armor", "+180 HP", p => ({ ...p, hpFlat: (p.hpFlat || 0) + 180 })],\n    ["Force Push", "Lightsaber hits shove zombies backward", p => ({ ...p, forcePush: true })],\n    ["Force Choke", "Lightsaber hits briefly stun zombies", p => ({ ...p, forceChoke: true })],\n    ["Sith Sweep", "Attacks can reach adjacent lanes", p => ({ ...p, crossLane: true })],\n    ["Deflection", "Attackers take 18 damage", p => ({ ...p, thorns: (p.thorns || 0) + 18 })],\n    ["Unlimited Power", "+25% damage and attack speed", p => ({ ...p, damageMult: (p.damageMult || 1) * 1.25, punchRateMult: (p.punchRateMult || 1) * 1.25 })],\n  ],\n};',
    'Vader Vine buff list'
  );

  source = source.replaceAll('selected: type, shovel: false', 'selected: type');
  source = source.replace(
    'return { ...prev, plants: prev.plants.filter(p => p.id !== existing.id), sun: Math.min(prev.maxSun, prev.sun + refund), shovel: false };',
    'return { ...prev, plants: prev.plants.filter(p => p.id !== existing.id), sun: Math.min(prev.maxSun, prev.sun + refund), shovel: true };'
  );

  replaceRequired(
    '              damage: stats.damage, speed: stats.kind === "lobber" ? 190 : 260, pierce: stats.mods.pierce || 1,',
    '              damage: stats.damage, speed: next.type === "laserbean" ? 760 : (stats.kind === "lobber" ? 190 : 260), pierce: next.type === "laserbean" ? 999 : (stats.mods.pierce || 1),',
    'projectile stats'
  );

  replaceRequired(
    '          target.hp -= stats.damage * surge;\n          next.cd = (1 / stats.punchRate) * s.cooldownMult;',
    '          target.hp -= stats.damage * surge;\n          if (stats.mods.forcePush) target.x += 34;\n          if (stats.mods.forceChoke) target.stun = Math.max(target.stun, 0.7);\n          next.cd = (1 / stats.punchRate) * s.cooldownMult;',
    'melee hit effects'
  );

  replaceRequired(
    '      if (stats.kind === "chomper" && next.cd <= 0) {',
    `      if (stats.kind === "flame" && next.cd <= 0) {
        const reach = (stats.range || 3) * CELL_W;
        const targets = zombies.filter(z => !z.flying && Math.abs(z.row - next.row) <= 1 && z.x > next.col * CELL_W + 20 && z.x < next.col * CELL_W + reach);
        if (targets.length) {
          targets.forEach(z => { z.hp -= stats.damage; });
          floaties.push({ id: makeId("flame"), text: "🔥", x: next.col * CELL_W + 52, y: next.row * CELL_H + 14, life: 0.35 });
          next.cd = (1 / stats.fireRate) * s.cooldownMult;
        }
      }

      if (stats.kind === "iceberg" && next.cd <= 0) {
        const target = zombies.find(z => !z.flying && z.row === next.row && z.x > next.col * CELL_W - 8 && z.x < (next.col + 2) * CELL_W);
        if (target) {
          target.stun = Math.max(target.stun, stats.freezeTime || 6);
          target.slow = Math.max(target.slow, stats.freezeTime || 6);
          floaties.push({ id: makeId("freeze"), text: "❄ FREEZE", x: target.x, y: target.row * CELL_H + 8, life: 0.8 });
          next.hp = 0;
        }
      }

      if (stats.kind === "chomper" && next.cd <= 0) {`,
    'late-plant mechanics insertion'
  );

  replaceRequired(
    '    projectiles = projectiles.map(pr => ({ ...pr, prevX: pr.x, x: pr.x + pr.speed * dt })).filter(pr => pr.x < BOARD_W + 80 && pr.pierce > 0);',
    `    projectiles = projectiles.map(pr => ({ ...pr, prevX: pr.x, x: pr.x + pr.speed * dt })).filter(pr => pr.x < BOARD_W + 80 && pr.pierce > 0);
    for (const pr of projectiles) {
      if (pr.source !== "peashooter" || pr.ignited) continue;
      const torch = plants.find(p => p.type === "torchwood" && p.row === pr.row && p.hp > 0);
      if (!torch) continue;
      const torchX = torch.col * CELL_W + CELL_W / 2;
      const crossed = (pr.prevX ?? pr.x) <= torchX && pr.x >= torchX;
      if (crossed) {
        pr.ignited = true;
        pr.damage *= 1.5;
      }
    }`,
    'Torchwood projectile ignition'
  );

  const vaderSprite = String.raw`
function VaderVineSprite({ action = "idle", small = false }) {
  const attacking = action === "attack" || action === "spin";
  return (
    <SpriteFrame small={small} action={attacking ? "attack" : "idle"}>
      <LeafShadow />
      <defs>
        <linearGradient id="vaderCape" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#232329"/><stop offset="1" stopColor="#050507"/></linearGradient>
        <linearGradient id="vaderMask" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#54545d"/><stop offset="0.35" stopColor="#17171c"/><stop offset="1" stopColor="#050507"/></linearGradient>
        <linearGradient id="vaderStem" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#374a2b"/><stop offset="1" stopColor="#162215"/></linearGradient>
      </defs>
      <path d="M31 59 C28 51 29 43 31 37" stroke="url(#vaderStem)" strokeWidth="7" fill="none" strokeLinecap="round"/>
      <path d="M28 55 C19 49 10 52 7 61 C17 63 25 61 31 57 Z M35 55 C43 49 53 52 57 61 C47 63 39 61 32 57 Z" fill="#26371f" stroke="#10190f" strokeWidth="2"/>
      <path d="M18 56 C14 43 16 28 23 20 C27 16 38 16 43 20 C51 29 52 44 47 57 Z" fill="url(#vaderCape)" stroke="#050507" strokeWidth="2.2"/>
      <path d="M22 22 L27 9 L39 9 L45 22 L41 37 L26 37 Z" fill="url(#vaderMask)" stroke="#050507" strokeWidth="2.2"/>
      <path d="M25 10 L29 4 L37 4 L42 10" fill="#111116" stroke="#050507" strokeWidth="2"/>
      <path d="M27 20 L31 17 L35 20 L39 17 L42 20 L39 25 L28 25 Z" fill="#09090c"/>
      <path d="M31 26 L35 26 L38 34 L28 34 Z" fill="#1f1f25" stroke="#050507" strokeWidth="1.4"/>
      <path d="M29 14 L32 18 L27 18 Z M40 14 L37 18 L42 18 Z" fill="#d93d39" opacity=".8"/>
      <rect x="27" y="39" width="11" height="10" rx="2" fill="#18181d" stroke="#050507" strokeWidth="1.3"/>
      <circle cx="30" cy="42" r="1" fill="#e33"/><circle cx="35" cy="42" r="1" fill="#6cf"/><rect x="29" y="45" width="7" height="1.7" fill="#ddd" opacity=".65"/>
      <motion.g animate={attacking ? { rotate: [-65, 48, -22], x: [0, 5, 0] } : { rotate: [-16, -8, -16] }} transition={{ duration: attacking ? 0.22 : 1.4, repeat: Infinity, ease: "easeInOut" }} style={{ transformOrigin: "42px 43px" }}>
        <path d="M39 44 L47 49" stroke="#34343a" strokeWidth="4" strokeLinecap="round"/>
        <rect x="45" y="46" width="11" height="4" rx="2" fill="#404047" stroke="#111" strokeWidth="1" transform="rotate(24 45 46)"/>
        <path d="M52 48 L69 31" stroke="#ff2d2d" strokeWidth="5.5" strokeLinecap="round" opacity=".3"/>
        <path d="M52 48 L69 31" stroke="#ff3b30" strokeWidth="3" strokeLinecap="round"/>
        <path d="M52 48 L69 31" stroke="#fff" strokeWidth="1" strokeLinecap="round" opacity=".85"/>
      </motion.g>
    </SpriteFrame>
  );
}
`;

  replaceRequired(
    'function PlantSprite({ type, action = "idle", small = false }) {',
    vaderSprite + '\nfunction PlantSprite({ type, action = "idle", small = false }) {\n  if (type === "vadervine") return <VaderVineSprite action={action} small={small} />;',
    'Vader Vine sprite hook'
  );

  const oldProjectile = '{state.projectiles.map(pr => <div key={pr.id} className="pointer-events-none select-none absolute z-40 text-lg" style={{ left: pr.x, top: pr.y }}>{pr.source === "cabbagepult" ? "🥬" : pr.source === "cactus" ? "•" : pr.source === "sunflower" ? "☀️" : "🟢"}</div>)}';
  const newProjectile = `{state.projectiles.map(pr => pr.source === "laserbean" ? (
              <div key={pr.id} className="pointer-events-none absolute z-40" style={{ left: pr.x - 54, top: pr.y + 8, width: 58, height: 5, borderRadius: 999, background: "linear-gradient(90deg, rgba(70,220,255,0), #8ff7ff 28%, #eaffff 72%, #55dfff)", boxShadow: "0 0 8px #72efff" }} />
            ) : pr.source === "cabbagepult" ? (
              <div key={pr.id} className="pointer-events-none select-none absolute z-40 text-lg" style={{ left: pr.x, top: pr.y }}>🥬</div>
            ) : pr.source === "cactus" ? (
              <div key={pr.id} className="pointer-events-none absolute z-40" style={{ left: pr.x, top: pr.y + 7, width: 10, height: 3, borderRadius: 999, background: "#e7efd0", transform: "rotate(-8deg)" }} />
            ) : pr.source === "sunflower" ? (
              <div key={pr.id} className="pointer-events-none select-none absolute z-40 text-lg" style={{ left: pr.x, top: pr.y }}>☀️</div>
            ) : (
              <div key={pr.id} className="pointer-events-none select-none absolute z-40 text-lg" style={{ left: pr.x, top: pr.y }}>{pr.ignited ? "🔥" : "🟢"}</div>
            ))}`;
  replaceRequired(oldProjectile, newProjectile, 'projectile rendering');

  return source;
};
