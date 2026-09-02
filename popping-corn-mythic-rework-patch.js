window.__patchPvZRoguePoppingCornMythicRework = function patchPvZRoguePoppingCornMythicRework(source) {
  function req(from, to, label) {
    if (!source.includes(from)) throw new Error(`Popping Corn Mythic rework could not find ${label}.`);
    source = source.replace(from, to);
  }

  req(
    '  poppingcornkernel: { name:"No-Fly Zone", desc:"Popping Corn deals 5x damage, resets 4x faster, and can pop airborne enemies one lane above or below too.", mod:p=>({...p,damageMult:(p.damageMult||1)*5,fireRateMult:(p.fireRateMult||1)*4,airLaneRadius:1}) },',
    '  poppingcornkernel: { name:"Popcorn Rain", desc:"Whenever Popping Corn pops an airborne zombie, the popcorn falls one tile behind the Kernel and smashes one grounded zombie there for the same pop damage.", mod:p=>({...p,popcornRain:true}) },',
    'old Popping Corn Mythic definition'
  );

  const oldHit = `        if (target) {
          target.hp -= stats.damage;
          if (stats.mods.airStun) target.stun = Math.max(target.stun || 0, stats.mods.airStun);
          if (target.hp > 0 && target.type === "dragonrider") target.forceDismount = true;
          if (target.hp > 0 && target.type === "balloon") target.forcePop = true;
          next.cd = (1 / Math.max(.1, stats.fireRate || 1)) * s.cooldownMult;
          if (DEVICE_TIER !== "ultra") floaties.push({id:makeId("cornPop"),text:"🍿 POP!",x:next.col*CELL_W+16,y:next.row*CELL_H-8,life:.7});
        }`;

  const newHit = `        if (target) {
          target.hp -= stats.damage;
          if (stats.mods.airStun) target.stun = Math.max(target.stun || 0, stats.mods.airStun);
          if (target.hp > 0 && target.type === "dragonrider") target.forceDismount = true;
          if (target.hp > 0 && target.type === "balloon") target.forcePop = true;
          if (stats.mods.popcornRain && next.col > 0) {
            const rainLeft = (next.col - 1) * CELL_W + 2;
            const rainRight = next.col * CELL_W - 2;
            const groundTarget = zombies.filter(z => !z.flying && z.hp > 0 && z.row === next.row && z.x >= rainLeft && z.x <= rainRight).sort((a,b)=>a.x-b.x)[0];
            if (groundTarget) {
              groundTarget.hp -= stats.damage;
              if (DEVICE_TIER !== "ultra") floaties.push({id:makeId("popcornRain"),text:"🍿 RAIN!",x:groundTarget.x-8,y:groundTarget.row*CELL_H+2,life:.75});
            }
          }
          next.cd = (1 / Math.max(.1, stats.fireRate || 1)) * s.cooldownMult;
          if (DEVICE_TIER !== "ultra") floaties.push({id:makeId("cornPop"),text:"🍿 POP!",x:next.col*CELL_W+16,y:next.row*CELL_H-8,life:.7});
        }`;

  req(oldHit, newHit, 'Popping Corn air-hit block');
  return patchStatOnlyMythics(source);
};

