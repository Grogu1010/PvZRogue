window.__patchPvZRogueMythicMechanicsUpgrade = function patchPvZRogueMythicMechanicsUpgrade(source) {
  const globalAnchor = 'const globalBuffs = [';
  if (source.includes(globalAnchor) && !source.includes('"Popcorn Rain", "Legendary:')) {
    source = source.replace(globalAnchor, `if (plantBuffs.poppingcornkernel && !plantBuffs.poppingcornkernel.some(([name]) => name === "Popcorn Rain")) {
  plantBuffs.poppingcornkernel.push(["Popcorn Rain", "Legendary: every air pop also drops a full-strength popcorn hit onto one grounded zombie exactly one tile behind the Kernel.", p => ({ ...p, popcornRain: true })]);
}

${globalAnchor}`);
  }

  if (source.includes('function rarityForBuff(name) {') && !source.includes('name === "Popcorn Rain"')) {
    source = source.replace('function rarityForBuff(name) {', 'function rarityForBuff(name) {\n  if (name === "Popcorn Rain") return "Legendary";');
  }

  const mythicAnchor = 'function zombieIntelStats(type, state) {';
  if (!source.includes(mythicAnchor)) throw new Error('Mythic mechanics upgrade could not find MYTHIC_MODS.');
  source = source.replace(mythicAnchor, `Object.assign(MYTHIC_MODS, {
  peashooter: { name:"Pea Multiverse", desc:"Every attack simultaneously blasts the front zombie in all five lanes. Peashooter stops caring which row it was planted in.", mod:p=>({...p,mythicPeaMultiverse:true,damageMult:(p.damageMult||1)*2}) },
  sunflower: { name:"Solar Sovereign", desc:"Every bloom erupts into five giant suns at once—one for every lane—turning a single Sunflower into a ridiculous solar economy engine.", mod:p=>({...p,mythicSolarSovereign:true}) },
  wallnut: { name:"Fortress Network", desc:"While this Wall Nut lives, every plant in its row routes incoming bite damage into the Wall Nut instead. It becomes the row's shared health bar.", mod:p=>({...p,mythicFortressNetwork:true,hpMult:(p.hpMult||1)*4}) },
  tallnut: { name:"Citadel Column", desc:"Tall Nut's collision box becomes a five-lane column. Zombies in ANY row are stopped when they reach its column.", mod:p=>({...p,mythicCitadelColumn:true,hpMult:(p.hpMult||1)*4,blocksAir:true}) },
  cherrybomb: { name:"Doomsday Cherry", desc:"Cherry Bomb becomes reusable. Every 3 seconds it detonates the ENTIRE lawn without consuming itself, costs 0, and has no packet cooldown.", mod:p=>({...p,mythicDoomsday:true,costFlat:(p.costFlat||0)-999,noPacketCooldown:true}) },
  spikeweed: { name:"Planet of Spikes", desc:"The whole lawn counts as this Spikeweed's tile. Every grounded zombie takes its spike damage wherever it walks.", mod:p=>({...p,mythicPlanetSpikes:true,damageMult:(p.damageMult||1)*3,hpMult:(p.hpMult||1)*4}) },
  cactus: { name:"Needle Rail Network", desc:"Each attack railguns EVERY zombie on the board, including airborne enemies. Lanes stop mattering.", mod:p=>({...p,mythicRailNetwork:true,damageMult:(p.damageMult||1)*2,hitsAir:true}) },
  cabbagepult: { name:"Orbital Cabbage Command", desc:"Each attack calls an orbital cabbage strike onto EVERY zombie at once, ignoring lanes and flight.", mod:p=>({...p,mythicOrbitalCabbage:true,damageMult:(p.damageMult||1)*3}) },
  laserbean: { name:"Death Star Bean", desc:"Each beam becomes a boardwide death ray that hits EVERY zombie simultaneously, air included.", mod:p=>({...p,mythicDeathStar:true,damageMult:(p.damageMult||1)*3}) },
  sunshroom: { name:"Solar Colony", desc:"Sun-shroom no longer dies from daylight. Every bloom erupts sun into all five lanes, and the colony keeps producing forever.", mod:p=>({...p,mythicSolarColony:true}) },
  snapdragon: { name:"Dragon God", desc:"Every breath engulfs the ENTIRE lawn. Ground, air, every row—if it's a zombie, it is inside the flame cone now.", mod:p=>({...p,mythicDragonGod:true,damageMult:(p.damageMult||1)*3}) },
  torchwood: { name:"Living Sun", desc:"While one Mythic Torchwood exists, EVERY pea on the lawn is globally ignited, gains huge pierce, and explodes through nearby zombies. No crossing the Torchwood required.", mod:p=>({...p,mythicLivingSun:true,hpMult:(p.hpMult||1)*4}) },
  firepeashooter: { name:"Supernova Pea", desc:"Every shot becomes a lane-wide supernova: all zombies in the lane are hit at once, while Visco still only takes the underlying pea impact.", mod:p=>({...p,mythicSupernova:true,damageMult:(p.damageMult||1)*3}) },
  poppingcornkernel: { name:"Cornpocalypse", desc:"Every reset detonates the sky over the ENTIRE board: all flying zombies are popped/dismounted for full damage and popcorn rains onto every grounded zombie too. It fires even with nothing directly overhead.", mod:p=>({...p,mythicCornpocalypse:true}) },
});

${mythicAnchor}`);

  const airtrapAnchor = '      if (stats.kind === "airtrap" && next.cd <= 0) {';
  if (source.includes(airtrapAnchor)) {
    source = source.replace(airtrapAnchor, `      if (next.type === "poppingcornkernel" && stats.mods.mythicCornpocalypse && next.cd <= 0) {
        zombies.forEach(z => {
          z.hp -= stats.damage * (z.flying ? 1 : 0.6);
          if (z.flying && z.hp > 0 && z.type === "dragonrider") z.forceDismount = true;
          if (z.flying && z.hp > 0 && z.type === "balloon") z.forcePop = true;
        });
        next.cd = 1.25 * s.cooldownMult;
        if (DEVICE_TIER !== "ultra") floaties.push({id:makeId("cornpocalypse"),text:"🍿 CORNPOCALYPSE",x:BOARD_W/2-70,y:18,life:1});
        return next;
      }

${airtrapAnchor}`);
  }

  const shooterAnchor = '      if ((stats.kind === "shooter" || stats.kind === "lobber") && next.cd <= 0) {';
  if (!source.includes(shooterAnchor)) throw new Error('Mythic mechanics upgrade could not find shooter loop.');
  source = source.replace(shooterAnchor, `      if (next.type === "sunflower" && stats.mods.mythicSolarSovereign && next.bloomCount > p.bloomCount) {
        for (let row = 0; row < ROWS; row += 1) suns.push({id:makeId("sovereignSun"),amount:500,x:next.col*CELL_W+18,y:row*CELL_H+14,row,life:14,age:0,fromSunflower:true});
        if (DEVICE_TIER !== "ultra") floaties.push({id:makeId("solarSovereign"),text:"☀ SOLAR SOVEREIGN",x:next.col*CELL_W-18,y:next.row*CELL_H+2,life:.9});
      }
      if (next.type === "sunshroom" && stats.mods.mythicSolarColony && next.bloomCount > p.bloomCount) {
        next.hp = Math.max(next.hp, next.maxHp);
        for (let row = 0; row < ROWS; row += 1) suns.push({id:makeId("colonySun"),amount:75,x:next.col*CELL_W+22,y:row*CELL_H+16,row,life:14,age:0,fromSunShroom:true,sunShroomTier:3});
      }
      if (next.type === "peashooter" && stats.mods.mythicPeaMultiverse && next.cd <= 0) {
        for (let row = 0; row < ROWS; row += 1) {
          const t = zombies.filter(z=>z.hp>0 && !z.flying && z.row===row).sort((a,b)=>a.x-b.x)[0];
          if (t) t.hp -= stats.damage * 2;
        }
        next.cd = (1/Math.max(.1,stats.fireRate))*s.cooldownMult;
        return next;
      }
      if (next.type === "cactus" && stats.mods.mythicRailNetwork && next.cd <= 0) {
        zombies.forEach(z=>{ if(z.hp>0) z.hp -= stats.damage*2; });
        next.cd = .8*s.cooldownMult;
        return next;
      }
      if (next.type === "cabbagepult" && stats.mods.mythicOrbitalCabbage && next.cd <= 0) {
        zombies.forEach(z=>{ if(z.hp>0) z.hp -= stats.damage*3; });
        next.cd = 1.5*s.cooldownMult;
        if (DEVICE_TIER !== "ultra") floaties.push({id:makeId("orbitalCabbage"),text:"🥬 ORBITAL SALVO",x:BOARD_W/2-60,y:28,life:.8});
        return next;
      }
      if (next.type === "laserbean" && stats.mods.mythicDeathStar && next.cd <= 0) {
        zombies.forEach(z=>{ if(z.hp>0) z.hp -= stats.damage*4; });
        next.cd = .75*s.cooldownMult;
        return next;
      }
      if (next.type === "firepeashooter" && stats.mods.mythicSupernova && next.cd <= 0) {
        zombies.filter(z=>z.hp>0 && z.row===next.row).forEach(z=>{ z.hp -= stats.damage * (z.type === "viscoelastic" ? 1 : (z.type === "coolbrainz" ? 1.7 : 3)); });
        next.cd = .8*s.cooldownMult;
        if (DEVICE_TIER !== "ultra") floaties.push({id:makeId("supernovaPea"),text:"🔥 SUPERNOVA",x:next.col*CELL_W+10,y:next.row*CELL_H+4,life:.6});
        return next;
      }

${shooterAnchor}`);

  source = source.replace(
    '        const targets = zombies.filter(z => !z.flying && Math.abs(z.row - next.row) <= laneRadius && z.x > next.col * CELL_W + 20 && z.x < next.col * CELL_W + reach);',
    '        const targets = stats.mods.mythicDragonGod ? zombies.filter(z => z.hp > 0) : zombies.filter(z => !z.flying && Math.abs(z.row - next.row) <= laneRadius && z.x > next.col * CELL_W + 20 && z.x < next.col * CELL_W + reach);'
  );

  source = source.replace(
    '        const rad = Math.max(1, stats.radius);',
    '        const rad = stats.mods.mythicDoomsday ? 99 : Math.max(1, stats.radius);'
  );
  source = source.replace(
    '        p.hp = 0;',
    '        if (stats.mods.mythicDoomsday) { p.explode = false; p.fuse = 3; } else p.hp = 0;'
  );
  source = source.replace(
    '        if (next.fuse <= 0) next.explode = true;',
    '        if (next.fuse <= 0) { next.explode = true; if (stats.mods.mythicDoomsday) next.fuse = 3; }'
  );

  source = source.replace(
    '          const sameTile = z.row === p.row && !z.flying && z.x > p.col * CELL_W - 12 && z.x < (p.col + 1 + (stats.mods.widthBonus || 0)) * CELL_W;',
    '          const sameTile = stats.mods.mythicPlanetSpikes ? !z.flying : z.row === p.row && !z.flying && z.x > p.col * CELL_W - 12 && z.x < (p.col + 1 + (stats.mods.widthBonus || 0)) * CELL_W;'
  );

  source = source.replace(
    'return !p.frozenHp && (p.row === next.row || (next.type === "coolbrainz" && Math.abs(p.row-next.row)<=1)) && p.hp > 0 && stats.kind !== "spike" && next.x > p.col * CELL_W + 18 && next.x < p.col * CELL_W + 56 && (!next.flying || stats.blocksAir);',
    'return !p.frozenHp && (stats.mods.mythicCitadelColumn || p.row === next.row || (next.type === "coolbrainz" && Math.abs(p.row-next.row)<=1)) && p.hp > 0 && stats.kind !== "spike" && next.x > p.col * CELL_W + 18 && next.x < p.col * CELL_W + 56 && (!next.flying || stats.blocksAir);'
  );

  source = source.replace(
    '          blocker.hp -= next.damage * (pst.mods.damageTakenMult || 1) * eatMult;',
    '          const fortress = plants.find(fp => fp.type === "wallnut" && fp.hp > 0 && fp.row === blocker.row && (s.plantMods.wallnut || {}).mythicFortressNetwork);\n          (fortress || blocker).hp -= next.damage * ((fortress ? applyPlantStats("wallnut", s.plantMods, s).mods.damageTakenMult : pst.mods.damageTakenMult) || 1) * eatMult;'
  );

  const projectileMove = '    projectiles = projectiles.map(pr => ({ ...pr, prevX: pr.x, x: pr.x + pr.speed * dt })).filter(pr => pr.x < BOARD_W + 80 && pr.pierce > 0);';
  if (source.includes(projectileMove)) source = source.replace(projectileMove, `    if ((s.plantMods.torchwood || {}).mythicLivingSun && plants.some(tp => tp.type === "torchwood" && tp.hp > 0)) {
      projectiles.forEach(pr => {
        if (pr.source === "peashooter" || pr.source === "firepeashooter") {
          pr.fire = true; pr.ignited = true; pr.pierce = Math.max(pr.pierce || 1, 12); pr.splash = Math.max(pr.splash || 0, .8); pr.damage *= 2;
        }
      });
    }
${projectileMove}`);

  return source;
};
