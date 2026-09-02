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

  return source;
};
