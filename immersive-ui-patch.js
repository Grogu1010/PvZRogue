window.__patchPvZRogueImmersive = function patchPvZRogueImmersive(source) {
  function replaceRequired(from, to, label) {
    if (!source.includes(from)) throw new Error(`Immersive UI patch could not find ${label}.`);
    source = source.replace(from, to);
  }

  const snapdragonRenderer = String.raw`
function ImmersiveSnapdragon({ action = "idle", small = false }) {
  const fast = action === "attack" || action === "chew" || action === "spin";
  return (
    <SpriteFrame small={small} action={fast ? "attack" : "idle"}>
      <LeafShadow />
      <motion.g
        animate={fast ? { x: [0, 2.5, -0.5, 0], rotate: [-1, 2, -1] } : { rotate: [-1.2, 1.2, -1.2], y: [0, -0.7, 0] }}
        transition={{ duration: fast ? 0.23 : 1.65, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "30px 46px" }}
      >
        <defs>
          <linearGradient id="snap2Stem" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#708f2b"/><stop offset="1" stopColor="#365b20"/></linearGradient>
          <radialGradient id="snap2Head" cx="38%" cy="24%" r="78%"><stop offset="0" stopColor="#c7d83d"/><stop offset="0.48" stopColor="#929d24"/><stop offset="1" stopColor="#59651b"/></radialGradient>
          <radialGradient id="snap2Snout" cx="35%" cy="28%" r="76%"><stop offset="0" stopColor="#d6e64b"/><stop offset="0.55" stopColor="#9cab2b"/><stop offset="1" stopColor="#59641a"/></radialGradient>
          <linearGradient id="snap2Frill" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#ef8b35"/><stop offset="1" stopColor="#b84b2a"/></linearGradient>
          <radialGradient id="snap2Eye" cx="38%" cy="30%" r="72%"><stop offset="0" stopColor="#fff392"/><stop offset="0.65" stopColor="#f4cf43"/><stop offset="1" stopColor="#d79525"/></radialGradient>
        </defs>

        <path d="M26 59 C25 51 26 44 29 37 C31 32 34 27 38 23" fill="none" stroke="url(#snap2Stem)" strokeWidth="6.5" strokeLinecap="round"/>
        <path d="M25 55 C17 49 8 51 5 60 C15 63 24 61 31 56 Z" fill="#a75b2f" stroke="#713717" strokeWidth="1.8"/>
        <path d="M33 56 C41 49 51 51 57 60 C47 63 39 61 31 57 Z" fill="#9b4e2b" stroke="#713717" strokeWidth="1.8"/>

        <path d="M17 17 L7 12 L15 7 L8 2 L20 4 L19 -4 L28 3 L30 14 Z" fill="url(#snap2Frill)" stroke="#84391f" strokeWidth="1.8"/>
        <path d="M18 25 L6 24 L13 18 L4 15 L17 11 L25 20 Z" fill="url(#snap2Frill)" stroke="#84391f" strokeWidth="1.8"/>
        <path d="M20 34 L8 39 L13 31 L4 31 L16 23 L27 27 Z" fill="url(#snap2Frill)" stroke="#84391f" strokeWidth="1.8"/>

        <path d="M14 27 C14 15 25 7 40 8 C52 9 59 15 58 25 C57 36 47 44 33 45 C21 45 14 39 14 27 Z" fill="url(#snap2Head)" stroke="#3f4913" strokeWidth="2.6"/>
        <path d="M23 12 C31 8 43 9 51 14 C48 18 42 20 34 20 C29 20 25 18 23 12 Z" fill="#788322" stroke="#4a5515" strokeWidth="1.7"/>
        <path d="M30 9 L34 0 L39 9 Z" fill="#d4dc54" stroke="#59621b" strokeWidth="1.5"/>
        <path d="M18 13 L17 5 L23 11 Z" fill="#c8d04c" stroke="#59621b" strokeWidth="1.4"/>

        <path d="M25 23 Q33 17 42 21" stroke="#505b16" strokeWidth="3.6" fill="none" strokeLinecap="round"/>
        <path d="M31 24 C35 20 41 20 45 23 C44 29 40 32 35 31 C31 30 30 27 31 24 Z" fill="url(#snap2Eye)" stroke="#5e4917" strokeWidth="1.4"/>
        <ellipse cx="39" cy="25.5" rx="1.7" ry="3.4" fill="#a91e1b"/>
        <circle cx="38.2" cy="23.7" r="1" fill="#fff6c4"/>

        <motion.g
          animate={fast ? { x: [0, 3.5, -0.5, 0], scaleX: [1, 1.04, 0.99, 1] } : { x: [0, 0.5, 0] }}
          transition={{ duration: fast ? 0.18 : 1.25, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "48px 31px" }}
        >
          <path d="M38 25 C45 19 55 20 60 26 C62 33 58 39 49 41 C42 41 38 36 38 25 Z" fill="url(#snap2Snout)" stroke="#414b14" strokeWidth="2.3"/>
          <path d="M42 32 C48 34 54 34 59 31" stroke="#59641a" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
          <ellipse cx="54" cy="28" rx="2.4" ry="2.8" fill="#1b210d"/>
          <ellipse cx="54.8" cy="27.2" rx="0.8" ry="0.7" fill="#a8b84a" opacity=".7"/>
          <path d="M57 20 L63 14 L62 24 Z" fill="#c8d34e" stroke="#59621b" strokeWidth="1.4"/>
        </motion.g>

        <path d={fast ? "M31 35 C39 30 50 31 57 35 C51 42 39 43 31 38 Z" : "M31 36 C39 33 50 33 56 36 C50 41 39 42 31 39 Z"} fill="#34430f" stroke="#202b09" strokeWidth="1.8"/>
        <path d="M35 35 L38 40 L41 35 Z M44 35 L47 40 L50 35 Z" fill="#f7efd0" stroke="#59491f" strokeWidth="0.8"/>
        <path d="M27 41 C32 44 37 44 41 41" stroke="#4f5c16" strokeWidth="1.6" fill="none" strokeLinecap="round" opacity=".7"/>
      </motion.g>
    </SpriteFrame>
  );
}
`;

  replaceRequired(
    'function LatePlantSprite({ type, action = "idle", small = false }) {',
    snapdragonRenderer + '\nfunction LatePlantSprite({ type, action = "idle", small = false }) {',
    'late-plant renderer'
  );

  replaceRequired(
    '  const common = { small, action: fast ? "attack" : "idle" };\n\n  if (type === "chomper") return (',
    '  const common = { small, action: fast ? "attack" : "idle" };\n  if (type === "snapdragon") return <ImmersiveSnapdragon action={action} small={small} />;\n\n  if (type === "chomper") return (',
    'late-plant routing'
  );

  replaceRequired(
    '  const [uiScale, setUiScale] = useState(1);',
    '  const [uiScale, setUiScale] = useState(1);\n  const [showLog, setShowLog] = useState(false);',
    'UI state'
  );

  replaceRequired(
`  useEffect(() => {
    function updateScale() {
      const widthScale = (window.innerWidth - 8) / 900;
      const heightScale = (window.innerHeight - 8) / 405;
      setUiScale(clamp(Math.min(widthScale, heightScale), 0.35, 2.2));
    }

    updateScale();
    window.addEventListener("resize", updateScale);
    document.addEventListener("fullscreenchange", updateScale);
    return () => {
      window.removeEventListener("resize", updateScale);
      document.removeEventListener("fullscreenchange", updateScale);
    };
  }, []);`,
`  useEffect(() => {
    function updateScale() {
      const compact = window.innerHeight < 560;
      const topHud = compact ? 58 : 72;
      const bottomHud = compact ? 86 : 116;
      const widthScale = (window.innerWidth - 18) / BOARD_W;
      const heightScale = (window.innerHeight - topHud - bottomHud - 18) / BOARD_H;
      setUiScale(clamp(Math.min(widthScale, heightScale), 0.45, 2.65));
    }

    updateScale();
    window.addEventListener("resize", updateScale);
    document.addEventListener("fullscreenchange", updateScale);
    return () => {
      window.removeEventListener("resize", updateScale);
      document.removeEventListener("fullscreenchange", updateScale);
    };
  }, []);`,
    'viewport scaling'
  );

  replaceRequired(
    '<div className="flex min-h-[100dvh] w-screen items-start justify-center overflow-hidden bg-gradient-to-b from-emerald-950 via-green-900 to-lime-950 p-1 text-white">',
    '<div className="relative h-[100dvh] w-screen overflow-hidden bg-gradient-to-b from-emerald-950 via-green-900 to-lime-950 text-white">',
    'app shell'
  );

  replaceRequired(
    '<div className="w-fit origin-top space-y-2" style={{ transform: `scale(${uiScale})`, transformOrigin: "top center" }}>',
    '<div className="contents">',
    'scaled app wrapper'
  );

  replaceRequired(
    '<div className="flex max-w-[940px] items-end justify-between gap-2">',
    '<div className="fixed left-2 right-2 top-2 z-[120] flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-white/15 bg-black/35 px-3 py-2 shadow-2xl backdrop-blur-md">',
    'top HUD'
  );

  replaceRequired(
    '<div className="flex items-start gap-2">',
    '<div className="contents">',
    'gameplay columns'
  );

  replaceRequired(
    '<Card className="w-[106px] shrink-0 rounded-xl border-white/15 bg-white/10 text-white shadow-xl">',
    '<Card className="fixed bottom-2 left-1/2 z-[120] w-auto max-w-[calc(100vw-12px)] -translate-x-1/2 rounded-2xl border border-white/15 bg-black/40 text-white shadow-2xl backdrop-blur-md">',
    'seed bank card'
  );

  replaceRequired(
    '<CardContent className="space-y-1 p-1">',
    '<CardContent className="flex max-w-[calc(100vw-16px)] items-end gap-1.5 overflow-x-auto p-2">',
    'seed bank contents'
  );

  source = source.replace('<div className="text-[10px] font-bold">Seeds</div>', '<div className="hidden">Seeds</div>');
  source = source.replace('<div className="text-[8px] text-lime-100/75">Loadout {(state.seedLoadout||[]).length}/{state.seedSlots} · Midgame swaps {state.midgameSwaps||0}</div>', '<div className="hidden">Loadout {(state.seedLoadout||[]).length}/{state.seedSlots}</div>');
  source = source.replace('className="grid grid-cols-2 gap-1 max-h-24 overflow-auto rounded border border-white/10 p-1"', 'className="hidden"');

  replaceRequired(
    '<div className="grid grid-cols-1 gap-1">',
    '<div className="flex gap-1.5">',
    'seed cards list'
  );

  replaceRequired(
    'className={`flex items-center gap-1 rounded-md border px-1 py-0.5 text-left transition ${selected ? "border-lime-100 bg-lime-300 text-green-950" : "border-white/10 bg-black/25 hover:bg-white/15"}`}',
    'className={`flex h-[74px] w-[68px] shrink-0 flex-col items-center justify-center rounded-xl border px-1.5 py-1 text-center transition ${selected ? "border-lime-100 bg-lime-300 text-green-950 shadow-[0_0_18px_rgba(190,242,100,.35)]" : "border-white/10 bg-emerald-950/80 hover:bg-white/15"}`}',
    'seed card button'
  );

  replaceRequired(
    '<div className="w-5 shrink-0 leading-none"><PlantSprite type={type} small /></div>',
    '<div className="flex h-10 w-12 shrink-0 items-center justify-center leading-none"><PlantSprite type={type} /></div>',
    'seed card sprite'
  );

  source = source.replace('className="max-w-[72px] truncate text-[8px] font-bold leading-tight"', 'className="max-w-[62px] truncate text-[9px] font-bold leading-tight"');
  source = source.replace('className="text-[8px] leading-tight"', 'className="text-[9px] font-semibold leading-tight"');
  source = source.replace('className="h-6 w-full rounded-md px-1 text-[9px]"', 'className="h-[74px] w-[64px] shrink-0 rounded-xl px-1 text-[10px]"');
  source = source.replace('<div className="text-[8px] leading-tight text-lime-100/65">Hover sun.</div>', '<div className="hidden">Hover sun.</div>');

  replaceRequired(
    '<div className="relative shrink-0 overflow-hidden rounded-xl border border-white/15 bg-green-800 shadow-2xl" style={{ width: BOARD_W, height: BOARD_H }}>',
    '<div className="fixed z-10 shrink-0 overflow-hidden rounded-[26px] border border-white/20 bg-green-800 shadow-[0_24px_80px_rgba(0,0,0,.55)]" style={{ left: "50%", top: "calc(50% - 18px)", width: BOARD_W, height: BOARD_H, transform: `translate(-50%, -50%) scale(${uiScale})`, transformOrigin: "center center" }}>',
    'lawn board'
  );

  replaceRequired(
    '<Card className="w-[190px] shrink-0 rounded-xl border-white/15 bg-white/10 text-white shadow-xl">',
    '<Card className={`${showLog ? "block" : "hidden"} fixed right-2 top-16 z-[135] max-h-[72dvh] w-[310px] overflow-hidden rounded-2xl border border-white/15 bg-emerald-950/95 text-white shadow-2xl backdrop-blur-md`}>',
    'run log drawer'
  );

  source = source.replace('className="max-h-[210px] space-y-1 overflow-auto pr-1"', 'className="max-h-[48dvh] space-y-1 overflow-auto pr-1"');

  replaceRequired(
    '<Button onClick={restart} variant="secondary" className="h-7 rounded-lg px-2 text-xs">Restart</Button><Button onClick={toggleFullscreen} variant="secondary" className="h-7 rounded-lg px-2 text-xs">Fullscreen</Button><Badge>{LOW_SPEC ? "Low-spec" : "Full FX"}</Badge>',
    '<Button onClick={restart} variant="secondary" className="h-7 rounded-lg px-2 text-xs">Restart</Button><Button onClick={toggleFullscreen} variant="secondary" className="h-7 rounded-lg px-2 text-xs">Fullscreen</Button><Button onClick={() => setShowLog(v => !v)} variant="secondary" className="h-7 rounded-lg px-2 text-xs">{showLog ? "Hide Log" : "Run Log"}</Button><Badge>{LOW_SPEC ? "Low-spec" : "Full FX"}</Badge>',
    'HUD controls'
  );

  replaceRequired(
    '<div className="absolute inset-0 z-40 flex items-center justify-center bg-black/65">',
    '<div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/75 p-3 backdrop-blur-sm">',
    'pregame overlay'
  );

  replaceRequired(
    '<div className="w-[720px] max-w-[92%] rounded-xl border border-lime-200/40 bg-emerald-950/95 p-5 text-center">',
    '<div className="flex max-h-[92dvh] w-[min(980px,94vw)] flex-col overflow-hidden rounded-3xl border border-lime-200/40 bg-emerald-950/95 text-center shadow-2xl">',
    'pregame panel'
  );

  source = source.replace('<h2 className="text-xl font-black">Choose Your Loadout</h2>', '<h2 className="px-5 pt-5 text-2xl font-black">Choose Your Loadout</h2>');
  source = source.replace('className="mt-1 text-sm text-lime-100/80"', 'className="mt-1 px-5 text-sm text-lime-100/80"');
  source = source.replace('className="mt-1 text-xs text-lime-200"', 'className="mt-1 px-5 text-xs text-lime-200"');

  replaceRequired(
    '<div className="mt-3 grid max-h-[300px] grid-cols-2 gap-2 overflow-auto rounded-lg border border-lime-200/25 bg-black/20 p-2 text-left sm:grid-cols-3">',
    '<div className="mx-4 my-3 grid min-h-0 flex-1 grid-cols-2 gap-2 overflow-y-auto rounded-2xl border border-lime-200/25 bg-black/20 p-3 text-left sm:grid-cols-3 lg:grid-cols-4">',
    'pregame plant grid'
  );

  replaceRequired(
    'className="mt-3 h-8 rounded-lg px-5 text-sm"',
    'className="mx-auto mb-4 mt-1 h-11 shrink-0 rounded-xl px-8 text-sm"',
    'pregame start button'
  );

  replaceRequired(
    '{!state.running && !state.gameOver && <Overlay title="Paused" subtitle="Press Resume to continue." action={() => setState(s => ({ ...s, running: true }))} actionText="Resume" />}',
    '{!state.running && !state.gameOver && !state.pregameLoadout && <Overlay title="Paused" subtitle="Press Resume to continue." action={() => setState(s => ({ ...s, running: true }))} actionText="Resume" />}',
    'pause overlay guard'
  );

  return source;
};
