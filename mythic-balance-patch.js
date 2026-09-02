window.__patchPvZRogueMythicBalance = function patchPvZRogueMythicBalance(source) {
  function replaceOnce(from, to, label) {
    if (!source.includes(from)) throw new Error(`Mythic balance patch could not find ${label}.`);
    source = source.replace(from, to);
  }

  replaceOnce(
    '  sunflower:{name:"Solar Sovereign",desc:"Every normal bloom also erupts five giant 500-sun orbs—one in every lane.",mod:p=>({...p,mythicSolarSovereign:true})},',
    '  sunflower:{name:"Stalk Strangler",desc:"Sunflower keeps its normal economy, but every 9 seconds its stalk can seize a nearby grounded zombie in its lane, stun it and crush a huge chunk of its health. Bosses resist most of the squeeze.",mod:p=>({...p,mythicStalkStrangler:true})},',
    'Sunflower Mythic definition'
  );

  replaceOnce(
    '  chomper: { name:"World Eater", desc:"Chomper bites almost instantly, reaches 4 tiles both ways and never needs to chew.", mod:p=>({...p,biteRateMult:(p.biteRateMult||1)*10,biteRange:(p.biteRange||1)+3,backbite:true,freeBiteChance:1,biteDamageMult:(p.biteDamageMult||1)*10}) },',
    '  chomper: { name:"World Eater", desc:"Chomper can swallow up to 3 nearby grounded zombies in one bite, including behind itself, then must digest for 7 seconds. Bosses lose 6% max HP instead of being swallowed.", mod:p=>({...p,mythicWorldEater:true}) },',
    'World Eater Mythic definition'
  );

  replaceOnce(
    '  cherrybomb:{name:"Doomsday Cherry",desc:"A reusable global nuke. Every 3 seconds it detonates the entire lawn without consuming itself; it costs 0 and has no packet cooldown.",mod:p=>({...p,mythicDoomsday:true,costFlat:(p.costFlat||0)-999,noPacketCooldown:true})},',
    '  cherrybomb:{name:"Doomsday Cherry",desc:"Cherry Bomb becomes a permanent doomsday reactor: it survives its own blast and re-detonates a huge radius-2 explosion every 10 seconds. It keeps its real sun cost and packet cooldown.",mod:p=>({...p,mythicDoomsday:true,damageMult:(p.damageMult||1)*2,radiusFlat:(p.radiusFlat||0)+1})},',
    'Doomsday Cherry Mythic definition'
  );

  replaceOnce(
    '  poppingcornkernel:{name:"Cornpocalypse",desc:"Every reset detonates the entire sky: all flying zombies are damaged and forcibly popped/dismounted, then popcorn rains damage onto every grounded zombie too—even with nothing overhead.",mod:p=>({...p,mythicCornpocalypse:true})},',
    '  poppingcornkernel:{name:"Cornpocalypse",desc:"When Popping Corn catches any airborne target, the pop chains across every other flying zombie on the lawn, damaging and forcibly popping/dismounting survivors. Each chained flyer also drops a half-strength popcorn impact onto one grounded zombie directly beneath it.",mod:p=>({...p,mythicCornpocalypse:true})},',
    'Cornpocalypse Mythic definition'
  );

  replaceOnce(
    '      if(next.type==="sunflower"&&stats.mods.mythicSolarSovereign&&next.bloomCount>p.bloomCount){for(let row=0;row<ROWS;row+=1)suns.push({id:makeId("sovereignSun"),amount:500,x:next.col*CELL_W+18,y:row*CELL_H+14,row,life:14,age:0,fromSunflower:true});}',
`      if(next.type==="sunflower"&&stats.mods.mythicStalkStrangler){
        next.strangleCd=Math.max(0,(next.strangleCd??2)-dt);
        if(next.strangleCd<=0){
          const stalkX=next.col*CELL_W+CELL_W/2;
          const victim=zombies.filter(z=>z.hp>0&&!z.flying&&z.row===next.row&&Math.abs(z.x-stalkX)<=CELL_W*5).sort((a,b)=>Math.abs(a.x-stalkX)-Math.abs(b.x-stalkX))[0];
          if(victim){
            const boss=!!zombieDefs[victim.type]?.boss;
            const squeeze=boss?Math.max(1,victim.maxHp*.04):Math.max(3000,victim.maxHp*.35);
            victim.hp-=squeeze;
            victim.stun=Math.max(victim.stun||0,boss?1.5:4);
            next.strangleCd=9;
            if(DEVICE_TIER!=="ultra")floaties.push({id:makeId("strangle"),text:"🌻 STALK STRANGLE",x:victim.x-34,y:victim.row*CELL_H+4,life:.85});
          }
        }
      }`,
    'Solar Sovereign runtime effect'
  );

  const oldCornAuto = `      if (next.type === "poppingcornkernel" && stats.mods.mythicCornpocalypse && next.cd <= 0) {
        zombies.forEach(z=>{z.hp-=stats.damage*(z.flying?1:.6);if(z.flying&&z.hp>0&&z.type==="dragonrider")z.forceDismount=true;if(z.flying&&z.hp>0&&z.type==="balloon")z.forcePop=true;});
        next.cd=1.25*s.cooldownMult;
        if(DEVICE_TIER!=="ultra")floaties.push({id:makeId("cornpocalypse"),text:"🍿 CORNPOCALYPSE",x:BOARD_W/2-70,y:18,life:1});
        return next;
      }

`;
  replaceOnce(oldCornAuto, '', 'old automatic Cornpocalypse loop');

  const cornTrigger = '          if (target.hp > 0 && target.type === "balloon") target.forcePop = true;';
  replaceOnce(cornTrigger, `${cornTrigger}
          if (stats.mods.mythicCornpocalypse) {
            zombies.filter(z => z.id !== target.id && z.hp > 0 && z.flying).forEach(flyer => {
              flyer.hp -= stats.damage;
              if (flyer.hp > 0 && flyer.type === "dragonrider") flyer.forceDismount = true;
              if (flyer.hp > 0 && flyer.type === "balloon") flyer.forcePop = true;
              const fallout = zombies.filter(g => !g.flying && g.hp > 0 && g.row === flyer.row && Math.abs(g.x - flyer.x) <= CELL_W * 0.55).sort((a,b)=>Math.abs(a.x-flyer.x)-Math.abs(b.x-flyer.x))[0];
              if (fallout) fallout.hp -= stats.damage * 0.5;
            });
            if (DEVICE_TIER !== "ultra") floaties.push({id:makeId("cornpocalypse"),text:"🍿 SKY CHAIN!",x:BOARD_W/2-55,y:18,life:.9});
          }`, 'Cornpocalypse trigger');

  const chomperAnchor = '      if (stats.kind === "chomper" && next.cd <= 0) {';
  replaceOnce(chomperAnchor, `      if(next.type==="chomper"&&stats.mods.mythicWorldEater&&next.cd<=0){
        const mouthX=next.col*CELL_W+CELL_W/2;
        const victims=zombies.filter(z=>z.hp>0&&!z.flying&&z.row===next.row&&Math.abs(z.x-mouthX)<=CELL_W*3).sort((a,b)=>Math.abs(a.x-mouthX)-Math.abs(b.x-mouthX)).slice(0,3);
        if(victims.length){
          victims.forEach(v=>{if(zombieDefs[v.type]?.boss)v.hp-=v.maxHp*.06;else v.hp=0;});
          next.cd=7*s.cooldownMult;
          next.chewMax=next.cd;
          if(DEVICE_TIER!=="ultra")floaties.push({id:makeId("worldEater"),text:"🪴 DEVOUR x"+victims.length,x:next.col*CELL_W+8,y:next.row*CELL_H+5,life:.9});
        }
        return next;
      }

${chomperAnchor}`, 'Chomper combat anchor');

  replaceOnce(
    '        const rad = stats.mods.mythicDoomsday ? 99 : Math.max(1, stats.radius);',
    '        const rad = stats.mods.mythicDoomsday ? Math.max(2, stats.radius) : Math.max(1, stats.radius);',
    'Doomsday blast radius'
  );
  replaceOnce(
    '        if (next.fuse <= 0) { next.explode = true; if (stats.mods.mythicDoomsday) next.fuse = 3; }',
    '        if (next.fuse <= 0) { next.explode = true; if (stats.mods.mythicDoomsday) next.fuse = 10; }',
    'Doomsday fuse reset'
  );
  replaceOnce(
    '        if (stats.mods.mythicDoomsday) { p.explode = false; p.fuse = 3; } else p.hp = 0;',
    '        if (stats.mods.mythicDoomsday) { p.explode = false; p.fuse = 10; } else p.hp = 0;',
    'Doomsday survival reset'
  );

  return source;
};
