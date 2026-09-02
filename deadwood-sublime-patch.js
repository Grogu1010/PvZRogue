window.__patchPvZRogueDeadwoodSublime = function patchPvZRogueDeadwoodSublime(source) {
  function req(from, to, label) {
    if (!source.includes(from)) throw new Error(`Deadwood/Sublime patch could not find ${label}.`);
    source = source.replace(from, to);
  }

  // Plant definitions. Both automatically appear in the loadout because the game
  // builds that UI from Object.keys(plantDefs).
  req(
    '  poppingcornkernel: { name: "Popping Corn Kernel", icon: "🌽", cost: 125, hp: 300, kind: "airtrap", damage: 3000, fireRate: 1.0, airOnly: true },\n};',
    '  poppingcornkernel: { name: "Popping Corn Kernel", icon: "🌽", cost: 125, hp: 300, kind: "airtrap", damage: 3000, fireRate: 1.0, airOnly: true },\n  deadwood: { name: "Deadwood", icon: "🪵", cost: 200, hp: 760, kind: "deadwood" },\n  sublime: { name: "Sublime", icon: "🍋", cost: 225, hp: 340, kind: "sublime", damage: 15, fireRate: 0.25 },\n};',
    'new plant definitions'
  );

  // Full buff pools. Sublime can become decent with investment, but its base card
  // remains intentionally ordinary for the price.
  const globalAnchor = 'const globalBuffs = [';
  req(globalAnchor, `plantBuffs.deadwood = [
  ["Dense Dead Bark", "+180 HP", p => ({ ...p, hpFlat:(p.hpFlat||0)+180 })],
  ["Thicker Fog", "+2 seconds Ghost lifetime", p => ({ ...p, ghostLife:(p.ghostLife||10)+2 })],
  ["Restless Spirits", "+5 Ghost damage per second", p => ({ ...p, ghostDps:(p.ghostDps||20)+5 })],
  ["Fast Haunting", "Ghosts spread 0.2 seconds sooner", p => ({ ...p, ghostSpread:Math.max(.35,(p.ghostSpread||1)-.2) })],
  ["Old Roots", "+30% HP", p => ({ ...p, hpMult:(p.hpMult||1)*1.3 })],
  ["Cold Grave", "Ghosts slow hosts slightly", p => ({ ...p, ghostSlow:true })],
  ["Crowded Crypt", "Ghost cap +1", p => ({ ...p, ghostCap:(p.ghostCap||3)+1 })],
  ["Cheap Coffin", "Cost -25 sun", p => ({ ...p, costFlat:(p.costFlat||0)-25 })],
  ["Possession", "New Ghosts stun their first host for 0.5s", p => ({ ...p, ghostStun:true })],
  ["Funeral Mist", "+5 Ghost DPS and +2s lifetime", p => ({ ...p, ghostDps:(p.ghostDps||20)+5, ghostLife:(p.ghostLife||10)+2 })],
];

plantBuffs.sublime = [
  ["Zestier Limes", "+5 lime damage", p => ({ ...p, damageFlat:(p.damageFlat||0)+5 })],
  ["Less Leisurely", "Fires every 3.5 seconds", p => ({ ...p, sublimeFireRate:1/3.5 })],
  ["Hard Rind", "+120 HP", p => ({ ...p, hpFlat:(p.hpFlat||0)+120 })],
  ["Long Ricochet", "Limes may jump two lanes instead of one", p => ({ ...p, limeLaneJump:2 })],
  ["Acidic Exit", "Death acid deals +5 DPS", p => ({ ...p, acidDps:(p.acidDps||15)+5 })],
  ["Lingering Sour", "Death acid lasts +2 seconds", p => ({ ...p, acidLife:(p.acidLife||5)+2 })],
  ["Cheap Citrus", "Cost -25 sun", p => ({ ...p, costFlat:(p.costFlat||0)-25 })],
  ["Double Lime", "20% chance to repeat the entire ricochet chain", p => ({ ...p, limeDouble:(p.limeDouble||0)+.2 })],
  ["Juicier Impact", "+50% lime damage", p => ({ ...p, damageMult:(p.damageMult||1)*1.5 })],
  ["Sour Patch", "Death acid covers a 5x5 area", p => ({ ...p, acidRadius:2 })],
];

${globalAnchor}`,
    'new plant buff pools'
  );

  // applyPlantStats rounds normal damage. Sublime needs its additive lime buffs too.
  req(
    '    damage: Math.round((d.damage || 0) * damageMult),',
    '    damage: Math.round(((d.damage || 0) + (m.damageFlat || 0)) * damageMult),',
    'additive plant damage support'
  );

  // Mythics. Sublime intentionally gets the exact ridiculous boardwide triple-lime
  // payoff requested; Deadwood's Mythic turns one living tree into a lawnwide fog source.
  const mythicAnchor = 'function zombieIntelStats(type, state) {';
  req(mythicAnchor, `Object.assign(MYTHIC_MODS, {
  deadwood:{name:"Purgatory Fog",desc:"While any Mythic Deadwood lives, every Pea and Fire Pea on the lawn becomes a Dead Pea without needing to cross the tree. Ghosts can stack to 5 and do not expire while their host lives.",mod:p=>({...p,mythicPurgatoryFog:true,ghostCap:5})},
  sublime:{name:"Lime Storm",desc:"Every attack fires three limes at every zombie on the board at once.",mod:p=>({...p,mythicLimeStorm:true})},
});

${mythicAnchor}`,
    'Mythic registry anchor'
  );

  // Custom art for both plants.
  const spriteMatch = source.match(/function PlantSprite\(([^)]*)\) \{/);
  if (!spriteMatch) throw new Error('Deadwood/Sublime patch could not find PlantSprite.');
  const art = String.raw`
function DeadwoodSprite({ action="idle", small=false }) {
  const active=action==="attack";
  return <SpriteFrame small={small} action={active?"attack":"idle"}><LeafShadow/><defs>
    <linearGradient id="dwBark" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#8b7969"/><stop offset=".55" stopColor="#51463f"/><stop offset="1" stopColor="#29272a"/></linearGradient>
    <radialGradient id="dwFog" cx="50%" cy="50%" r="60%"><stop offset="0" stopColor="#e7f7ee" stopOpacity=".9"/><stop offset="1" stopColor="#8fb5a8" stopOpacity=".05"/></radialGradient>
  </defs><motion.g animate={{rotate:[-1,1,-1]}} transition={{duration:2.4,repeat:Infinity}} style={{transformOrigin:"32px 55px"}}>
    <path d="M18 58 C20 49 22 38 23 24 C24 12 40 10 42 24 C43 38 46 49 48 58 Z" fill="url(#dwBark)" stroke="#242125" strokeWidth="2.5"/>
    <path d="M23 26 L12 17 L17 13 L26 19 M41 27 L52 17 L48 12 L38 20" fill="none" stroke="#4b403b" strokeWidth="6" strokeLinecap="round"/>
    <ellipse cx="28" cy="31" rx="4" ry="6" fill="#111318"/><ellipse cx="39" cy="31" rx="4" ry="6" fill="#111318"/>
    <circle cx="29" cy="31" r="1.3" fill="#bdebd8"/><circle cx="40" cy="31" r="1.3" fill="#bdebd8"/>
    <path d="M28 43 Q34 39 40 43" fill="none" stroke="#17171a" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M25 20 C29 16 36 16 41 20" fill="none" stroke="#b8c9c2" strokeWidth="2" opacity=".35"/>
    <motion.g animate={{y:[0,-18],opacity:[.15,.75,0],scale:[.8,1.25]}} transition={{duration:1.8,repeat:Infinity}}>
      <ellipse cx="25" cy="9" rx="12" ry="8" fill="url(#dwFog)"/><ellipse cx="41" cy="4" rx="14" ry="9" fill="url(#dwFog)"/><ellipse cx="32" cy="-5" rx="17" ry="10" fill="url(#dwFog)"/>
    </motion.g>
  </motion.g></SpriteFrame>;
}
function SublimeSprite({ action="idle", small=false }) {
  const firing=action==="attack";
  return <SpriteFrame small={small} action={firing?"attack":"idle"}><LeafShadow/><defs>
    <radialGradient id="slLime" cx="35%" cy="25%" r="70%"><stop offset="0" stopColor="#efff7a"/><stop offset=".5" stopColor="#9ee33d"/><stop offset="1" stopColor="#4b9d28"/></radialGradient>
  </defs><motion.g animate={firing?{x:[0,-2,3,0],rotate:[0,-4,3,0]}:{rotate:[-1.5,1.5,-1.5]}} transition={{duration:firing?.3:1.8,repeat:Infinity}} style={{transformOrigin:"31px 51px"}}>
    <path d="M28 57 C26 45 27 37 31 29" stroke="#45963b" strokeWidth="7" fill="none" strokeLinecap="round"/>
    <path d="M27 54 C18 46 10 49 8 58 C16 61 24 59 30 55 Z" fill="#62b940" stroke="#34772e" strokeWidth="2"/>
    <ellipse cx="33" cy="25" rx="18" ry="15" fill="url(#slLime)" stroke="#4b8c25" strokeWidth="2.5"/>
    <path d="M31 10 C30 4 36 2 42 6 C39 10 35 12 31 10 Z" fill="#4b9f38" stroke="#34772e" strokeWidth="1.8"/>
    <ellipse cx="27" cy="23" rx="3.2" ry="4.5" fill="#172315"/><ellipse cx="38" cy="23" rx="3.2" ry="4.5" fill="#172315"/>
    <circle cx="26" cy="21.5" r="1" fill="#fff"/><circle cx="37" cy="21.5" r="1" fill="#fff"/>
    <path d="M27 33 Q33 36 39 33" stroke="#315321" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
    <motion.circle animate={firing?{x:[0,22],opacity:[1,0]}:{opacity:0}} transition={{duration:.3,repeat:Infinity}} cx="48" cy="27" r="5" fill="#baf04a" stroke="#5d9c29" strokeWidth="1.5"/>
  </motion.g></SpriteFrame>;
}
`;
  source = source.replace(spriteMatch[0], art + '\n' + spriteMatch[0] + '\n  if (type === "deadwood") return <DeadwoodSprite action={action} small={small} />;\n  if (type === "sublime") return <SublimeSprite action={action} small={small} />;');

  // Sublime combat: one attack every 4 seconds by default. A lime starts with the
  // nearest grounded zombie in its row, then ricochets only farther into the wave,
  // moving at most one lane per hop (two with its buff). Each zombie is hit once.
  const shooterAnchor = '      if ((stats.kind === "shooter" || stats.kind === "lobber") && next.cd <= 0) {';
  req(shooterAnchor, `      if(next.type==="sublime"&&next.cd<=0){
        const limeRate=stats.mods.sublimeFireRate||stats.fireRate||.25;
        const live=zombies.filter(z=>z.hp>0);
        if(stats.mods.mythicLimeStorm&&live.length){
          live.forEach(z=>{z.hp-=stats.damage*3;});
          next.cd=(1/Math.max(.01,limeRate))*s.cooldownMult;
          if(DEVICE_TIER!=="ultra")floaties.push({id:makeId("limeStorm"),text:"🍋🍋🍋 LIME STORM",x:BOARD_W/2-58,y:20,life:.85});
          return next;
        }
        const first=live.filter(z=>!z.flying&&z.row===next.row&&z.x>next.col*CELL_W+35).sort((a,b)=>a.x-b.x)[0];
        if(first){
          const runChain=()=>{
            let cur=first,hit=new Set();
            const laneJump=stats.mods.limeLaneJump||1;
            while(cur&&!hit.has(cur.id)){
              cur.hp-=stats.damage;hit.add(cur.id);
              const cx=cur.x,cr=cur.row;
              cur=live.filter(z=>!z.flying&&z.hp>0&&!hit.has(z.id)&&z.x>cx&&Math.abs(z.row-cr)<=laneJump).sort((a,b)=>(a.x-cx)-(b.x-cx)||Math.abs(a.row-cr)-Math.abs(b.row-cr))[0];
            }
          };
          runChain();if(stats.mods.limeDouble&&Math.random()<stats.mods.limeDouble)runChain();
          next.cd=(1/Math.max(.01,limeRate))*s.cooldownMult;
          if(DEVICE_TIER!=="ultra")floaties.push({id:makeId("limeBounce"),text:"🍋 RICOCHET",x:first.x-14,y:first.row*CELL_H+4,life:.65});
        }
        return next;
      }

${shooterAnchor}`,
    'Sublime attack loop'
  );

  // Deadwood converts Peashooter and Fire Peashooter projectiles after they cross
  // through its fog. Mythic Deadwood makes the fog global while one is alive.
  const moveLine = '    projectiles = projectiles.map(pr => ({ ...pr, prevX: pr.x, x: pr.x + pr.speed * dt })).filter(pr => pr.x < BOARD_W + 80 && pr.pierce > 0);';
  req(moveLine, `${moveLine}
    const purgatory=(s.plantMods.deadwood||{}).mythicPurgatoryFog&&plants.some(dw=>dw.type==="deadwood"&&dw.hp>0);
    projectiles.forEach(pr=>{
      if(pr.source!=="peashooter"&&pr.source!=="firepeashooter")return;
      const crossed=plants.some(dw=>dw.type==="deadwood"&&dw.hp>0&&dw.row===pr.row&&(pr.prevX??pr.x)<dw.col*CELL_W+32&&pr.x>=dw.col*CELL_W+32);
      if(crossed||purgatory){pr.deadPea=true;pr.deadFirePea=!!pr.fire||pr.source==="firepeashooter";}
    });`,
    'projectile movement for Deadwood fog'
  );

  // Attach a distinct Ghost lineage on Dead Pea impact. A zombie can hold at most
  // three lineages normally. ghostHistory permanently remembers a lineage so that
  // a Ghost can never bounce back to a zombie it already infected.
  req(
    '        if (pr.slow) target.slow = Math.max(target.slow, 2.5);',
    `        if(pr.deadPea){
          const dm=s.plantMods.deadwood||{},cap=dm.ghostCap||3;
          target.ghosts=(target.ghosts||[]).filter(g=>g.life>0);
          target.ghostHistory=target.ghostHistory||[];
          if(target.ghosts.length<cap){
            const lineage=makeId("ghostLineage");
            target.ghostHistory=[...new Set([...target.ghostHistory,lineage])];
            target.ghosts.push({lineage,life:dm.ghostLife||10,dps:dm.ghostDps||20,spreadCd:dm.ghostSpread||1,eternal:!!dm.mythicPurgatoryFog});
            if(dm.ghostStun)target.stun=Math.max(target.stun||0,.5);
            if(DEVICE_TIER!=="ultra")floaties.push({id:makeId("haunt"),text:"👻 HAUNTED",x:target.x-12,y:target.row*CELL_H+3,life:.65});
          }
        }
        if (pr.slow) target.slow = Math.max(target.slow, 2.5);`,
    'Dead Pea impact hook'
  );

  // Ghost damage and spread. The same lineage cannot ever revisit a previous host,
  // preventing A->B->A ping-pong from manufacturing extra stacks.
  const zombieMapAnchor = '    zombies = zombies.map(z => {';
  req(zombieMapAnchor, `    for(const host of zombies){
      const dm=s.plantMods.deadwood||{},cap=dm.ghostCap||3;
      host.ghostHistory=host.ghostHistory||[];
      host.ghosts=(host.ghosts||[]).filter(g=>g.eternal||g.life>0).slice(0,cap);
      for(const g of host.ghosts){
        if(!g.eternal)g.life-=dt;
        g.spreadCd=(g.spreadCd??1)-dt;
        host.hp-=g.dps*dt;
        if(dm.ghostSlow)host.slow=Math.max(host.slow||0,.25);
        if(g.spreadCd<=0){
          g.spreadCd=dm.ghostSpread||1;
          const candidate=zombies.filter(other=>other.id!==host.id&&other.hp>0&&Math.abs(other.row-host.row)<=1&&Math.abs(other.x-host.x)<=CELL_W*1.5&&!((other.ghostHistory||[]).includes(g.lineage))&&(other.ghosts||[]).length<cap).sort((a,b)=>Math.abs(a.x-host.x)-Math.abs(b.x-host.x))[0];
          if(candidate){
            candidate.ghostHistory=[...new Set([...(candidate.ghostHistory||[]),g.lineage])];
            candidate.ghosts=[...(candidate.ghosts||[]),{lineage:g.lineage,life:dm.ghostLife||10,dps:g.dps,spreadCd:dm.ghostSpread||1,eternal:g.eternal}].slice(0,cap);
            if(DEVICE_TIER!=="ultra")floaties.push({id:makeId("ghostSpread"),text:"👻",x:candidate.x,y:candidate.row*CELL_H+4,life:.45});
          }
        }
      }
      host.ghosts=host.ghosts.filter(g=>g.eternal||g.life>0);
    }

${zombieMapAnchor}`,
    'Ghost update loop'
  );

  // Sublime death acid: 3x3 by default, five seconds, 15 DPS. The existing burn
  // zone ticker runs every .5s, so each tick is half the requested DPS.
  const deathAnchor = '    plants.filter(p => p.hp <= 0).forEach(p => {\n      const stats = applyPlantStats(p.type, s.plantMods, s);';
  req(deathAnchor, `    plants.filter(p => p.hp <= 0).forEach(p => {
      const stats = applyPlantStats(p.type, s.plantMods, s);
      if(p.type==="sublime"){
        const radius=stats.mods.acidRadius??1,life=stats.mods.acidLife||5,dps=stats.mods.acidDps||15;
        burns.push({id:makeId("acid"),row:p.row,col:p.col,radius,damage:dps*.5,life,tick:0,acid:true});
        if(DEVICE_TIER!=="ultra")floaties.push({id:makeId("acidSplash"),text:"🟢 ACID",x:p.col*CELL_W+12,y:p.row*CELL_H+12,life:.8});
      }`,
    'Sublime death hook'
  );

  return source;
};