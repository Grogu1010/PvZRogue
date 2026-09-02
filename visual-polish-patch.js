window.__patchPvZRogueVisualPolish = function patchPvZRogueVisualPolish(source) {
  // Keep the Pineapple deal name exact everywhere downstream patches see it.
  source = source.replaceAll('"BOGOF"', '"BOGOF Deal on Pineapples!"');
  source = source.replaceAll('"BOGOF Deal!"', '"BOGOF Deal on Pineapples!"');

  // Replace the zombie discovery UI wholesale. It must portal to document.body;
  // otherwise transformed game containers make `fixed` behave like a lawn-local modal.
  const introStart = source.indexOf('{state.zombieIntro && (()=>{');
  const introEnd = introStart >= 0 ? source.indexOf('{state.mythicReward', introStart) : -1;
  if (introStart < 0 || introEnd < 0) throw new Error('Visual polish patch could not find zombie discovery block.');
  const intro = `{state.zombieIntro && createPortal((()=>{
    const type=state.zombieIntro;
    const def=zombieDefs[type];
    const info=ZOMBIE_INTEL[type]||{does:"Unknown threat.",weak:[],strong:[]};
    const st=zombieIntelStats(type,state);
    const plantKey=name=>Object.keys(plantDefs).find(k=>plantDefs[k]?.name===name);
    const matchup=(name,kind)=>{const k=plantKey(name);return <div key={kind+name} className={\`flex min-h-[58px] items-center gap-3 rounded-xl border px-3 py-2 \${kind==="weak"?"border-rose-300/30 bg-rose-950/35":"border-lime-300/30 bg-lime-950/30"}\`}><div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black/30 p-0.5">{k?<PlantSprite type={k} action="idle" small />:<div className="grid h-full w-full place-items-center text-xs font-black text-slate-400">?</div>}</div><div className="min-w-0"><div className="truncate text-sm font-black text-white">{name}</div><div className={\`text-[9px] font-black uppercase tracking-[.12em] \${kind==="weak"?"text-rose-300":"text-lime-300"}\`}>{kind==="weak"?"Good counter":"Bad matchup"}</div></div></div>};
    return <div className="fixed inset-0 z-[5000] flex items-center justify-center overflow-hidden bg-slate-950/90 p-3 backdrop-blur-md">
      <motion.div initial={{scale:.94,opacity:0,y:10}} animate={{scale:1,opacity:1,y:0}} className="w-full max-w-5xl max-h-[calc(100dvh-24px)] overflow-hidden rounded-[26px] border border-cyan-300/35 bg-gradient-to-br from-slate-950 via-slate-950 to-emerald-950 text-white shadow-2xl">
        <div className="grid max-h-[calc(100dvh-24px)] md:grid-cols-[300px_minmax(0,1fr)]">
          <div className="relative flex min-h-[220px] items-center justify-center overflow-hidden border-b border-white/10 bg-gradient-to-b from-cyan-950/75 via-sky-950/65 to-emerald-950/75 p-4 md:min-h-0 md:border-b-0 md:border-r">
            <div className="absolute inset-0 opacity-40" style={{backgroundImage:"radial-gradient(circle at 50% 48%, rgba(103,232,249,.34), transparent 46%)"}} />
            <div className="absolute left-4 top-4 rounded-full border border-cyan-200/30 bg-black/35 px-3 py-1 text-[9px] font-black uppercase tracking-[.22em] text-cyan-200">New threat</div>
            <div className="relative h-56 w-56 md:h-64 md:w-64" style={{transform:"scaleX(-1)"}}><ZombieSprite type={type} hpPct={100} flying={!!def.flying}/></div>
            {st.tags.length>0&&<div className="absolute bottom-4 left-4 right-4 flex flex-wrap justify-center gap-1">{st.tags.map(t=><span key={t} className="rounded-full border border-white/10 bg-black/35 px-2 py-1 text-[9px] font-bold text-cyan-100">{t}</span>)}</div>}
          </div>
          <div className="min-h-0 overflow-y-auto p-4 md:p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0"><div className="text-[10px] font-black uppercase tracking-[.26em] text-cyan-300">Zombie discovered</div><div className="mt-1 truncate text-3xl font-black leading-none tracking-tight md:text-4xl">{def.name}</div></div>
              <div className="shrink-0 rounded-xl border border-amber-300/20 bg-amber-950/25 px-3 py-2 text-right"><div className="text-[9px] font-black uppercase tracking-wider text-amber-300">Appears</div><div className="text-base font-black">Count {st.unlock}</div></div>
            </div>
            <p className="mt-2 text-sm leading-snug text-slate-300">{info.does}</p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <div className="rounded-xl border border-white/10 bg-white/[.04] p-2.5"><div className="text-[9px] font-black uppercase tracking-wider text-slate-400">HP</div><div className="mt-0.5 text-xl font-black">{st.hp.toLocaleString()}</div></div>
              <div className="rounded-xl border border-white/10 bg-white/[.04] p-2.5"><div className="text-[9px] font-black uppercase tracking-wider text-slate-400">Damage</div><div className="mt-0.5 text-xl font-black">{st.damage}</div></div>
              <div className="rounded-xl border border-white/10 bg-white/[.04] p-2.5"><div className="text-[9px] font-black uppercase tracking-wider text-slate-400">Speed</div><div className="mt-0.5 text-xl font-black">{st.speed}</div></div>
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <div><div className="mb-1.5 text-[11px] font-black uppercase tracking-[.16em] text-lime-300">Strong against</div><div className="grid gap-1.5">{info.strong.map(x=>matchup(x,"strong"))}</div></div>
              <div><div className="mb-1.5 text-[11px] font-black uppercase tracking-[.16em] text-rose-300">Weak to / counters</div><div className="grid gap-1.5">{info.weak.map(x=>matchup(x,"weak"))}</div></div>
            </div>
            <div className="mt-3 flex justify-end"><button onClick={()=>setState(s=>({...s,zombieIntro:null,running:true}))} className="rounded-xl bg-cyan-300 px-5 py-2 text-sm font-black text-slate-950 shadow-lg transition hover:bg-cyan-200">Continue</button></div>
          </div>
        </div>
      </motion.div>
    </div>;
  })(), document.body)}
            `;
  source = source.slice(0,introStart) + intro + source.slice(introEnd);

  // Sublime: a purpose-built citrus launcher, with a barrel-like lime snout,
  // ammo fruit growing along the back stalk, and a much more recognizable silhouette.
  const sublimeRe = /function SublimeSprite\(\{ action="idle", small=false \}\) \{[\s\S]*?\n\}\n(?=function PlantSprite)/;
  if (!sublimeRe.test(source)) throw new Error('Visual polish patch could not find SublimeSprite.');
  const sublime = String.raw`function SublimeSprite({ action="idle", small=false }) {
  const firing=action==="attack";
  return <SpriteFrame small={small} action={firing?"attack":"idle"}><LeafShadow/><defs>
    <radialGradient id="slBody3" cx="30%" cy="22%" r="82%"><stop offset="0" stopColor="#f0ff86"/><stop offset=".42" stopColor="#a8df39"/><stop offset="1" stopColor="#347326"/></radialGradient>
    <linearGradient id="slStem3" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#7bd04d"/><stop offset="1" stopColor="#1f6530"/></linearGradient>
    <radialGradient id="slAmmo3" cx="32%" cy="25%" r="76%"><stop offset="0" stopColor="#fbffac"/><stop offset=".5" stopColor="#bee94b"/><stop offset="1" stopColor="#548b26"/></radialGradient>
  </defs><motion.g animate={firing?{x:[0,-3,3,0],rotate:[0,-5,3,0]}:{y:[0,-1,0],rotate:[-1.2,1.2,-1.2]}} transition={{duration:firing?.3:1.8,repeat:Infinity,ease:"easeInOut"}} style={{transformOrigin:"31px 52px"}}>
    <path d="M29 58 C28 48 27 40 31 32" fill="none" stroke="url(#slStem3)" strokeWidth="7" strokeLinecap="round"/>
    <path d="M27 55 C18 47 8 50 5 59 C14 62 24 60 30 56 Z" fill="#66ba43" stroke="#2b7431" strokeWidth="2"/><path d="M31 55 C40 47 50 49 58 58 C48 62 38 61 30 57 Z" fill="#50a63c" stroke="#276d31" strokeWidth="2"/>
    <motion.g animate={firing?{rotate:[0,-10,8,0],x:[0,-2,4,0]}:{rotate:[-2,2,-2]}} transition={{duration:firing?.26:1.7,repeat:Infinity}} style={{transformOrigin:"35px 28px"}}>
      <path d="M16 31 C13 18 22 8 36 7 C48 6 56 14 57 24 C58 34 50 44 38 46 C25 48 18 41 16 31 Z" fill="url(#slBody3)" stroke="#3c7327" strokeWidth="2.5"/>
      <path d="M19 21 C28 14 41 12 52 18" fill="none" stroke="#f6ffa6" strokeWidth="2.4" opacity=".46" strokeLinecap="round"/>
      <path d="M31 8 C28 1 35 -2 43 2 C41 7 36 10 31 8 Z" fill="#55a23a" stroke="#286a30" strokeWidth="1.8"/>
      <ellipse cx="30" cy="27" rx="3.5" ry="5" fill="#142015"/><ellipse cx="41" cy="26" rx="3.5" ry="5" fill="#142015"/><circle cx="29" cy="25" r="1" fill="#fff"/><circle cx="40" cy="24" r="1" fill="#fff"/><path d="M29 36 Q35 32 41 35" fill="none" stroke="#2b5121" strokeWidth="2" strokeLinecap="round"/>
      <motion.g animate={firing?{x:[0,7,0],scaleX:[1,1.16,1]}:{x:[0,1,0]}} transition={{duration:firing?.2:1.2,repeat:Infinity}} style={{transformOrigin:"53px 29px"}}><path d="M47 21 C57 18 65 22 67 29 C64 37 56 40 47 36 C51 31 51 26 47 21 Z" fill="#72b334" stroke="#376c25" strokeWidth="2.2"/><ellipse cx="63" cy="29" rx="5.5" ry="4.3" fill="#24421e"/><ellipse cx="64" cy="29" rx="2.5" ry="1.9" fill="#0b150c"/></motion.g>
    </motion.g>
    <g><path d="M15 47 Q9 35 18 27" fill="none" stroke="#3c8134" strokeWidth="3" strokeLinecap="round"/><circle cx="17" cy="27" r="5.7" fill="url(#slAmmo3)" stroke="#4d8127" strokeWidth="1.5"/><circle cx="11" cy="36" r="4.9" fill="url(#slAmmo3)" stroke="#4d8127" strokeWidth="1.4"/><circle cx="14" cy="45" r="4.4" fill="url(#slAmmo3)" stroke="#4d8127" strokeWidth="1.3"/></g>
    <motion.circle animate={firing?{x:[0,32],y:[0,-1],opacity:[1,1,0],rotate:[0,300]}:{opacity:0}} transition={{duration:.34,repeat:Infinity}} cx="64" cy="29" r="5" fill="url(#slAmmo3)" stroke="#4b7b24" strokeWidth="1.5"/>
  </motion.g></SpriteFrame>;
}
`;
  source = source.replace(sublimeRe, sublime + '\n');

  // Dragon Rider redraw: longer mount, readable wings/claws/tail, rider leaning
  // into the flight direction, and a more aggressive dragon head silhouette.
  const dragonRe = /function DragonRiderZombieSprite\(\) \{[\s\S]*?\n\}\n(?=function ZombieSprite)/;
  if (!dragonRe.test(source)) throw new Error('Visual polish patch could not find DragonRiderZombieSprite.');
  const dragon = String.raw`function DragonRiderZombieSprite() {
  return <svg viewBox="0 0 112 84" className="h-full w-full overflow-visible"><defs><linearGradient id="drBody2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#82c957"/><stop offset=".55" stopColor="#4f963c"/><stop offset="1" stopColor="#2b6934"/></linearGradient><linearGradient id="drWing2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#8bd05b"/><stop offset="1" stopColor="#356e35"/></linearGradient></defs><motion.g animate={{y:[0,-3,0,2,0],rotate:[-1,1,-1]}} transition={{duration:.72,repeat:Infinity,ease:"easeInOut"}} style={{transformOrigin:"58px 48px"}}>
    <ellipse cx="58" cy="76" rx="39" ry="5" fill="#061d13" opacity=".28"/>
    <path d="M78 51 C91 51 100 56 109 64 C99 62 92 63 84 68 C87 61 84 56 78 51 Z" fill="#417f39" stroke="#24542d" strokeWidth="2"/>
    <motion.path d="M47 46 C35 24 15 18 5 30 C19 28 29 38 40 54 Z" fill="url(#drWing2)" stroke="#275d31" strokeWidth="2.4" animate={{rotate:[-13,11,-13]}} transition={{duration:.34,repeat:Infinity}} style={{transformOrigin:"47px 47px"}}/>
    <motion.path d="M64 45 C78 21 98 19 108 32 C94 29 82 39 69 55 Z" fill="url(#drWing2)" stroke="#275d31" strokeWidth="2.4" animate={{rotate:[13,-11,13]}} transition={{duration:.34,repeat:Infinity}} style={{transformOrigin:"64px 47px"}}/>
    <path d="M24 51 C34 34 61 31 82 42 C91 47 91 59 80 65 C61 73 35 68 23 59 Z" fill="url(#drBody2)" stroke="#24532c" strokeWidth="2.7"/>
    <path d="M25 49 C16 42 8 42 2 48 L13 53 L2 59 C11 62 20 59 28 55 Z" fill="#65aa43" stroke="#24532c" strokeWidth="2.3"/>
    <path d="M20 46 L10 41 L15 51 M21 58 L10 65 L17 54" fill="#d77a25" stroke="#7c3d18" strokeWidth="2" strokeLinejoin="round"/>
    <circle cx="17" cy="49" r="2.4" fill="#ffd85c"/><circle cx="17.5" cy="49" r=".8" fill="#29170a"/>
    <path d="M33 63 l-7 8 l10 -4 M69 65 l5 8 l5 -9" fill="none" stroke="#285a30" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M48 41 C48 32 51 25 57 20" fill="none" stroke="#6a4a34" strokeWidth="5" strokeLinecap="round"/>
    <ellipse cx="59" cy="17" rx="8" ry="9" fill="#88aa68" stroke="#354d31" strokeWidth="2"/><path d="M51 12 C55 7 64 7 68 13 L65 14 C61 12 57 12 53 14 Z" fill="#e8e3b7" stroke="#8c825a" strokeWidth="1.4"/>
    <circle cx="56" cy="16" r="1.7" fill="#172016"/><circle cx="63" cy="16" r="1.7" fill="#172016"/><path d="M55 22 Q60 25 65 21" fill="none" stroke="#31452d" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M55 27 L46 37 M62 27 L71 36" fill="none" stroke="#789b62" strokeWidth="4" strokeLinecap="round"/><path d="M49 39 Q58 34 69 39" fill="none" stroke="#c9b98d" strokeWidth="2.4" strokeLinecap="round"/>
    <motion.path d="M3 48 C-4 45 -9 46 -14 50 C-8 51 -5 54 0 55" fill="#ff8a2a" stroke="#a74217" strokeWidth="2" animate={{scaleX:[.75,1.15,.75],opacity:[.72,1,.72]}} transition={{duration:.22,repeat:Infinity}} style={{transformOrigin:"2px 51px"}}/>
  </motion.g></svg>;
}
`;
  source = source.replace(dragonRe, dragon + '\n');

  return source;
};
