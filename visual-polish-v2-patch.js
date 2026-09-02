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

  // Redraw the roughest recently-added inline SVG sprites. These are deliberately
  // best-effort replacements: if a future gameplay patch renames a sprite, visual
  // polish skips it rather than stopping the game from booting.
  const replaceSprite = (name, replacement) => {
    const re = new RegExp(`function ${name}\\([^\\n]*\\) \\{[\\s\\S]*?\\n\\}`, 'm');
    if (re.test(source)) source = source.replace(re, replacement);
  };

  const dragonRiderArt = String.raw`
function DragonRiderZombieSprite() {
  return <svg viewBox="0 0 96 82" className="h-full w-full overflow-visible">
    <defs>
      <linearGradient id="drWing" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#9ac45e"/><stop offset=".55" stopColor="#5c8f3f"/><stop offset="1" stopColor="#345b35"/></linearGradient>
      <radialGradient id="drBody" cx="36%" cy="28%" r="78%"><stop offset="0" stopColor="#91bc55"/><stop offset=".55" stopColor="#5f933f"/><stop offset="1" stopColor="#315530"/></radialGradient>
      <linearGradient id="drBelly" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#d9c574"/><stop offset="1" stopColor="#a98e4a"/></linearGradient>
      <linearGradient id="drLeather" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8d5a38"/><stop offset="1" stopColor="#4b2e24"/></linearGradient>
    </defs>
    <ellipse cx="45" cy="75" rx="31" ry="4.5" fill="#061d13" opacity=".22"/>
    <motion.g animate={{y:[0,-2.5,0,1.5,0]}} transition={{duration:.82,repeat:Infinity,ease:"easeInOut"}}>
      <motion.g animate={{rotate:[-7,10,-7]}} transition={{duration:.42,repeat:Infinity,ease:"easeInOut"}} style={{transformOrigin:"39px 47px"}}>
        <path d="M39 48 C30 31 18 20 5 25 C12 29 12 37 7 45 C18 40 28 45 38 56 Z" fill="url(#drWing)" stroke="#284b2f" strokeWidth="2.4"/>
        <path d="M35 46 C27 38 20 31 12 29 M33 50 C24 48 17 48 10 45" fill="none" stroke="#355e35" strokeWidth="1.5" opacity=".8"/>
        <path d="M12 29 L7 45 M20 34 L15 44 M28 41 L23 48" stroke="#b5d072" strokeWidth="1" opacity=".55"/>
      </motion.g>
      <motion.g animate={{rotate:[8,-11,8]}} transition={{duration:.42,repeat:Infinity,ease:"easeInOut"}} style={{transformOrigin:"54px 46px"}}>
        <path d="M54 47 C65 29 79 20 92 27 C84 31 84 39 91 46 C79 42 68 46 58 56 Z" fill="url(#drWing)" stroke="#284b2f" strokeWidth="2.4"/>
        <path d="M58 45 C67 36 75 31 84 29 M59 50 C69 47 78 47 88 45" fill="none" stroke="#355e35" strokeWidth="1.5" opacity=".8"/>
      </motion.g>
      <path d="M25 55 C14 57 10 65 4 61 C10 69 21 68 31 62" fill="none" stroke="#3f7139" strokeWidth="6" strokeLinecap="round"/>
      <path d="M20 56 C24 39 38 34 55 37 C68 39 74 49 69 59 C63 68 43 70 28 64 C23 62 20 59 20 56 Z" fill="url(#drBody)" stroke="#284b2f" strokeWidth="2.6"/>
      <path d="M29 61 C39 66 54 65 64 59 C55 62 41 61 31 56 Z" fill="url(#drBelly)" opacity=".88"/>
      <path d="M55 39 C63 34 69 30 75 32 C80 34 83 39 82 44 L75 52 L67 49 L62 43 Z" fill="url(#drBody)" stroke="#284b2f" strokeWidth="2.4"/>
      <path d="M72 34 L76 27 L80 35 M63 36 L63 29 L69 35" fill="#d8cf8c" stroke="#6e663d" strokeWidth="1.5"/>
      <path d="M74 42 C82 38 91 40 95 45 C91 51 83 53 74 49 Z" fill="#759f48" stroke="#284b2f" strokeWidth="2.1"/>
      <path d="M88 48 Q91 51 94 48" fill="none" stroke="#2d2b19" strokeWidth="1.2"/>
      <circle cx="77" cy="39" r="3" fill="#f5db62" stroke="#35552d" strokeWidth="1.1"/><circle cx="77.8" cy="39.2" r="1.1" fill="#24180d"/>
      <path d="M73 46 Q80 48 87 45" fill="none" stroke="#2f4927" strokeWidth="1.3"/>
      <path d="M80 49 l2 3 l2.2-3 M86 48.5 l2 2.7 l2-3" fill="#f2e7bc" stroke="#7b714c" strokeWidth=".7"/>
      <motion.path d="M94 45 C101 41 106 44 111 41 C108 46 104 49 111 52 C104 54 101 58 94 51 Z" fill="#ff9b32" stroke="#d24c16" strokeWidth="1.4" animate={{scaleX:[.65,1.05,.8]}} transition={{duration:.28,repeat:Infinity}} style={{transformOrigin:"94px 48px"}}/>
      <path d="M34 41 C40 35 53 34 59 39 L58 48 C50 51 41 50 34 45 Z" fill="url(#drLeather)" stroke="#3f2a20" strokeWidth="2"/>
      <path d="M37 46 Q46 51 57 46" fill="none" stroke="#d8bd75" strokeWidth="1.6"/>
      <g transform="translate(37 7)">
        <path d="M8 28 C7 34 8 39 12 43 M23 28 C25 34 24 39 20 43" fill="none" stroke="#6f855e" strokeWidth="4" strokeLinecap="round"/>
        <path d="M7 18 C6 27 8 32 12 35 L23 34 C26 27 25 20 22 16 Z" fill="#704a39" stroke="#3e2a22" strokeWidth="2"/>
        <path d="M10 18 L4 28 M22 18 L28 26" fill="none" stroke="#779b68" strokeWidth="3.7" strokeLinecap="round"/>
        <path d="M4 28 Q11 32 16 37 M28 26 Q22 31 17 37" fill="none" stroke="#d8bd75" strokeWidth="1.3"/>
        <ellipse cx="16" cy="11" rx="10.5" ry="10" fill="#82a873" stroke="#36513a" strokeWidth="2"/>
        <path d="M7 7 C11 0 22 0 27 6 L24 9 C19 6 13 6 8 10 Z" fill="#7a5639" stroke="#44301f" strokeWidth="1.8"/>
        <path d="M9 4 L11 -2 L14 5 M20 4 L22 -1 L24 6" fill="#8b623f" stroke="#44301f" strokeWidth="1.3"/>
        <ellipse cx="12" cy="10" rx="2.3" ry="2.8" fill="#f1f2d0"/><ellipse cx="20" cy="10" rx="2.3" ry="2.8" fill="#f1f2d0"/><circle cx="12.5" cy="11" r="1" fill="#263025"/><circle cx="20.5" cy="11" r="1" fill="#263025"/>
        <path d="M12 16 Q16 19 21 16" fill="none" stroke="#31402f" strokeWidth="1.7"/><path d="M14 17 L15 20 M18 17 L19 20" stroke="#ece8c8" strokeWidth="1.2"/>
      </g>
      <path d="M49 36 C48 31 52 28 56 29 C55 34 53 37 49 36 Z" fill="#97bd5e" stroke="#35552d" strokeWidth="1.3"/>
    </motion.g>
  </svg>;
}
`;

  const sublimeArt = String.raw`
function SublimeSprite({ action="idle", small=false }) {
  const firing=action==="attack";
  return <SpriteFrame small={small} action={firing?"attack":"idle"}><LeafShadow/><defs>
    <radialGradient id="slRind2" cx="32%" cy="22%" r="78%"><stop offset="0" stopColor="#efff78"/><stop offset=".45" stopColor="#a8df3d"/><stop offset="1" stopColor="#4d8f2a"/></radialGradient>
    <linearGradient id="slLeaf2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8ee85c"/><stop offset="1" stopColor="#2d7a35"/></linearGradient>
    <radialGradient id="slPulp2" cx="40%" cy="35%" r="70%"><stop offset="0" stopColor="#f5ff9b"/><stop offset="1" stopColor="#b9e949"/></radialGradient>
  </defs><motion.g animate={firing?{x:[0,-3,2,0],rotate:[0,-5,4,0],scaleX:[1,.92,1.05,1]}:{rotate:[-1.2,1.3,-1.2],y:[0,-1,0]}} transition={{duration:firing?.34:1.9,repeat:Infinity}} style={{transformOrigin:"31px 52px"}}>
    <path d="M28 59 C25 49 27 41 31 34" stroke="#397f37" strokeWidth="7" fill="none" strokeLinecap="round"/>
    <path d="M27 55 C18 46 9 49 7 58 C15 62 24 60 30 56 Z" fill="url(#slLeaf2)" stroke="#2c6d31" strokeWidth="2"/>
    <path d="M31 57 C39 47 49 49 54 57 C47 62 38 61 30 58 Z" fill="#559f3c" stroke="#2c6d31" strokeWidth="2"/>
    <path d="M17 23 C19 13 27 8 38 9 C49 10 55 17 54 28 C54 39 47 46 35 47 C23 48 15 40 15 31 C15 28 16 25 17 23 Z" fill="url(#slRind2)" stroke="#477d29" strokeWidth="2.6"/>
    <path d="M20 18 C27 11 40 10 48 17" fill="none" stroke="#efff9c" strokeWidth="2" opacity=".5"/>
    <path d="M29 10 C26 4 31 0 37 4 C36 8 33 11 29 10 Z" fill="#4a9a38" stroke="#2e7131" strokeWidth="1.6"/>
    <path d="M35 9 C39 3 46 4 48 10 C43 12 39 12 35 9 Z" fill="#69b946" stroke="#2e7131" strokeWidth="1.6"/>
    {[{x:22,y:18},{x:43,y:19},{x:20,y:35},{x:47,y:33},{x:30,y:14},{x:38,y:41}].map((d,i)=><circle key={i} cx={d.x} cy={d.y} r="1.1" fill="#6ca52d" opacity=".55"/>)}
    <path d="M23 23 Q28 19 32 23" fill="none" stroke="#3f6626" strokeWidth="2.1" strokeLinecap="round"/><path d="M36 22 Q41 18 46 21" fill="none" stroke="#3f6626" strokeWidth="2.1" strokeLinecap="round"/>
    <ellipse cx="28" cy="26" rx="4.2" ry="5.1" fill="#f6f6da" stroke="#557833" strokeWidth="1"/><ellipse cx="41" cy="25" rx="4.2" ry="5.1" fill="#f6f6da" stroke="#557833" strokeWidth="1"/>
    <circle cx="29.4" cy="27" r="1.7" fill="#26311d"/><circle cx="42.2" cy="26" r="1.7" fill="#26311d"/>
    <path d="M29 36 Q34 32 40 35 Q36 39 30 38 Z" fill="#527728" stroke="#385a22" strokeWidth="1.4"/><path d="M31 36 Q35 34 38 36" fill="none" stroke="#dff781" strokeWidth="1.1"/>
    <g transform="translate(45 29)"><path d="M0 0 C8 -3 13 0 14 5 C11 10 5 11 0 8 Z" fill="url(#slPulp2)" stroke="#54852b" strokeWidth="1.6"/><path d="M3 2 L10 7 M8 1 L5 8" stroke="#8fba3d" strokeWidth=".8" opacity=".8"/></g>
    <motion.g animate={firing?{x:[0,26],opacity:[1,.95,0],rotate:[0,180,360]}:{opacity:0}} transition={{duration:.36,repeat:Infinity}}>
      <circle cx="55" cy="34" r="4.7" fill="#b8ec46" stroke="#5b8f2c" strokeWidth="1.4"/><path d="M52 34 L58 34 M55 31 L55 37" stroke="#7baa31" strokeWidth=".8"/>
    </motion.g>
    <path d="M18 43 C16 47 17 51 20 53" fill="none" stroke="#b6df44" strokeWidth="2.1" strokeLinecap="round" opacity=".7"/>
  </motion.g></SpriteFrame>;
}
`;

  const poppingCornArt = String.raw`
function PoppingCornKernelSprite({ action="idle", small=false }) {
  const pop=action==="attack";
  return <SpriteFrame small={small} action={pop?"attack":"idle"}><LeafShadow/><defs>
    <linearGradient id="pcHusk2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#85d04e"/><stop offset="1" stopColor="#307b35"/></linearGradient>
    <radialGradient id="pcCob2" cx="35%" cy="22%" r="80%"><stop offset="0" stopColor="#fff28a"/><stop offset=".5" stopColor="#efc93d"/><stop offset="1" stopColor="#b9781e"/></radialGradient>
  </defs><motion.g animate={pop?{y:[0,3,-4,0],scaleY:[1,.9,1.1,1]}:{rotate:[-1,1,-1],y:[0,-1,0]}} transition={{duration:pop?.28:1.8,repeat:Infinity}} style={{transformOrigin:"32px 57px"}}>
    <path d="M31 58 C22 53 14 55 9 61 C17 63 25 62 32 59 Z" fill="#4f9a3b" stroke="#2c6e31" strokeWidth="2"/>
    <path d="M34 59 C42 53 51 55 56 61 C48 64 40 62 33 60 Z" fill="#64ad41" stroke="#2c6e31" strokeWidth="2"/>
    <path d="M18 56 C17 39 20 20 29 9 C29 28 31 43 33 57 Z" fill="url(#pcHusk2)" stroke="#2c6e31" strokeWidth="2.1"/>
    <path d="M46 56 C47 38 44 20 35 9 C35 27 33 44 31 57 Z" fill="#5cab3f" stroke="#2c6e31" strokeWidth="2.1"/>
    <path d="M23 51 C22 37 23 18 31 10 C38 11 42 27 41 47 C40 54 37 58 32 58 C27 58 24 55 23 51 Z" fill="url(#pcCob2)" stroke="#9d671c" strokeWidth="2.2"/>
    {[0,1,2,3,4,5].map(r=><g key={r}>{[0,1,2].map(c=><ellipse key={c} cx={27.5+c*4.5+(r%2?1.3:0)} cy={17+r*6.1} rx="2" ry="2.5" fill={(r+c)%2?"#fff086":"#ffd950"} stroke="#c18a25" strokeWidth=".45"/>)}</g>)}
    <path d="M27 10 L31 3 L35 10 M31 9 L39 5" fill="#67b746" stroke="#2d7130" strokeWidth="1.6" strokeLinecap="round"/>
    <path d="M26 29 Q29 26 31 29 M34 29 Q37 26 39 29" fill="none" stroke="#76511a" strokeWidth="1.7" strokeLinecap="round"/>
    <ellipse cx="29" cy="31" rx="2.2" ry="2.7" fill="#f6f2ca"/><ellipse cx="37" cy="31" rx="2.2" ry="2.7" fill="#f6f2ca"/><circle cx="29.5" cy="31.8" r="1" fill="#3d2c15"/><circle cx="37.5" cy="31.8" r="1" fill="#3d2c15"/>
    <path d="M29 39 Q33 42 37 38" stroke="#79521d" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
    {pop&&<motion.g animate={{y:[0,-25],opacity:[1,.85,0],scale:[.65,1.15,1.35]}} transition={{duration:.4,repeat:Infinity}}>
      <path d="M23 8 C19 3 24 0 28 4 C27 -1 34 -2 34 4 C38 0 43 3 40 8 C36 11 27 11 23 8 Z" fill="#fffbed" stroke="#d9cfaf" strokeWidth="1.2"/>
      <circle cx="20" cy="13" r="2.6" fill="#fffbed"/><circle cx="44" cy="12" r="2.3" fill="#fffbed"/>
    </motion.g>}
  </motion.g></SpriteFrame>;
}
`;

  replaceSprite('DragonRiderZombieSprite', dragonRiderArt.trim());
  replaceSprite('SublimeSprite', sublimeArt.trim());
  replaceSprite('PoppingCornKernelSprite', poppingCornArt.trim());

  return source;
};
