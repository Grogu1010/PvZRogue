window.__patchPvZRogueZombieIntelUI = function patchPvZRogueZombieIntelUI(source) {
  // Keep matchup Intel concrete: zombies counter plants, not vague categories.
  const intel = {
    basic: { does: "A standard lane walker that bites blocking plants.", weak: ["Peashooter", "Bonk Choy", "Spikeweed"], strong: ["Sunflower", "Sun-shroom", "Iceberg Lettuce"] },
    imp: { does: "Very fast, fragile pressure zombie. Gargantuars can throw more of them.", weak: ["Sublime", "Spikeweed", "Snapdragon", "Cabbage Pult"], strong: ["Sunflower", "Sun-shroom", "Chomper"] },
    conehead: { does: "Armored early zombie with more health than a Basic.", weak: ["Bonk Choy", "Chomper", "Laser Bean", "Deadwood"], strong: ["Peashooter", "Sublime", "Sunflower"] },
    balloon: { does: "Flies over ordinary blockers unless grounded or hit by anti-air plants.", weak: ["Cactus", "Cabbage Pult", "Laser Bean", "Sublime"], strong: ["Wall Nut", "Spikeweed", "Bonk Choy"] },
    buckethead: { does: "Heavy armor makes it the toughest ordinary zombie before specialist enemies.", weak: ["Chomper", "Pineapple Puncher", "Laser Bean", "Deadwood"], strong: ["Peashooter", "Spikeweed", "Sublime"] },
    gargantuar: { does: "Massive tank that hits extremely hard and throws Imps.", weak: ["Pineapple Puncher", "Chomper", "Deadwood", "Cherry Bomb"], strong: ["Wall Nut", "Tall Nut", "Sublime"] },
    viscoelastic: { does: "Reflectable plant attacks deal 35% impact damage to Visco and reflect 35% back. Explosions, fire bonus and acid deal 0. Dead Pea Ghost damage is not reflected.", weak: ["Deadwood", "Iceberg Lettuce", "Spikeweed"], strong: ["Fire Peashooter", "Laser Bean", "Pineapple Puncher", "Cherry Bomb"] },
    coolbrainz: { does: "COUNT 25 BOSS. His body spans lanes 2-4 and can be attacked from all three, but he stands in and bites only lane 4. He only freezes lanes 2 and 3. Fire attacks deal 1.7x damage.", weak: ["Deadwood", "Fire Peashooter", "Snapdragon", "Torchwood"], strong: ["Wall Nut", "Tall Nut", "Iceberg Lettuce"] },
    dragonrider: { does: "A fast flying heavy that breathes fire and dismounts into its rider after the dragon takes enough damage.", weak: ["Popping Corn Kernel", "Cactus", "Laser Bean", "Sublime"], strong: ["Wall Nut", "Spikeweed", "Bonk Choy"] },
  };

  for (const [type, info] of Object.entries(intel)) {
    const re = new RegExp(`  ${type}: \\{ does: "[^"]*", weak: \\[[^\\]]*\\], strong: \\[[^\\]]*\\] \\},`);
    const replacement = `  ${type}: { does: ${JSON.stringify(info.does)}, weak: ${JSON.stringify(info.weak)}, strong: ${JSON.stringify(info.strong)} },`;
    source = source.replace(re, replacement);
  }

  // Sublime itself is not acid-immune; Visco is immune to Sublime's lingering acid.
  source = source.replace(', hitsAir: true, acidImmune: true },', ', hitsAir: true },');
  source = source.replace(
    'if (Math.abs(z.row - burn.row) <= burn.radius && Math.abs(zCol - burn.col) <= burn.radius) z.hp -= burn.damage;',
    'if (Math.abs(z.row - burn.row) <= burn.radius && Math.abs(zCol - burn.col) <= burn.radius && !(burn.acid && z.type === "viscoelastic")) z.hp -= burn.damage;'
  );

  // Make pea state readable at a glance: normal, fire, dead, and dead-fire all look distinct.
  const oldProjectileRender = '{state.projectiles.map(pr => <div key={pr.id} className="pointer-events-none select-none absolute z-40 text-lg" style={{ left: pr.x, top: pr.y }}>{pr.source === "cabbagepult" ? "🥬" : pr.source === "cactus" ? "•" : pr.source === "sunflower" ? "☀️" : "🟢"}</div>)}';
  const newProjectileRender = `{state.projectiles.map(pr => {
    const dead=!!pr.deadPea, fire=!!pr.fire||pr.source==="firepeashooter", deadFire=dead&&(!!pr.deadFirePea||fire);
    if(pr.source==="cabbagepult")return <div key={pr.id} className="pointer-events-none select-none absolute z-40 text-lg" style={{left:pr.x,top:pr.y}}>🥬</div>;
    if(pr.source==="cactus")return <div key={pr.id} className="pointer-events-none select-none absolute z-40 text-lg" style={{left:pr.x,top:pr.y}}>•</div>;
    if(pr.source==="sunflower")return <div key={pr.id} className="pointer-events-none select-none absolute z-40 text-lg" style={{left:pr.x,top:pr.y}}>☀️</div>;
    return <div key={pr.id} className="pointer-events-none select-none absolute z-40" style={{left:pr.x,top:pr.y}} title={deadFire?"Dead Fire Pea":dead?"Dead Pea":fire?"Fire Pea":"Pea"}>
      {deadFire?<div className="relative h-5 w-8"><span className="absolute left-0 top-1 text-sm opacity-70">👻</span><span className="absolute left-3 top-0 text-lg drop-shadow-[0_0_5px_rgba(251,146,60,.95)]">🟠</span><span className="absolute left-5 -top-1 text-xs">🔥</span></div>:
       dead?<div className="relative h-5 w-8"><span className="absolute left-0 top-1 text-sm opacity-75">👻</span><span className="absolute left-3 top-0 text-lg drop-shadow-[0_0_5px_rgba(167,243,208,.9)]">⚪</span></div>:
       fire?<div className="relative h-5 w-7"><span className="absolute left-0 top-0 text-lg drop-shadow-[0_0_5px_rgba(251,146,60,.95)]">🟠</span><span className="absolute left-3 -top-1 text-xs">🔥</span></div>:
       <div className="text-lg drop-shadow-[0_0_3px_rgba(74,222,128,.8)]">🟢</div>}
    </div>;
  })}`;
  if (source.includes(oldProjectileRender)) source = source.replace(oldProjectileRender, newProjectileRender);

  // Replace the old text-heavy discovery modal with a clearer threat card.
  const introRe = /\{state\.zombieIntro && \(\(\)=>\{const type=state\.zombieIntro;.*?\}\)\(\)\}/s;
  const intro = `{state.zombieIntro && (()=>{
    const type=state.zombieIntro;
    const def=zombieDefs[type];
    const info=ZOMBIE_INTEL[type]||{does:"Unknown threat.",weak:[],strong:[]};
    const st=zombieIntelStats(type,state);
    const plantKey=name=>Object.keys(plantDefs).find(k=>plantDefs[k]?.name===name);
    const matchup=(name,kind)=>{const k=plantKey(name),pd=k?plantDefs[k]:null;return <div key={kind+name} className={\`flex items-center gap-2 rounded-xl border px-3 py-2 \${kind==="weak"?"border-rose-300/30 bg-rose-950/35":"border-lime-300/30 bg-lime-950/30"}\`}><div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-black/25 text-xl">{pd?.icon||"🌱"}</div><div className="min-w-0"><div className="truncate text-sm font-black text-white">{name}</div><div className={\`text-[10px] font-bold uppercase tracking-wider \${kind==="weak"?"text-rose-300":"text-lime-300"}\`}>{kind==="weak"?"Good counter":"Bad matchup"}</div></div></div>};
    return <div className="fixed inset-0 z-[500] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
      <motion.div initial={{scale:.92,opacity:0,y:18}} animate={{scale:1,opacity:1,y:0}} className="w-full max-w-4xl overflow-hidden rounded-[28px] border border-cyan-300/30 bg-gradient-to-br from-slate-950 via-slate-950 to-emerald-950 text-white shadow-2xl">
        <div className="grid md:grid-cols-[260px_1fr]">
          <div className="relative flex min-h-[260px] items-center justify-center overflow-hidden border-b border-white/10 bg-gradient-to-b from-cyan-950/70 via-sky-950/60 to-emerald-950/70 p-6 md:border-b-0 md:border-r">
            <div className="absolute inset-0 opacity-30" style={{backgroundImage:"radial-gradient(circle at 50% 35%, rgba(103,232,249,.35), transparent 42%)"}} />
            <div className="relative h-48 w-48"><ZombieSprite type={type} hpPct={100} flying={!!def.flying}/></div>
            <div className="absolute left-5 top-5 rounded-full border border-cyan-200/30 bg-black/35 px-3 py-1 text-[10px] font-black uppercase tracking-[.22em] text-cyan-200">New threat</div>
            <div className="absolute bottom-5 left-5 right-5 flex flex-wrap gap-1.5">{st.tags.map(t=><span key={t} className="rounded-full border border-white/10 bg-black/30 px-2 py-1 text-[10px] font-bold text-cyan-100">{t}</span>)}</div>
          </div>
          <div className="p-5 md:p-7">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div><div className="text-[11px] font-black uppercase tracking-[.28em] text-cyan-300">Zombie discovered</div><div className="mt-1 text-4xl font-black tracking-tight md:text-5xl">{def.name}</div></div>
              <div className="rounded-2xl border border-amber-300/20 bg-amber-950/25 px-4 py-2 text-right"><div className="text-[10px] font-black uppercase tracking-wider text-amber-300">Appears</div><div className="text-xl font-black">Count {st.unlock}</div></div>
            </div>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base">{info.does}</p>
            <div className="mt-5 grid grid-cols-3 gap-2">
              <div className="rounded-2xl border border-white/10 bg-white/[.04] p-3"><div className="text-[10px] font-black uppercase tracking-wider text-slate-400">HP</div><div className="mt-1 text-2xl font-black">{st.hp.toLocaleString()}</div></div>
              <div className="rounded-2xl border border-white/10 bg-white/[.04] p-3"><div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Damage</div><div className="mt-1 text-2xl font-black">{st.damage}</div></div>
              <div className="rounded-2xl border border-white/10 bg-white/[.04] p-3"><div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Speed</div><div className="mt-1 text-2xl font-black">{st.speed}</div></div>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div><div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[.18em] text-lime-300"><span className="text-base">🛡️</span> Strong against</div><div className="grid gap-2">{info.strong.map(x=>matchup(x,"strong"))}</div></div>
              <div><div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[.18em] text-rose-300"><span className="text-base">🎯</span> Weak to / counters</div><div className="grid gap-2">{info.weak.map(x=>matchup(x,"weak"))}</div></div>
            </div>
            <div className="mt-6 flex justify-end"><button onClick={()=>setState(s=>({...s,zombieIntro:null,running:true}))} className="rounded-xl bg-cyan-300 px-6 py-3 text-sm font-black text-slate-950 shadow-lg transition hover:bg-cyan-200">Continue</button></div>
          </div>
        </div>
      </motion.div>
    </div>;
  })()}`;
  if (introRe.test(source)) source = source.replace(introRe, intro);

  return source;
};
