window.__patchPvZRogueSource = function patchPvZRogueSource(source) {
  source = source.replace(
    'import { AnimatePresence, motion } from "https://esm.sh/framer-motion@11.11.17";',
    'import { AnimatePresence, MotionConfig, motion } from "https://esm.sh/framer-motion@11.11.17";'
  );

  source = source.replace(
    'const TICK_MS = 100;',
    'const LOW_SPEC = !!window.__PVZ_LOW_SPEC__;\nconst TICK_MS = LOW_SPEC ? 180 : 100;'
  );

  source = source.replace('    }, 1500);', '    }, LOW_SPEC ? 5000 : 1500);');

  const latePlantRenderer = String.raw`
function LatePlantSprite({ type, action = "idle", small = false }) {
  const fast = action === "attack" || action === "chew" || action === "spin";
  const common = { small, action: fast ? "attack" : "idle" };

  if (type === "chomper") return (
    <SpriteFrame {...common}>
      <defs>
        <radialGradient id="lateChompHead" cx="35%" cy="25%" r="78%"><stop offset="0" stopColor="#df7cff"/><stop offset="0.48" stopColor="#9b36d2"/><stop offset="1" stopColor="#4b176e"/></radialGradient>
        <linearGradient id="lateChompStem" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#8a49c7"/><stop offset="1" stopColor="#512382"/></linearGradient>
        <radialGradient id="lateChompLeaf" cx="35%" cy="25%" r="75%"><stop offset="0" stopColor="#a7f45e"/><stop offset="0.55" stopColor="#45b938"/><stop offset="1" stopColor="#1f6d2a"/></radialGradient>
      </defs>
      <LeafShadow />
      <path d="M31 58 C27 49 27 40 30 31" fill="none" stroke="url(#lateChompStem)" strokeWidth="8" strokeLinecap="round"/>
      <path d="M27 54 C18 47 8 50 5 60 C16 63 24 60 31 56 Z" fill="url(#lateChompLeaf)" stroke="#195626" strokeWidth="2"/>
      <path d="M35 54 C44 46 54 50 58 60 C47 63 39 60 32 56 Z" fill="url(#lateChompLeaf)" stroke="#195626" strokeWidth="2"/>
      <path d="M9 28 C10 12 24 5 40 7 C55 9 63 20 59 33 C55 45 41 50 26 46 C14 43 8 36 9 28 Z" fill="url(#lateChompHead)" stroke="#321047" strokeWidth="2.8"/>
      <path d="M17 17 C24 10 39 9 50 16" fill="none" stroke="#efb2ff" strokeWidth="3" opacity=".45" strokeLinecap="round"/>
      <path d={fast ? "M12 29 C23 20 48 20 59 29 C53 45 20 47 12 29 Z" : "M12 31 C24 25 48 24 59 31 C51 43 21 45 12 31 Z"} fill="#3a0c35" stroke="#240523" strokeWidth="2.2"/>
      <path d="M16 29 L21 37 L26 28 Z M28 26 L33 36 L38 26 Z M41 27 L46 36 L51 28 Z" fill="#fff4d7" stroke="#503219" strokeWidth="1"/>
      <path d="M19 38 L24 31 L29 39 Z M33 40 L38 31 L43 39 Z M46 38 L51 31 L55 36 Z" fill="#fff4d7" stroke="#503219" strokeWidth="1"/>
      <ellipse cx="28" cy="19" rx="5.8" ry="7.2" fill="#f4efcc" stroke="#321047" strokeWidth="1.8"/><ellipse cx="45" cy="18.5" rx="5.8" ry="7.2" fill="#f4efcc" stroke="#321047" strokeWidth="1.8"/>
      <circle cx="30" cy="20" r="2.1" fill="#151018"/><circle cx="43" cy="19.5" r="2.1" fill="#151018"/>
      <path d="M19 7 C17 1 22 -2 26 4 C25 8 23 10 19 7 Z M40 6 C42 -1 48 0 47 7 C45 10 42 9 40 6 Z" fill="#49bd3d" stroke="#195626" strokeWidth="1.7"/>
    </SpriteFrame>
  );

  if (type === "laserbean") return (
    <SpriteFrame {...common}>
      <defs>
        <linearGradient id="laserBeanBody" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#d8ff78"/><stop offset="0.55" stopColor="#65cf49"/><stop offset="1" stopColor="#207b3b"/></linearGradient>
        <radialGradient id="laserLens" cx="35%" cy="30%" r="70%"><stop offset="0" stopColor="#eaffff"/><stop offset="0.45" stopColor="#59e8ff"/><stop offset="1" stopColor="#167fb7"/></radialGradient>
      </defs>
      <LeafShadow />
      <path d="M22 58 C15 50 7 52 5 61 C14 63 22 62 29 57 Z M35 57 C43 49 53 52 58 61 C48 63 39 62 32 57 Z" fill="#48b84a" stroke="#1f7132" strokeWidth="2"/>
      <path d="M19 48 C14 35 17 18 29 11 C42 4 54 12 56 25 C58 39 48 53 34 57 C28 58 22 54 19 48 Z" fill="url(#laserBeanBody)" stroke="#1f6935" strokeWidth="2.7"/>
      <path d="M27 14 C23 26 24 42 30 53" fill="none" stroke="#efffa5" strokeWidth="3" opacity=".45" strokeLinecap="round"/>
      <ellipse cx="38" cy="26" rx="11" ry="10" fill="#3f9f43" stroke="#1d6331" strokeWidth="2"/>
      <ellipse cx="47" cy="26" rx="12" ry="10" fill="url(#laserLens)" stroke="#155f83" strokeWidth="2.4"/>
      <ellipse cx="51" cy="26" rx="5.6" ry="5.2" fill="#08364f"/><ellipse cx="48" cy="23" rx="2.5" ry="1.6" fill="#d9ffff" opacity=".7"/>
      <path d="M21 27 Q27 22 33 26" stroke="#173a1f" strokeWidth="2.7" fill="none" strokeLinecap="round"/><ellipse cx="27" cy="30" rx="2.2" ry="3.8" fill="#172319"/>
      <path d="M22 40 C28 44 34 44 39 39" stroke="#173a1f" strokeWidth="2.4" fill="none" strokeLinecap="round"/>
      <path d="M15 16 C8 10 9 4 17 5 C22 7 25 12 25 17 C21 19 18 18 15 16 Z" fill="#5fd24b" stroke="#1f7132" strokeWidth="1.8"/>
      {fast && <path d="M58 26 H64" stroke="#9ff7ff" strokeWidth="4" strokeLinecap="round"/>}
    </SpriteFrame>
  );

  if (type === "sunshroom") return (
    <SpriteFrame {...common}>
      <defs>
        <radialGradient id="sunShroomCap" cx="35%" cy="25%" r="75%"><stop offset="0" stopColor="#fff5a1"/><stop offset="0.5" stopColor="#ffc84a"/><stop offset="1" stopColor="#d57b22"/></radialGradient>
        <linearGradient id="sunShroomStem" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#fff7d7"/><stop offset="1" stopColor="#d8c498"/></linearGradient>
      </defs>
      <LeafShadow />
      <path d="M23 37 C23 31 27 27 32 27 C38 27 42 31 42 38 L42 55 C37 60 27 60 22 55 Z" fill="url(#sunShroomStem)" stroke="#8c7650" strokeWidth="2"/>
      <path d="M10 31 C12 14 26 7 40 10 C53 12 60 22 55 34 C45 39 22 39 11 34 C10 33 10 32 10 31 Z" fill="url(#sunShroomCap)" stroke="#985c20" strokeWidth="2.5"/>
      <ellipse cx="26" cy="21" rx="7" ry="4" fill="#fff7ba" opacity=".55"/>
      <g fill="#e99a2b" opacity=".75"><circle cx="21" cy="29" r="3.2"/><circle cx="35" cy="24" r="3.6"/><circle cx="47" cy="30" r="3"/></g>
      <ellipse cx="28" cy="42" rx="2.7" ry="4.2" fill="#3a2a17"/><ellipse cx="37" cy="42" rx="2.7" ry="4.2" fill="#3a2a17"/>
      <path d="M27 50 C30 53 35 53 38 50" stroke="#7b542d" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M17 56 C11 51 6 55 7 61 C14 63 20 60 23 57 Z M41 56 C47 51 54 55 56 61 C49 63 43 60 40 57 Z" fill="#5eb84b" stroke="#2e7134" strokeWidth="1.8"/>
    </SpriteFrame>
  );

  if (type === "snapdragon") return (
    <SpriteFrame {...common}>
      <defs>
        <radialGradient id="snapHead" cx="35%" cy="25%" r="78%"><stop offset="0" stopColor="#ffd763"/><stop offset="0.45" stopColor="#f29a38"/><stop offset="1" stopColor="#a84729"/></radialGradient>
        <linearGradient id="snapStem" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#69bd3d"/><stop offset="1" stopColor="#2b7430"/></linearGradient>
      </defs>
      <LeafShadow />
      <path d="M29 58 C26 48 27 39 32 31" fill="none" stroke="url(#snapStem)" strokeWidth="7" strokeLinecap="round"/>
      <path d="M24 55 C15 49 8 52 7 61 C16 63 24 61 31 57 Z M34 56 C43 48 53 52 58 61 C48 63 40 61 32 57 Z" fill="#57bd45" stroke="#267032" strokeWidth="2"/>
      <path d="M12 30 C12 15 25 7 41 9 C54 11 62 20 59 31 C56 42 44 47 30 45 C19 43 12 38 12 30 Z" fill="url(#snapHead)" stroke="#7a3522" strokeWidth="2.6"/>
      <path d="M23 15 C32 10 45 12 52 18" stroke="#ffe48b" strokeWidth="2.6" fill="none" opacity=".55" strokeLinecap="round"/>
      <path d={fast ? "M29 33 C39 27 51 27 60 32 C53 39 40 41 29 36 Z" : "M30 34 C40 30 52 30 59 34 C52 40 40 41 30 36 Z"} fill="#4c231d" stroke="#2d1410" strokeWidth="2"/>
      <path d="M54 30 L63 27 L59 34 Z" fill="#f6bd43" stroke="#8a4b1f" strokeWidth="1.5"/>
      <ellipse cx="42" cy="23" rx="6" ry="7" fill="#fff4c6" stroke="#6c3a20" strokeWidth="1.7"/><circle cx="44" cy="24" r="2.1" fill="#351914"/>
      <path d="M24 24 Q31 19 38 23" stroke="#63301d" strokeWidth="2.7" fill="none" strokeLinecap="round"/>
      <path d="M18 10 L13 3 L23 8 Z M31 9 L33 1 L38 10 Z M47 12 L55 5 L53 16 Z" fill="#ef7d33" stroke="#8a3921" strokeWidth="1.5"/>
      {fast && <path d="M61 32 L64 29 M61 34 L64 35" stroke="#ffd35a" strokeWidth="2.2" strokeLinecap="round"/>}
    </SpriteFrame>
  );

  if (type === "torchwood") return (
    <SpriteFrame {...common}>
      <defs>
        <linearGradient id="torchWoodBody" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#c48645"/><stop offset="0.55" stopColor="#8a512b"/><stop offset="1" stopColor="#4f2b1c"/></linearGradient>
        <radialGradient id="torchFlame" cx="50%" cy="65%" r="70%"><stop offset="0" stopColor="#fff58a"/><stop offset="0.45" stopColor="#ffb22e"/><stop offset="1" stopColor="#ef4d24"/></radialGradient>
      </defs>
      <LeafShadow />
      <path d="M17 58 C15 46 15 25 22 18 C28 13 39 13 45 19 C51 27 50 46 47 58 Z" fill="url(#torchWoodBody)" stroke="#402318" strokeWidth="2.7"/>
      <path d="M24 22 C21 33 22 46 25 55 M39 20 C42 33 41 45 39 56" stroke="#d6a063" strokeWidth="2.5" opacity=".35" fill="none" strokeLinecap="round"/>
      <path d="M20 31 C27 27 37 27 45 31 M19 46 C27 41 39 42 47 46" stroke="#57301f" strokeWidth="2.2" fill="none" opacity=".7"/>
      <ellipse cx="27" cy="36" rx="4" ry="5.4" fill="#19120e"/><ellipse cx="39" cy="36" rx="4" ry="5.4" fill="#19120e"/>
      <path d="M26 48 C31 44 37 44 42 48" stroke="#2e1a13" strokeWidth="2.7" fill="none" strokeLinecap="round"/>
      <path d="M18 59 C11 54 5 57 6 63 C13 64 20 62 24 59 Z M43 59 C50 53 58 56 59 63 C51 64 46 62 41 59 Z" fill="#4ea13a" stroke="#285f2d" strokeWidth="1.8"/>
      <path d="M19 19 C17 10 24 6 27 10 C27 3 35 -1 38 8 C42 3 49 8 46 18 C40 24 26 25 19 19 Z" fill="url(#torchFlame)" stroke="#b84622" strokeWidth="2"/>
      <path d="M29 17 C28 11 33 7 35 12 C38 9 41 13 39 18 C36 21 32 21 29 17 Z" fill="#fff3a1" opacity=".85"/>
    </SpriteFrame>
  );

  if (type === "iceberglettuce") return (
    <SpriteFrame {...common}>
      <defs>
        <radialGradient id="iceLettuceCore" cx="35%" cy="25%" r="78%"><stop offset="0" stopColor="#f1ffff"/><stop offset="0.45" stopColor="#9ceff0"/><stop offset="1" stopColor="#4aa9be"/></radialGradient>
        <linearGradient id="iceLeaf" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#c9ffff"/><stop offset="0.5" stopColor="#72dce0"/><stop offset="1" stopColor="#2f8ca7"/></linearGradient>
      </defs>
      <LeafShadow />
      <g fill="url(#iceLeaf)" stroke="#2d8195" strokeWidth="1.8">
        <path d="M31 55 C20 57 10 51 9 42 C8 34 15 29 24 31 C18 22 23 14 31 18 C34 8 44 8 47 18 C56 14 61 22 56 31 C64 33 65 43 60 49 C53 57 42 58 31 55 Z"/>
        <path d="M18 50 C10 52 5 48 5 42 C10 39 16 40 21 44 Z"/><path d="M45 51 C52 43 60 43 63 49 C59 56 51 58 44 55 Z"/>
      </g>
      <circle cx="35" cy="36" r="17" fill="url(#iceLettuceCore)" stroke="#2a8197" strokeWidth="2.4"/>
      <path d="M24 29 L30 25 L35 28 L41 23 L48 29" stroke="#e8ffff" strokeWidth="2.2" fill="none" opacity=".7"/>
      <ellipse cx="29" cy="36" rx="3.6" ry="5.2" fill="#173445"/><ellipse cx="41" cy="36" rx="3.6" ry="5.2" fill="#173445"/>
      <circle cx="27.8" cy="34.2" r="1.2" fill="#fff"/><circle cx="39.8" cy="34.2" r="1.2" fill="#fff"/>
      <path d="M29 46 C33 49 38 49 42 45" stroke="#246078" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
      <path d="M19 39 L13 35 M50 38 L57 34 M35 19 L36 12" stroke="#e7ffff" strokeWidth="2" strokeLinecap="round" opacity=".8"/>
    </SpriteFrame>
  );

  return null;
}
`;

  source = source.replace(
    'function PlantSprite({ type, action = "idle", small = false }) {',
    latePlantRenderer + '\nfunction PlantSprite({ type, action = "idle", small = false }) {\n  if (["chomper","laserbean","sunshroom","snapdragon","torchwood","iceberglettuce"].includes(type)) return <LatePlantSprite type={type} action={action} small={small} />;'
  );

  source = source.replace(
`  useEffect(() => {
    function updateScale() {
      const widthScale = window.innerWidth / 760;
      const heightScale = window.innerHeight / 620;
      setUiScale(clamp(Math.min(widthScale, heightScale), 1.15, 2));
    }

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);`,
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
  }, []);`
  );

  source = source.replace(
`  async function copyOfferedBuffs() {
    setOfferCopyNote("");
    const ok = await robustCopy(makeOfferCopyText(state.choices, state, scaling));
    setOfferCopyNote(ok ? "Copied!" : "Copy failed");
    setTimeout(() => setOfferCopyNote(""), 1400);
  }

  return (`,
`  async function copyOfferedBuffs() {
    setOfferCopyNote("");
    const ok = await robustCopy(makeOfferCopyText(state.choices, state, scaling));
    setOfferCopyNote(ok ? "Copied!" : "Copy failed");
    setTimeout(() => setOfferCopyNote(""), 1400);
  }

  async function toggleFullscreen() {
    try {
      if (!document.fullscreenElement) await document.documentElement.requestFullscreen?.();
      else await document.exitFullscreen?.();
    } catch {}
  }

  return (`
  );

  source = source.replace(
    '<div className="min-h-screen overflow-x-auto bg-gradient-to-b from-emerald-950 via-green-900 to-lime-950 p-2 text-white">',
    '<div className="flex min-h-[100dvh] w-screen items-start justify-center overflow-hidden bg-gradient-to-b from-emerald-950 via-green-900 to-lime-950 p-1 text-white">'
  );

  source = source.replace(
    '<div className="mx-auto w-fit origin-top space-y-2" style={{ transform: `scale(${uiScale})` }}>',
    '<div className="w-fit origin-top space-y-2" style={{ transform: `scale(${uiScale})`, transformOrigin: "top center" }}>'
  );

  source = source.replace(
    '<Button onClick={restart} variant="secondary" className="h-7 rounded-lg px-2 text-xs">Restart</Button>',
    '<Button onClick={restart} variant="secondary" className="h-7 rounded-lg px-2 text-xs">Restart</Button><Button onClick={toggleFullscreen} variant="secondary" className="h-7 rounded-lg px-2 text-xs">Fullscreen</Button><Badge>{LOW_SPEC ? "Low-spec" : "Full FX"}</Badge>'
  );

  source = source.replace(
    'if (mount) createRoot(mount).render(<PvZRoguePrototype />);',
    'if (mount) createRoot(mount).render(<MotionConfig reducedMotion={LOW_SPEC ? "always" : "user"}><PvZRoguePrototype /></MotionConfig>);'
  );

  return source;
};