function patchStatOnlyMythics(source) {
  const globalAnchor = 'const globalBuffs = [';
  if (source.includes(globalAnchor) && !source.includes('"Popcorn Rain", "Legendary:')) {
    source = source.replace(globalAnchor, `if (plantBuffs.poppingcornkernel && !plantBuffs.poppingcornkernel.some(([name]) => name === "Popcorn Rain")) {
  plantBuffs.poppingcornkernel.push(["Popcorn Rain", "Legendary: every air pop also drops a full-strength popcorn hit onto one grounded zombie exactly one tile behind the Kernel.", p => ({ ...p, popcornRain: true })]);
}

${globalAnchor}`);
  }
  if (source.includes('function rarityForBuff(name) {') && !source.includes('name === "Popcorn Rain"')) source = source.replace('function rarityForBuff(name) {', 'function rarityForBuff(name) {\n  if (name === "Popcorn Rain") return "Legendary";');

  const mythicAnchor = 'function zombieIntelStats(type, state) {';
  if (!source.includes(mythicAnchor)) throw new Error('Mythic mechanics upgrade could not find MYTHIC_MODS.');
  source = source.replace(mythicAnchor, `Object.assign(MYTHIC_MODS, {
  peashooter:{name:"Pea Multiverse",desc:"Every attack blasts the front zombie in all five lanes at once. Its planted row no longer limits its offense.",mod:p=>({...p,mythicPeaMultiverse:true,damageMult:(p.damageMult||1)*2})},
  sunflower:{name:"Solar Sovereign",desc:"Every normal bloom also erupts five giant 500-sun orbs—one in every lane.",mod:p=>({...p,mythicSolarSovereign:true})},
  wallnut:{name:"Fortress Network",desc:"While this Wall Nut lives, every plant in its row routes incoming bite damage into the Wall Nut instead. The row shares its health bar.",mod:p=>({...p,mythicFortressNetwork:true,hpMult:(p.hpMult||1)*4})},
  tallnut:{name:"Citadel Column",desc:"Tall Nut becomes a five-lane wall: zombies in any row collide with it when they reach its column.",mod:p=>({...p,mythicCitadelColumn:true,hpMult:(p.hpMult||1)*4,blocksAir:true})},
  cherrybomb:{name:"Doomsday Cherry",desc:"A reusable global nuke. Every 3 seconds it detonates the entire lawn without consuming itself; it costs 0 and has no packet cooldown.",mod:p=>({...p,mythicDoomsday:true,costFlat:(p.costFlat||0)-999,noPacketCooldown:true})},
  spikeweed:{name:"Planet of Spikes",desc:"The entire lawn counts as this Spikeweed's tile. Every grounded zombie takes spike damage wherever it walks.",mod:p=>({...p,mythicPlanetSpikes:true,damageMult:(p.damageMult||1)*3,hpMult:(p.hpMult||1)*4})},
  cactus:{name:"Needle Rail Network",desc:"Each attack railguns every zombie on the board simultaneously, including airborne enemies.",mod:p=>({...p,mythicRailNetwork:true,damageMult:(p.damageMult||1)*2,hitsAir:true})},
  cabbagepult:{name:"Orbital Cabbage Command",desc:"Each attack calls an orbital cabbage strike onto every zombie simultaneously, ignoring lanes and flight.",mod:p=>({...p,mythicOrbitalCabbage:true,damageMult:(p.damageMult||1)*3})},
  laserbean:{name:"Death Star Bean",desc:"Every attack is a boardwide death ray hitting every zombie at once, air included.",mod:p=>({...p,mythicDeathStar:true,damageMult:(p.damageMult||1)*3})},
  sunshroom:{name:"Solar Colony",desc:"Sun-shroom stops dying from daylight and every bloom spills a large sun into all five lanes forever.",mod:p=>({...p,mythicSolarColony:true})},
  snapdragon:{name:"Dragon God",desc:"Every breath engulfs the entire lawn. Ground, air, every row—every zombie is now inside its flame cone.",mod:p=>({...p,mythicDragonGod:true,damageMult:(p.damageMult||1)*3})},
  torchwood:{name:"Living Sun",desc:"While one Mythic Torchwood lives, every pea anywhere on the lawn is automatically ignited, massively piercing and explosive—no crossing required.",mod:p=>({...p,mythicLivingSun:true,hpMult:(p.hpMult||1)*4})},
  firepeashooter:{name:"Supernova Pea",desc:"Every shot becomes a lane-wide supernova that hits every zombie in its lane at once. Visco still only takes the underlying pea impact.",mod:p=>({...p,mythicSupernova:true,damageMult:(p.damageMult||1)*3})},
  poppingcornkernel:{name:"Cornpocalypse",desc:"Every reset detonates the entire sky: all flying zombies are damaged and forcibly popped/dismounted, then popcorn rains damage onto every grounded zombie too—even with nothing overhead.",mod:p=>({...p,mythicCornpocalypse:true})},
});

${mythicAnchor}`);

  const airtrap = '      if (stats.kind === "airtrap" && next.cd <= 0) {';
  if (source.includes(airtrap)) source = source.replace(airtrap, `      if (next.type === "poppingcornkernel" && stats.mods.mythicCornpocalypse && next.cd <= 0) {
        zombies.forEach(z=>{z.hp-=stats.damage*(z.flying?1:.6);if(z.flying&&z.hp>0&&z.type==="dragonrider")z.forceDismount=true;if(z.flying&&z.hp>0&&z.type==="balloon")z.forcePop=true;});
        next.cd=1.25*s.cooldownMult;
        if(DEVICE_TIER!=="ultra")floaties.push({id:makeId("cornpocalypse"),text:"🍿 CORNPOCALYPSE",x:BOARD_W/2-70,y:18,life:1});
        return next;
      }

${airtrap}`);

  const shooter = '      if ((stats.kind === "shooter" || stats.kind === "lobber") && next.cd <= 0) {';
  if (!source.includes(shooter)) throw new Error('Mythic mechanics upgrade could not find shooter loop.');
  source = source.replace(shooter, `      if(next.type==="sunflower"&&stats.mods.mythicSolarSovereign&&next.bloomCount>p.bloomCount){for(let row=0;row<ROWS;row+=1)suns.push({id:makeId("sovereignSun"),amount:500,x:next.col*CELL_W+18,y:row*CELL_H+14,row,life:14,age:0,fromSunflower:true});}
      if(next.type==="sunshroom"&&stats.mods.mythicSolarColony&&next.bloomCount>p.bloomCount){next.hp=Math.max(next.hp,next.maxHp);for(let row=0;row<ROWS;row+=1)suns.push({id:makeId("colonySun"),amount:75,x:next.col*CELL_W+22,y:row*CELL_H+16,row,life:14,age:0,fromSunShroom:true,sunShroomTier:3});}
      if(next.type==="peashooter"&&stats.mods.mythicPeaMultiverse&&next.cd<=0){for(let row=0;row<ROWS;row+=1){const t=zombies.filter(z=>z.hp>0&&!z.flying&&z.row===row).sort((a,b)=>a.x-b.x)[0];if(t)t.hp-=stats.damage*2;}next.cd=(1/Math.max(.1,stats.fireRate))*s.cooldownMult;return next;}
      if(next.type==="cactus"&&stats.mods.mythicRailNetwork&&next.cd<=0){zombies.forEach(z=>{if(z.hp>0)z.hp-=stats.damage*2;});next.cd=.8*s.cooldownMult;return next;}
      if(next.type==="cabbagepult"&&stats.mods.mythicOrbitalCabbage&&next.cd<=0){zombies.forEach(z=>{if(z.hp>0)z.hp-=stats.damage*3;});next.cd=1.5*s.cooldownMult;return next;}
      if(next.type==="laserbean"&&stats.mods.mythicDeathStar&&next.cd<=0){zombies.forEach(z=>{if(z.hp>0)z.hp-=stats.damage*4;});next.cd=.75*s.cooldownMult;return next;}
      if(next.type==="firepeashooter"&&stats.mods.mythicSupernova&&next.cd<=0){zombies.filter(z=>z.hp>0&&z.row===next.row).forEach(z=>{z.hp-=stats.damage*(z.type==="viscoelastic"?1:(z.type==="coolbrainz"?1.7:3));});next.cd=.8*s.cooldownMult;return next;}

${shooter}`);

  source=source.replace('        const targets = zombies.filter(z => !z.flying && Math.abs(z.row - next.row) <= laneRadius && z.x > next.col * CELL_W + 20 && z.x < next.col * CELL_W + reach);','        const targets = stats.mods.mythicDragonGod ? zombies.filter(z => z.hp > 0) : zombies.filter(z => !z.flying && Math.abs(z.row - next.row) <= laneRadius && z.x > next.col * CELL_W + 20 && z.x < next.col * CELL_W + reach);');
  source=source.replace('        const rad = Math.max(1, stats.radius);','        const rad = stats.mods.mythicDoomsday ? 99 : Math.max(1, stats.radius);');
  source=source.replace('        if (next.fuse <= 0) next.explode = true;','        if (next.fuse <= 0) { next.explode = true; if (stats.mods.mythicDoomsday) next.fuse = 3; }');
  source=source.replace('        p.hp = 0;','        if (stats.mods.mythicDoomsday) { p.explode = false; p.fuse = 3; } else p.hp = 0;');
  source=source.replace('          const sameTile = z.row === p.row && !z.flying && z.x > p.col * CELL_W - 12 && z.x < (p.col + 1 + (stats.mods.widthBonus || 0)) * CELL_W;','          const sameTile = stats.mods.mythicPlanetSpikes ? !z.flying : z.row === p.row && !z.flying && z.x > p.col * CELL_W - 12 && z.x < (p.col + 1 + (stats.mods.widthBonus || 0)) * CELL_W;');
  source=source.replace('return !p.frozenHp && (p.row === next.row || (next.type === "coolbrainz" && Math.abs(p.row-next.row)<=1)) && p.hp > 0 && stats.kind !== "spike" && next.x > p.col * CELL_W + 18 && next.x < p.col * CELL_W + 56 && (!next.flying || stats.blocksAir);','return !p.frozenHp && (stats.mods.mythicCitadelColumn || p.row === next.row || (next.type === "coolbrainz" && Math.abs(p.row-next.row)<=1)) && p.hp > 0 && stats.kind !== "spike" && next.x > p.col * CELL_W + 18 && next.x < p.col * CELL_W + 56 && (!next.flying || stats.blocksAir);');
  source=source.replace('          blocker.hp -= next.damage * (pst.mods.damageTakenMult || 1) * eatMult;','          const fortress=plants.find(fp=>fp.type==="wallnut"&&fp.hp>0&&fp.row===blocker.row&&(s.plantMods.wallnut||{}).mythicFortressNetwork);\n          (fortress||blocker).hp-=next.damage*((fortress?applyPlantStats("wallnut",s.plantMods,s).mods.damageTakenMult:pst.mods.damageTakenMult)||1)*eatMult;');

  const projectileMove='    projectiles = projectiles.map(pr => ({ ...pr, prevX: pr.x, x: pr.x + pr.speed * dt })).filter(pr => pr.x < BOARD_W + 80 && pr.pierce > 0);';
  if(source.includes(projectileMove))source=source.replace(projectileMove,`    if((s.plantMods.torchwood||{}).mythicLivingSun&&plants.some(tp=>tp.type==="torchwood"&&tp.hp>0)){projectiles.forEach(pr=>{if(pr.source==="peashooter"||pr.source==="firepeashooter"){pr.fire=true;pr.ignited=true;pr.pierce=Math.max(pr.pierce||1,12);pr.splash=Math.max(pr.splash||0,.8);pr.damage*=2;}});}
${projectileMove}`);
  return source;
}
