window.__patchPvZRogueVisualPolish = function patchPvZRogueVisualPolish(source) {
  source = source.replaceAll('"BOGOF"', '"BOGOF Deal on Pineapples!"');
  source = source.replace('className="w-full max-w-4xl overflow-hidden rounded-[28px] border border-cyan-300/30 bg-gradient-to-br from-slate-950 via-slate-950 to-emerald-950 text-white shadow-2xl"','className="w-full max-w-4xl max-h-[92dvh] overflow-hidden rounded-[28px] border border-cyan-300/30 bg-gradient-to-br from-slate-950 via-slate-950 to-emerald-950 text-white shadow-2xl"');
  source = source.replace('className="grid md:grid-cols-[260px_1fr]"','className="grid max-h-[92dvh] md:grid-cols-[210px_1fr]"');
  source = source.replace('className="relative flex min-h-[260px] items-center justify-center overflow-hidden border-b border-white/10 bg-gradient-to-b from-cyan-950/70 via-sky-950/60 to-emerald-950/70 p-6 md:border-b-0 md:border-r"','className="relative flex min-h-[190px] items-center justify-center overflow-hidden border-b border-white/10 bg-gradient-to-b from-cyan-950/70 via-sky-950/60 to-emerald-950/70 p-4 md:min-h-0 md:border-b-0 md:border-r"');
  source = source.replace('<div className="relative h-48 w-48"><ZombieSprite type={type} hpPct={100} flying={!!def.flying}/></div>','<div className="relative h-36 w-36 md:h-40 md:w-40" style={{transform:"scaleX(-1)"}}><ZombieSprite type={type} hpPct={100} flying={!!def.flying}/></div>');
  source = source.replace('<div className="p-5 md:p-7">','<div className="min-h-0 overflow-y-auto p-4 md:p-5">');
  source = source.replace('className="mt-1 text-4xl font-black tracking-tight md:text-5xl"','className="mt-1 text-3xl font-black tracking-tight md:text-4xl"');
  source = source.replace('className="mt-5 grid grid-cols-3 gap-2"','className="mt-4 grid grid-cols-3 gap-2"');
  source = source.replace('className="mt-5 grid gap-4 md:grid-cols-2"','className="mt-4 grid gap-3 md:grid-cols-2"');
  source = source.replace('className="mt-6 flex justify-end"','className="mt-4 flex justify-end"');
  source = source.replace('<div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-black/25 text-xl">{pd?.icon||"🌱"}</div>','<div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black/25 p-0.5">{k?<PlantSprite type={k} action="idle" small />:<div className="grid h-full w-full place-items-center text-lg">?</div>}</div>');

  const sublimeRe = /function SublimeSprite\(\{ action="idle", small=false \}\) \{[\s\S]*?\n\}\n(?=function PlantSprite)/;
  if (sublimeRe.test(source)) {
    const sublime = String.raw`function SublimeSprite({ action="idle", small=false }) {
  const firing=action==="attack";
  return <SpriteFrame small={small} action={firing?"attack":"idle"}><LeafShadow/><defs>
    <radialGradient id="slBody2" cx="32%" cy="24%" r="78%"><stop offset="0" stopColor="#e9ff72"/><stop offset=".42" stopColor="#9edc32"/><stop offset="1" stopColor="#397d25"/></radialGradient>
    <linearGradient id="slStem2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#75c947"/><stop offset="1" stopColor="#226b32"/></linearGradient>
    <radialGradient id="slAmmo2" cx="35%" cy="28%" r="75%"><stop offset="0" stopColor="#f4ff9c"/><stop offset=".52" stopColor="#b7e943"/><stop offset="1" stopColor="#538e24"/></radialGradient>
  </defs>
  <motion.g animate={firing?{x:[0,-3,2,0],rotate:[0,-5,2,0]}:{y:[0,-1,0],rotate:[-1.2,1.2,-1.2]}} transition={{duration:firing?.32:1.8,repeat:Infinity,ease:"easeInOut"}} style={{transformOrigin:"31px 52px"}}>
    <path d="M28 58 C27 48 26 40 31 32" fill="none" stroke="url(#slStem2)" strokeWidth="7" strokeLinecap="round"/>
    <path d="M26 55 C17 47 8 50 5 59 C13 62 23 60 30 56 Z" fill="#63b942" stroke="#2c7732" strokeWidth="2"/>
    <path d="M31 55 C39 47 49 49 57 58 C47 62 38 61 30 57 Z" fill="#4ea63b" stroke="#276f31" strokeWidth="2"/>
    <motion.g animate={firing?{rotate:[0,-9,8,0],x:[0,-2,4,0]}:{rotate:[-2,2,-2]}} transition={{duration:firing?.28:1.7,repeat:Infinity}} style={{transformOrigin:"34px 28px"}}>
      <path d="M17 31 C14 19 22 9 35 8 C46 7 54 14 55 24 C56 34 49 43 38 45 C26 47 19 41 17 31 Z" fill="url(#slBody2)" stroke="#3e7627" strokeWidth="2.5"/>
      <path d="M20 22 C28 15 40 13 51 18" fill="none" stroke="#f3ff9e" strokeWidth="2.3" opacity=".45" strokeLinecap="round"/>
      <path d="M19 35 C27 39 38 40 48 35" fill="none" stroke="#447d28" strokeWidth="1.7" opacity=".55"/>
      <path d="M31 9 C28 2 34 -1 42 2 C40 7 36 10 31 9 Z" fill="#53a13a" stroke="#286d31" strokeWidth="1.8"/>
      <ellipse cx="31" cy="27" rx="3.5" ry="5" fill="#142015"/><ellipse cx="42" cy="26" rx="3.5" ry="5" fill="#142015"/>
      <circle cx="30" cy="25" r="1" fill="#fff"/><circle cx="41" cy="24" r="1" fill="#fff"/>
      <path d="M29 35 Q35 32 41 35" fill="none" stroke="#2c5421" strokeWidth="2" strokeLinecap="round"/>
      <motion.g animate={firing?{x:[0,5,0],scaleX:[1,1.12,1]}:{x:[0,.8,0]}} transition={{duration:firing?.22:1.25,repeat:Infinity}} style={{transformOrigin:"52px 29px"}}>
        <path d="M47 22 C55 20 61 23 63 29 C61 35 55 38 47 36 C51 31 51 27 47 22 Z" fill="#6fac31" stroke="#376d25" strokeWidth="2.2"/>
        <ellipse cx="60" cy="29" rx="5" ry="4" fill="#213e1d"/><ellipse cx="60" cy="29" rx="2.4" ry="1.8" fill="#0c160d"/>
      </motion.g>
    </motion.g>
    <g><path d="M13 46 Q10 34 18 28" fill="none" stroke="#3b8134" strokeWidth="3" strokeLinecap="round"/><circle cx="16" cy="28" r="5.5" fill="url(#slAmmo2)" stroke="#4d8127" strokeWidth="1.5"/><circle cx="11" cy="36" r="4.7" fill="url(#slAmmo2)" stroke="#4d8127" strokeWidth="1.4"/><circle cx="13" cy="44" r="4.2" fill="url(#slAmmo2)" stroke="#4d8127" strokeWidth="1.3"/></g>
    <motion.circle animate={firing?{x:[0,29],y:[0,-1],opacity:[1,1,0],rotate:[0,270]}:{opacity:0}} transition={{duration:.34,repeat:Infinity}} cx="61" cy="29" r="5" fill="url(#slAmmo2)" stroke="#4b7b24" strokeWidth="1.5"/>
  </motion.g></SpriteFrame>;
}
`;
    source = source.replace(sublimeRe, sublime + '\n');
  }
  return source;
};
