window.__patchPvZRogueViscoFirePeas = function patchPvZRogueViscoFirePeas(source) {
  // Viscoelastic Zombie health nerf: 1250 -> 950 base HP (-24%).
  source = source.replace(
    '  viscoelastic: { name: "Viscoelastic Zombie", icon: "🫧", points: 10, hp: 1250, speed: 6.2, damage: 72, unlock: 7, flying: false, heavy: true, fireproof: true, explosionProof: true },',
    '  viscoelastic: { name: "Viscoelastic Zombie", icon: "🫧", points: 10, hp: 950, speed: 6.2, damage: 72, unlock: 7, flying: false, heavy: true, fireproof: true, explosionProof: true },'
  );

  // Remember the pea's pre-ignition impact damage so Visco can ignore only the fire bonus.
  const projectileFields = '              hitsAir: !!stats.hitsAir, source: next.type, fire: !!stats.firePlant, slow: stats.mods.slowOnHit || 0, splash: stats.mods.splash || 0,';
  const projectileFieldsWithBase = '              hitsAir: !!stats.hitsAir, source: next.type, fire: !!stats.firePlant, baseImpactDamage: stats.damage, slow: stats.mods.slowOnHit || 0, splash: stats.mods.splash || 0,';
  if (source.includes(projectileFields)) source = source.replace(projectileFields, projectileFieldsWithBase);

  const oldViscoFireBlock = '        if (target.type === "viscoelastic" && (pr.fire || pr.source === "firepeashooter")) { pr.pierce = 0; if (DEVICE_TIER !== "ultra") floaties.push({id:makeId("fireproof"),text:"FIREPROOF",x:target.x,y:target.row*CELL_H+8,life:.5}); continue; }';
  const newViscoFireBlock = '        if (target.type === "viscoelastic" && (pr.fire || pr.source === "firepeashooter")) { pr.damage = pr.baseImpactDamage ?? pr.damage; pr.fire = false; pr.ignited = false; if (DEVICE_TIER !== "ultra") floaties.push({id:makeId("fireResist"),text:"FIRE BONUS BLOCKED",x:target.x,y:target.row*CELL_H+8,life:.5}); }';
  if (source.includes(oldViscoFireBlock)) source = source.replace(oldViscoFireBlock, newViscoFireBlock);

  source = source.replace(
    '  viscoelastic: { does: "Viscoelastic armor reflects concentrated impact and energy attacks. It is completely fireproof and explosion-proof.", weak: ["Peashooter", "Cabbage Pult", "Spikeweed"], strong: ["Fire plants", "Explosions", "Energy / impact attacks"] },',
    '  viscoelastic: { does: "Viscoelastic armor reflects plant attacks. It is explosion-proof and immune to fire bonus damage/burns, but Fire Peas still keep their underlying pea impact before Visco reflection is applied.", weak: ["Sustained low-impact attacks", "Debuffs", "Disposable attackers"], strong: ["Huge single hits", "Fire bonus / burns", "Explosions"] },'
  );

  function req(from, to, label) {
    if (!source.includes(from)) throw new Error(`Balance consistency patch could not find ${label}.`);
    source = source.replace(from, to);
  }

  // Absolute Winter remains absurd control, but never reaches permanent freeze lock.
  req(
    '  iceberglettuce: { name:"Absolute Winter", desc:"Iceberg freezes the whole board for ages, deals 500 freeze damage and always survives.", mod:p=>({...p,freezeLaneBonus:5,freezeRangeFlat:9,freezeFlat:(p.freezeFlat||0)+20,chillDamage:(p.chillDamage||0)+500,freezeSplash:true,surviveFreezeChance:1}) },',
    '  iceberglettuce: { name:"Absolute Winter", desc:"Iceberg freezes the whole board, always survives, and can freeze for at most 26 seconds. After triggering, that Iceberg cannot freeze again for 35 seconds.", mod:p=>({...p,freezeLaneBonus:5,freezeRangeFlat:9,freezeFlat:(p.freezeFlat||0)+5,chillDamage:(p.chillDamage||0)+500,freezeSplash:true,surviveFreezeChance:1,mythicIcebergCooldown:35}) },',
    'Absolute Winter Mythic'
  );
  req(
    '          const freezeTime = (stats.freezeTime || 6) + (stats.mods.freezeFlat || 0);',
    '          const freezeTime = Math.min(26, (stats.freezeTime || 6) + (stats.mods.freezeFlat || 0));',
    'Iceberg freeze duration calculation'
  );
  req(
    '          if (Math.random() < (stats.mods.surviveFreezeChance || 0)) next.cd = 8;\n          else next.hp = 0;',
    '          if (Math.random() < (stats.mods.surviveFreezeChance || 0)) next.cd = stats.mods.mythicIcebergCooldown || 8;\n          else next.hp = 0;',
    'Iceberg survival cooldown'
  );

  // Diversify Mythics that had become near-identical multi-target damage upgrades.
  req(
    '  peashooter:{name:"Pea Multiverse",desc:"Every attack blasts the front zombie in all five lanes at once. Its planted row no longer limits its offense.",mod:p=>({...p,mythicPeaMultiverse:true,damageMult:(p.damageMult||1)*2})},',
    '  peashooter:{name:"Pea Time Machine",desc:"Every fifth attack rewinds the previous four attacks into one instant burst and clears Peashooter packet cooldown. It stays lane-bound but becomes a ridiculous burst/replant engine.",mod:p=>({...p,mythicPeaTimeMachine:true})},',
    'Peashooter Mythic definition'
  );
  req(
    '  cactus:{name:"Needle Rail Network",desc:"Each attack railguns every zombie on the board simultaneously, including airborne enemies.",mod:p=>({...p,mythicRailNetwork:true,damageMult:(p.damageMult||1)*2,hitsAir:true})},',
    '  cactus:{name:"Skyhook Cactus",desc:"Needles pin flying enemies out of the sky. Balloons pop, Dragon Riders dismount, and other flyers are permanently grounded and stunned for 5 seconds.",mod:p=>({...p,mythicSkyhook:true,hitsAir:true})},',
    'Cactus Mythic definition'
  );
  req(
    '  cabbagepult:{name:"Orbital Cabbage Command",desc:"Each attack calls an orbital cabbage strike onto every zombie simultaneously, ignoring lanes and flight.",mod:p=>({...p,mythicOrbitalCabbage:true,damageMult:(p.damageMult||1)*3})},',
    '  cabbagepult:{name:"Cabbage Meteor",desc:"Every third toss becomes a meteor: 18% max-HP damage, a 4-second stun, and a two-tile knockback. Bosses instead take 4% max HP and a short stun.",mod:p=>({...p,mythicCabbageMeteor:true})},',
    'Cabbage Mythic definition'
  );
  req(
    '  laserbean:{name:"Death Star Bean",desc:"Every attack is a boardwide death ray hitting every zombie at once, air included.",mod:p=>({...p,mythicDeathStar:true,damageMult:(p.damageMult||1)*3})},',
    '  laserbean:{name:"Event Horizon Bean",desc:"A hit tears space: the target loses 12% max HP and is teleported three tiles backward. Bosses resist the teleport and lose 3% instead.",mod:p=>({...p,mythicEventHorizon:true})},',
    'Laser Bean Mythic definition'
  );
  req(
    '  snapdragon:{name:"Dragon God",desc:"Every breath engulfs the entire lawn. Ground, air, every row—every zombie is now inside its flame cone.",mod:p=>({...p,mythicDragonGod:true,damageMult:(p.damageMult||1)*3})},',
    '  snapdragon:{name:"Dragon God",desc:"Snapdragon keeps a real cone, but kills feed it: each kill fully heals that Snapdragon, grants 75 sun, and permanently adds +15% damage to that individual plant.",mod:p=>({...p,mythicDragonGod:true})},',
    'Snapdragon Mythic definition'
  );
  req(
    '  firepeashooter:{name:"Supernova Pea",desc:"Every shot becomes a lane-wide supernova that hits every zombie in its lane at once. Visco still only takes the underlying pea impact.",mod:p=>({...p,mythicSupernova:true,damageMult:(p.damageMult||1)*3})},',
    '  firepeashooter:{name:"Phoenix Pea",desc:"A killing Fire Pea erupts from the corpse into three new phoenix peas moving forward. Chain kills can carry a wildfire down the lane.",mod:p=>({...p,mythicPhoenixPea:true})},',
    'Fire Peashooter Mythic definition'
  );

  req(
    '      if(next.type==="peashooter"&&stats.mods.mythicPeaMultiverse&&next.cd<=0){for(let row=0;row<ROWS;row+=1){const t=zombies.filter(z=>z.hp>0&&!z.flying&&z.row===row).sort((a,b)=>a.x-b.x)[0];if(t)t.hp-=stats.damage*2;}next.cd=(1/Math.max(.1,stats.fireRate))*s.cooldownMult;return next;}',
    '      if(next.type==="peashooter"&&stats.mods.mythicPeaTimeMachine&&next.cd<=0){next.mythicShotCount=(next.mythicShotCount||0)+1;if(next.mythicShotCount%5===0){const t=zombies.filter(z=>z.hp>0&&!z.flying&&z.row===next.row&&z.x>next.col*CELL_W).sort((a,b)=>a.x-b.x)[0];if(t)t.hp-=stats.damage*4;s.packetCooldowns={...(s.packetCooldowns||{}),peashooter:0};if(DEVICE_TIER!=="ultra")floaties.push({id:makeId("peaRewind"),text:"⏪ PEA REWIND x4",x:next.col*CELL_W+18,y:next.row*CELL_H+4,life:.8});}}',
    'Peashooter Mythic runtime'
  );
  req(
    '      if(next.type==="cactus"&&stats.mods.mythicRailNetwork&&next.cd<=0){zombies.forEach(z=>{if(z.hp>0)z.hp-=stats.damage*2;});next.cd=.8*s.cooldownMult;return next;}',
    '      if(next.type==="cactus"&&stats.mods.mythicSkyhook&&next.cd<=0){const t=zombies.filter(z=>z.hp>0&&z.row===next.row&&z.x>next.col*CELL_W+35).sort((a,b)=>a.x-b.x)[0];if(t){t.hp-=stats.damage;if(t.flying&&t.hp>0){if(t.type==="dragonrider")t.forceDismount=true;else if(t.type==="balloon")t.forcePop=true;else{t.flying=false;t.groundedAir=true;}t.stun=Math.max(t.stun||0,5);if(DEVICE_TIER!=="ultra")floaties.push({id:makeId("skyhook"),text:"🌵 SKYHOOK!",x:t.x-12,y:t.row*CELL_H+2,life:.8});}next.cd=(1/Math.max(.1,stats.fireRate))*s.cooldownMult;}return next;}',
    'Cactus Mythic runtime'
  );
  req(
    '      if(next.type==="cabbagepult"&&stats.mods.mythicOrbitalCabbage&&next.cd<=0){zombies.forEach(z=>{if(z.hp>0)z.hp-=stats.damage*3;});next.cd=1.5*s.cooldownMult;return next;}',
    '      if(next.type==="cabbagepult"&&stats.mods.mythicCabbageMeteor&&next.cd<=0){next.meteorCount=(next.meteorCount||0)+1;if(next.meteorCount%3===0){const t=zombies.filter(z=>z.hp>0&&z.row===next.row&&z.x>next.col*CELL_W+35).sort((a,b)=>a.x-b.x)[0];if(t){const boss=!!zombieDefs[t.type]?.boss;t.hp-=t.maxHp*(boss?.04:.18);t.stun=Math.max(t.stun||0,boss?1:4);if(!boss)t.x+=CELL_W*2;if(DEVICE_TIER!=="ultra")floaties.push({id:makeId("cabbageMeteor"),text:"☄️ CABBAGE METEOR",x:t.x-28,y:t.row*CELL_H+2,life:.85});}}}',
    'Cabbage Mythic runtime'
  );
  req(
    '      if(next.type==="laserbean"&&stats.mods.mythicDeathStar&&next.cd<=0){zombies.forEach(z=>{if(z.hp>0)z.hp-=stats.damage*4;});next.cd=.75*s.cooldownMult;return next;}',
    '      if(next.type==="laserbean"&&stats.mods.mythicEventHorizon&&next.cd<=0){const t=zombies.filter(z=>z.hp>0&&z.row===next.row&&z.x>next.col*CELL_W+35).sort((a,b)=>a.x-b.x)[0];if(t){const boss=!!zombieDefs[t.type]?.boss;t.hp-=t.maxHp*(boss?.03:.12);if(!boss)t.x+=CELL_W*3;if(DEVICE_TIER!=="ultra")floaties.push({id:makeId("eventHorizon"),text:"🌀 EVENT HORIZON",x:t.x-24,y:t.row*CELL_H+2,life:.8});next.cd=(1/Math.max(.1,stats.fireRate))*s.cooldownMult;}return next;}',
    'Laser Bean Mythic runtime'
  );
  req(
    '      if(next.type==="firepeashooter"&&stats.mods.mythicSupernova&&next.cd<=0){zombies.filter(z=>z.hp>0&&z.row===next.row).forEach(z=>{z.hp-=stats.damage*(z.type==="viscoelastic"?1:(z.type==="coolbrainz"?1.7:3));});next.cd=.8*s.cooldownMult;return next;}',
    '',
    'Fire Peashooter old Supernova runtime'
  );

  source = source.replace(
    '        const targets = stats.mods.mythicDragonGod ? zombies.filter(z => z.hp > 0) : zombies.filter(z => !z.flying && Math.abs(z.row - next.row) <= laneRadius && z.x > next.col * CELL_W + 20 && z.x < next.col * CELL_W + reach);',
    '        const targets = zombies.filter(z => !z.flying && Math.abs(z.row - next.row) <= laneRadius && z.x > next.col * CELL_W + 20 && z.x < next.col * CELL_W + reach);'
  );
  source = source.replace(
    '          const burnOnce = list => list.forEach(z => {\n            z.hp -= stats.damage;',
    '          const burnOnce = list => list.forEach(z => {\n            const dragonGodDamage=stats.damage*(1+((next.dragonGodStacks||0)*.15));\n            const beforeHp=z.hp;\n            z.hp -= dragonGodDamage;\n            if(stats.mods.mythicDragonGod&&beforeHp>0&&z.hp<=0){next.hp=next.maxHp;sun=Math.min(s.maxSun,sun+75);next.dragonGodStacks=(next.dragonGodStacks||0)+1;}'
  );

  source = source.replace(
    '              hitsAir: !!stats.hitsAir, source: next.type, fire: !!stats.firePlant, baseImpactDamage: stats.damage, slow:',
    '              hitsAir: !!stats.hitsAir, source: next.type, fire: !!stats.firePlant, phoenix: next.type === "firepeashooter" && !!stats.mods.mythicPhoenixPea, baseImpactDamage: stats.damage, slow:'
  );
  source = source.replace(
    '        pr.pierce -= 1;',
    '        if(pr.phoenix&&target.hp<=0){for(let phoenixI=0;phoenixI<3;phoenixI+=1)projectiles.push({id:makeId("phoenixPea"),row:target.row,x:target.x+8,y:target.row*CELL_H+22+phoenixI*5,damage:pr.baseImpactDamage||pr.damage,speed:300,pierce:1,source:"firepeashooter",fire:true,baseImpactDamage:pr.baseImpactDamage||pr.damage,slow:0,splash:0,stun:0,poison:0,airMult:1,phoenix:false});if(DEVICE_TIER!=="ultra")floaties.push({id:makeId("phoenix"),text:"🔥 PHOENIX x3",x:target.x-18,y:target.row*CELL_H,life:.7});}\n        pr.pierce -= 1;'
  );

  // One Visco rule: 35% in, 35% reflected, regardless of which reflectable plant made the hit.
  const viscoMeleeOld = `          const viscoReflectsMelee = target.type === "viscoelastic" && (next.type === "bonkchoy" || next.type === "vadervine");
          if (viscoReflectsMelee) {
            target.hp -= stats.damage * surge * 0.2;
            next.hp -= stats.damage * surge * 0.5;
            if (DEVICE_TIER !== "ultra") floaties.push({ id: makeId("viscoReflect"), text: "↩ REFLECT", x: target.x, y: target.row * CELL_H + 10, life: 0.55 });
          } else {
            target.hp -= stats.damage * surge;
            if (stats.mods.forcePush) target.x += 34;
            if (stats.mods.forceChoke) target.stun = Math.max(target.stun, 0.7);
          }`;
  const viscoMeleeNew = `          if (target.type === "viscoelastic") {
            const impact=stats.damage*surge;
            target.hp-=impact*.35;
            next.hp-=impact*.35;
            if(DEVICE_TIER!=="ultra")floaties.push({id:makeId("viscoReflect"),text:"35% ↩ 35%",x:target.x,y:target.row*CELL_H+10,life:.55});
          } else {
            target.hp -= stats.damage * surge;
            if (stats.mods.forcePush) target.x += 34;
            if (stats.mods.forceChoke) target.stun = Math.max(target.stun, 0.7);
          }`;
  if (source.includes(viscoMeleeOld)) source = source.replace(viscoMeleeOld, viscoMeleeNew);

  const pineappleOld = '          } else if (visco) {\n            target.hp -= baseDamage * 0.1;\n            next.hp -= baseDamage * 0.35;\n            if (DEVICE_TIER !== "ultra") floaties.push({ id: makeId("viscoPunch"), text: "BOING ↩", x: target.x, y: target.row * CELL_H + 4, life: 0.75 });';
  const pineappleNew = '          } else if (visco) {\n            target.hp -= baseDamage * 0.35;\n            next.hp -= baseDamage * 0.35;\n            if (DEVICE_TIER !== "ultra") floaties.push({ id: makeId("viscoPunch"), text: "35% ↩ 35%", x: target.x, y: target.row * CELL_H + 4, life: 0.75 });';
  if (source.includes(pineappleOld)) source = source.replace(pineappleOld, pineappleNew);

  const beamOld = `        const viscoReflectsBeam = target.type === "viscoelastic" && pr.source === "laserbean";
        if (viscoReflectsBeam) {
          target.hp -= pr.damage * 0.12 * (targetMods.damageTaken || 1);
          const sourcePlant = plants.filter(p => p.type === "laserbean" && p.row === pr.row && p.hp > 0).sort((a,b) => b.col - a.col)[0];
          if (sourcePlant) sourcePlant.hp -= pr.damage * 0.4;
          pr.pierce = 1;
          if (DEVICE_TIER !== "ultra") floaties.push({ id: makeId("beamReflect"), text: "↩ BEAM", x: target.x, y: target.row * CELL_H + 8, life: 0.5 });
        } else {
          target.hp -= pr.damage * (target.flying ? pr.airMult : 1) * (targetMods.damageTaken || 1);
        }`;
  const beamNew = `        if (target.type === "viscoelastic") {
          const impact=pr.damage*(target.flying?pr.airMult:1)*(targetMods.damageTaken||1);
          target.hp-=impact*.35;
          const sourcePlant=plants.filter(p=>p.type===pr.source&&p.row===pr.row&&p.hp>0&&p.col*CELL_W<target.x).sort((a,b)=>b.col-a.col)[0];
          if(sourcePlant)sourcePlant.hp-=impact*.35;
          if(DEVICE_TIER!=="ultra")floaties.push({id:makeId("viscoReflect"),text:"35% ↩ 35%",x:target.x,y:target.row*CELL_H+8,life:.5});
        } else {
          target.hp -= pr.damage * (target.flying ? pr.airMult : 1) * (targetMods.damageTaken || 1);
        }`;
  if (source.includes(beamOld)) source = source.replace(beamOld, beamNew);

  source = source.replace(
    '          target.hp -= stats.biteDamage * (stats.mods.biteDamageMult || 1);',
    '          const biteImpact=stats.biteDamage*(stats.mods.biteDamageMult||1);if(target.type==="viscoelastic"){target.hp-=biteImpact*.35;next.hp-=biteImpact*.35;}else target.hp-=biteImpact;'
  );

  source = source.replace(
    '  viscoelastic: { does: "Viscoelastic armor reflects plant attacks. It is explosion-proof and immune to fire bonus damage/burns, but Fire Peas still keep their underlying pea impact before Visco reflection is applied.", weak: ["Sustained low-impact attacks", "Debuffs", "Disposable attackers"], strong: ["Huge single hits", "Fire bonus / burns", "Explosions"] },',
    '  viscoelastic: { does: "One consistent reflection rule: reflectable plant attacks deal 35% impact damage to Visco and reflect 35% back to the attacking plant. Explosions deal 0. Fire bonus/burn deals 0; Fire Peas first fall back to base pea impact, then use the same 35/35 rule.", weak: ["Sustained low-impact attacks", "Debuffs", "Disposable attackers"], strong: ["Huge single hits", "Fire bonus / burns", "Explosions"] },'
  );

  // Do not allow Count 25 to be skipped by a large Rogue Point jump.
  source = source.replace(
    '    if (s.buffCount >= 25 && !s.coolBrainzSpawned) {',
    '    if ((s.buffCount >= 25 || s.roguePoints >= 250) && !s.coolBrainzSpawned) {'
  );

  return source;
};