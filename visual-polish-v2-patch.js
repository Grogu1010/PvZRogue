window.__patchPvZRogueVisualPolish = function patchPvZRogueVisualPolish(source) {
  // Cosmetic/balance polish must never be able to block game startup.
  source = source.replaceAll('"BOGOF"', '"BOGOF Deal on Pineapples!"');
  source = source.replaceAll('"BOGOF Deal!"', '"BOGOF Deal on Pineapples!"');

  // Cabbage Pult should trade raw lane DPS for anti-air/lobber utility.
  source = source.replace(
    '  cabbagepult: { name: "Cabbage Pult", icon: "🥬", cost: 100, hp: 300, kind: "lobber", damage: 34, fireRate: 1.7, hitsAir: true },',
    '  cabbagepult: { name: "Cabbage Pult", icon: "🥬", cost: 100, hp: 300, kind: "lobber", damage: 28, fireRate: 1.9, hitsAir: true },'
  );

  // Put zombie discovery in a true body portal so the seed bank / transformed lawn
  // can never overlap or crop it. If surrounding UI changes later, simply keep the
  // existing discovery screen rather than failing preflight.
  const introStart = source.indexOf('{state.zombieIntro && (()=>{');
  const introEnd = introStart >= 0 ? source.indexOf('{state.mythicReward', introStart) : -1;
  if (introStart >= 0 && introEnd > introStart) {
    const intro = `{state.zombieIntro && createPortal((()=>{
      const type=state.zombieIntro;
      const def=zombieDefs[type];
      const info=ZOMBIE_INTEL[type]||{does:"Unknown threat.",weak:[],strong:[]};
      const st=zombieIntelStats(type,state);
      const plantKey=name=>Object.keys(plantDefs).find(k=>plantDefs[k]?.name===name);
      const matchup=(name,kind)=>{const k=plantKey(name);return <div key={kind+name} className={\`flex min-h-[52px] items-center gap-2.5 rounded-xl border px-2.5 py-2 \${kind==="weak"?"border-rose-300/30 bg-rose-950/35":"border-lime-300/30 bg-lime-950/30"}\`}><div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-black/30 p-0.5">{k?<PlantSprite type={k} action="idle" small />:<div className="grid h-full w-full place-items-center text-xs font-black text-slate-400">?</div>}</div><div className="min-w-0"><div className="truncate text-xs font-black text-white sm:text-sm">{name}</div><div className={\`text-[8px] font-black uppercase tracking-[.1em] \${kind==="weak"?"text-rose-300":"text-lime-300"}\`}>{kind==="weak"?"Good counter":"Bad matchup"}</div></div></div>};
      return <div className="fixed inset-0 z-[5000] flex items-center justify-center overflow-hidden bg-slate-950/92 p-2 backdrop-blur-md sm:p-3">
        <motion.div initial={{scale:.96,opacity:0,y:8}} animate={{scale:1,opacity:1,y:0}} className="w-full max-w-5xl max-h-[calc(100dvh-16px)] overflow-hidden rounded-[24px] border border-cyan-300/35 bg-gradient-to-br from-slate-950 via-slate-950 to-emerald-950 text-white shadow-2xl sm:max-h-[calc(100dvh-24px)]">
          <div className="grid max-h-[calc(100dvh-16px)] md:grid-cols-[270px_minmax(0,1fr)] sm:max-h-[calc(100dvh-24px)]">
            <div className="relative flex min-h-[180px] items-center justify-center overflow-hidden border-b border-white/10 bg-gradient-to-b from-cyan-950/75 via-sky-950/65 to-emerald-950/75 p-3 md:min-h-0 md:border-b-0 md:border-r">
              <div className="absolute inset-0 opacity-40" style={{backgroundImage:"radial-gradient(circle at 50% 48%, rgba(103,232,249,.34), transparent 46%)"}} />
              <div className="absolute left-3 top-3 rounded-full border border-cyan-200/30 bg-black/35 px-2.5 py-1 text-[8px] font-black uppercase tracking-[.2em] text-cyan-200">New threat</div>
              <div className="relative h-44 w-44 sm:h-52 sm:w-52 md:h-56 md:w-56" style={{transform:"scaleX(-1)"}}><ZombieSprite type={type} hpPct={100} flying={!!def.flying}/></div>
              {st.tags.length>0&&<div className="absolute bottom-3 left-3 right-3 flex flex-wrap justify-center gap-1">{st.tags.map(t=><span key={t} className="rounded-full border border-white/10 bg-black/35 px-2 py-0.5 text-[8px] font-bold text-cyan-100">{t}</span>)}</div>}
            </div>
            <div className="min-h-0 overflow-y-auto p-3 sm:p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0"><div className="text-[9px] font-black uppercase tracking-[.24em] text-cyan-300">Zombie discovered</div><div className="mt-0.5 truncate text-2xl font-black leading-none tracking-tight sm:text-3xl">{def.name}</div></div>
                <div className="shrink-0 rounded-xl border border-amber-300/20 bg-amber-950/25 px-2.5 py-1.5 text-right"><div className="text-[8px] font-black uppercase tracking-wider text-amber-300">Appears</div><div className="text-sm font-black">Count {st.unlock}</div></div>
              </div>
              <p className="mt-2 text-xs leading-snug text-slate-300 sm:text-sm">{info.does}</p>
              <div className="mt-2.5 grid grid-cols-3 gap-1.5">
                <div className="rounded-xl border border-white/10 bg-white/[.04] p-2"><div className="text-[8px] font-black uppercase tracking-wider text-slate-400">HP</div><div className="mt-0.5 text-lg font-black">{st.hp.toLocaleString()}</div></div>
                <div className="rounded-xl border border-white/10 bg-white/[.04] p-2"><div className="text-[8px] font-black uppercase tracking-wider text-slate-400">Damage</div><div className="mt-0.5 text-lg font-black">{st.damage}</div></div>
                <div className="rounded-xl border border-white/10 bg-white/[.04] p-2"><div className="text-[8px] font-black uppercase tracking-wider text-slate-400">Speed</div><div className="mt-0.5 text-lg font-black">{st.speed}</div></div>
              </div>
              <div className="mt-2.5 grid gap-2.5 md:grid-cols-2">
                <div><div className="mb-1 text-[10px] font-black uppercase tracking-[.14em] text-lime-300">Strong against</div><div className="grid gap-1.5">{info.strong.map(x=>matchup(x,"strong"))}</div></div>
                <div><div className="mb-1 text-[10px] font-black uppercase tracking-[.14em] text-rose-300">Weak to / counters</div><div className="grid gap-1.5">{info.weak.map(x=>matchup(x,"weak"))}</div></div>
              </div>
              <div className="mt-2.5 flex justify-end"><button onClick={()=>setState(s=>({...s,zombieIntro:null,running:true}))} className="rounded-xl bg-cyan-300 px-4 py-2 text-xs font-black text-slate-950 shadow-lg transition hover:bg-cyan-200">Continue</button></div>
            </div>
          </div>
        </motion.div>
      </div>;
    })(), document.body)}
            `;
    source = source.slice(0,introStart) + intro + source.slice(introEnd);
  }

  return source;
};
