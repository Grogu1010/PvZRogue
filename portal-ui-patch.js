window.__patchPvZRoguePortal = function patchPvZRoguePortal(source) {
  function replaceRequired(from, to, label) {
    if (!source.includes(from)) throw new Error(`Fullscreen loadout patch could not find ${label}.`);
    source = source.replace(from, to);
  }

  replaceRequired(
    'import { createRoot } from "https://esm.sh/react-dom@18.3.1/client";',
    'import { createRoot } from "https://esm.sh/react-dom@18.3.1/client";\nimport { createPortal } from "https://esm.sh/react-dom@18.3.1";',
    'React DOM imports'
  );

  replaceRequired(
    '{state.pregameLoadout && (\n              <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/75 p-3 backdrop-blur-sm">',
    '{state.pregameLoadout && createPortal((\n              <div className="fixed inset-0 z-[200] flex items-center justify-center overflow-auto bg-[radial-gradient(circle_at_top,_rgba(34,197,94,.24),_transparent_38%),linear-gradient(to_bottom,_#020617,_#052e16_52%,_#020617)] p-4 sm:p-7">',
    'loadout portal opening'
  );

  replaceRequired(
`                  </Button>
                </div>
              </div>
            )}
            <div className="absolute inset-0">`,
`                  </Button>
                </div>
              </div>
            ), document.body)}
            <div className="absolute inset-0">`,
    'loadout portal closing'
  );

  // Cosmetic loadout upgrade. These are intentionally optional so UI polish can
  // never block startup if another patch slightly changes the surrounding markup.
  const swaps = [
    ['<div className="w-[720px] max-w-[92%] rounded-xl border border-lime-200/40 bg-emerald-950/95 p-5 text-center">', '<div className="w-[980px] max-w-[96vw] rounded-[28px] border border-lime-200/30 bg-slate-950/90 p-5 text-center shadow-2xl shadow-black/50 ring-1 ring-white/5 sm:p-7">'],
    ['<h2 className="text-xl font-black">Choose Your Loadout</h2>', '<div className="mx-auto mb-2 w-fit rounded-full border border-lime-300/25 bg-lime-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-[.28em] text-lime-200">Seed Selection</div><h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">Choose Your Loadout</h2>'],
    ['<p className="mt-1 text-sm text-lime-100/80">Pick exactly {state.seedSlots} plants from this full-screen menu, then press Play.</p>', '<p className="mx-auto mt-2 max-w-xl text-sm text-lime-100/70">Build an 8-card deck. Costs and packet cooldowns are shown on every seed so you can compare the whole roster at a glance.</p>'],
    ['<p className="mt-1 text-xs text-lime-200">Selected: {(state.seedLoadout || []).length}/{state.seedSlots}</p>', '<div className="mx-auto mt-3 flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-black text-lime-200"><span>Selected</span><span className="rounded-full bg-lime-300 px-2 py-0.5 text-emerald-950">{(state.seedLoadout || []).length}/{state.seedSlots}</span></div>'],
    ['<div className="mt-3 grid max-h-[300px] grid-cols-2 gap-2 overflow-auto rounded-lg border border-lime-200/25 bg-black/20 p-2 text-left sm:grid-cols-3">', '<div className="mt-5 grid max-h-[58vh] grid-cols-2 gap-3 overflow-auto rounded-2xl border border-white/10 bg-black/20 p-3 text-left sm:grid-cols-3 lg:grid-cols-4">'],
    ['className={`flex items-center gap-2 rounded-lg border p-2 transition ${inLoadout ? "border-lime-100 bg-lime-300 text-green-950" : "border-white/15 bg-emerald-900/65 text-lime-50 hover:bg-emerald-800/80"}`}', 'className={`group relative min-h-[104px] overflow-hidden rounded-2xl border p-3 text-left transition-all duration-150 ${inLoadout ? "border-lime-200 bg-gradient-to-br from-lime-300 to-emerald-300 text-emerald-950 shadow-lg shadow-lime-950/30 ring-2 ring-lime-100/60" : "border-white/10 bg-gradient-to-br from-emerald-950/90 to-slate-950/95 text-lime-50 hover:-translate-y-0.5 hover:border-lime-300/40 hover:bg-emerald-900/90"}` }'],
    ['<div className="text-2xl leading-none"><PlantSprite type={type} /></div>', '<div className="absolute right-2 top-2 rounded-lg bg-black/15 px-2 py-1 text-[10px] font-black">{inLoadout ? "✓ PICKED" : "SELECT"}</div><div className="mb-2 h-14 w-14 leading-none transition-transform group-hover:scale-110"><PlantSprite type={type} /></div>'],
    ['<div className="text-sm font-bold leading-tight">{plantDefs[type].name}</div>', '<div className="max-w-[150px] text-sm font-black leading-tight">{plantDefs[type].name}</div>'],
    ['<div className="text-xs leading-tight">Cost {cardCost(type, state)}</div>', '<div className="mt-1 flex flex-wrap gap-1.5 text-[11px] font-bold"><span className="rounded-md bg-black/15 px-2 py-1">☀ {cardCost(type, state)}</span><span className="rounded-md bg-black/15 px-2 py-1">⏱ <span data-packet-cooldown={type}>4s</span></span></div>'],
    ['className="mt-3 h-8 rounded-lg px-5 text-sm"', 'className="mt-5 h-11 rounded-xl px-8 text-base font-black shadow-lg shadow-lime-950/30"']
  ];
  for (const [from,to] of swaps) if (source.includes(from)) source = source.replace(from,to);

  return source;
};
