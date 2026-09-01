window.__patchVaderVineArt = function patchVaderVineArt(source) {
  const start = source.indexOf('function VaderVineSprite({ action = "idle", small = false }) {');
  const end = source.indexOf('\nfunction PlantSprite({ type, action = "idle", small = false }) {', start);
  if (start < 0 || end < 0) throw new Error('Vader Vine art patch could not find sprite block.');

  const sprite = String.raw`function VaderVineSprite({ action = "idle", small = false }) {
  const attacking = action === "attack" || action === "spin";
  return (
    <SpriteFrame small={small} action={attacking ? "attack" : "idle"}>
      <LeafShadow />
      <defs>
        <linearGradient id="vvStem" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#79bd4a"/><stop offset="0.45" stopColor="#3f7e38"/><stop offset="1" stopColor="#17361f"/></linearGradient>
        <radialGradient id="vvLeaf" cx="35%" cy="25%" r="75%"><stop offset="0" stopColor="#91d95b"/><stop offset="0.55" stopColor="#3d8b3e"/><stop offset="1" stopColor="#193b26"/></radialGradient>
        <linearGradient id="vvArmor" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#62646d"/><stop offset="0.28" stopColor="#24252b"/><stop offset="1" stopColor="#07080a"/></linearGradient>
        <linearGradient id="vvLeafCape" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#263d28"/><stop offset="1" stopColor="#0a1710"/></linearGradient>
      </defs>

      {/* rooted vine base */}
      <path d="M31 61 C19 62 12 60 7 57 C15 53 22 52 29 56 M34 60 C44 63 53 61 59 57 C51 53 43 52 35 56" fill="none" stroke="#254d29" strokeWidth="4" strokeLinecap="round"/>
      <path d="M31 59 C26 52 29 46 25 40 C21 34 25 28 31 26 C37 24 39 19 37 14" fill="none" stroke="url(#vvStem)" strokeWidth="8" strokeLinecap="round"/>
      <path d="M31 57 C37 52 38 47 35 43 C32 39 34 35 40 32" fill="none" stroke="#5ba24a" strokeWidth="3" strokeLinecap="round" opacity=".8"/>

      {/* curling tendrils */}
      <path d="M23 42 C13 42 10 34 15 30 C19 27 23 30 21 34 C20 36 17 36 16 34" fill="none" stroke="#4f9545" strokeWidth="3" strokeLinecap="round"/>
      <path d="M38 39 C49 40 54 34 52 28 C50 24 45 25 45 29 C45 31 48 32 49 30" fill="none" stroke="#4f9545" strokeWidth="3" strokeLinecap="round"/>

      {/* leaf cape */}
      <path d="M24 27 C15 31 12 44 15 55 C21 52 26 50 31 49 C27 42 27 34 29 28 Z" fill="url(#vvLeafCape)" stroke="#09120d" strokeWidth="2"/>
      <path d="M38 27 C47 31 51 44 48 55 C42 52 37 50 32 49 C36 42 36 34 34 28 Z" fill="url(#vvLeafCape)" stroke="#09120d" strokeWidth="2"/>
      <path d="M16 52 C19 47 23 44 28 42 M47 52 C44 47 40 44 35 42" stroke="#44684a" strokeWidth="1.5" opacity=".65" fill="none"/>

      {/* plant helmet grown around the vine */}
      <path d="M21 24 C22 13 27 7 32 5 C38 7 43 13 44 24 L40 34 C36 37 28 37 24 34 Z" fill="url(#vvArmor)" stroke="#050607" strokeWidth="2.3"/>
      <path d="M25 10 C24 4 28 0 32 3 C36 0 40 4 39 10 L36 12 L28 12 Z" fill="#17191d" stroke="#050607" strokeWidth="1.8"/>
      <path d="M23 20 L28 15 L32 20 L36 15 L42 20 L39 25 L25 25 Z" fill="#090a0d"/>
      <path d="M29 14 L31 19 L25 18 Z M36 14 L34 19 L41 18 Z" fill="#c52c32" opacity=".9"/>
      <path d="M28 26 L36 26 L39 34 L25 34 Z" fill="#202228" stroke="#050607" strokeWidth="1.3"/>
      <path d="M30 27 L32 33 L34 27" stroke="#70737b" strokeWidth="1.2" fill="none"/>

      {/* leafy shoulders / armor pods */}
      <path d="M20 29 C14 25 10 28 11 35 C16 37 21 35 24 31 Z" fill="url(#vvLeaf)" stroke="#183820" strokeWidth="1.8"/>
      <path d="M43 29 C49 25 54 28 53 35 C48 37 43 35 40 31 Z" fill="url(#vvLeaf)" stroke="#183820" strokeWidth="1.8"/>

      {/* chest panel wrapped onto vine body */}
      <rect x="26" y="36" width="13" height="11" rx="3" fill="#16181c" stroke="#050607" strokeWidth="1.4"/>
      <circle cx="29" cy="39.5" r="1.1" fill="#e33"/><circle cx="35" cy="39.5" r="1.1" fill="#67d7ff"/>
      <rect x="28" y="43" width="9" height="1.8" rx=".9" fill="#d4d6d9" opacity=".65"/>

      {/* saber arm is literally a vine tendril */}
      <motion.g animate={attacking ? { rotate: [-72, 54, -26], x: [0, 5, 0] } : { rotate: [-18, -8, -18] }} transition={{ duration: attacking ? 0.22 : 1.4, repeat: Infinity, ease: "easeInOut" }} style={{ transformOrigin: "40px 41px" }}>
        <path d="M38 41 C44 39 47 43 50 47" fill="none" stroke="url(#vvStem)" strokeWidth="5" strokeLinecap="round"/>
        <path d="M48 47 L55 50" stroke="#3e4147" strokeWidth="4" strokeLinecap="round"/>
        <path d="M53 49 L69 31" stroke="#ff2f32" strokeWidth="6" strokeLinecap="round" opacity=".25"/>
        <path d="M53 49 L69 31" stroke="#ff3438" strokeWidth="3" strokeLinecap="round"/>
        <path d="M53 49 L69 31" stroke="#fff" strokeWidth="1" strokeLinecap="round" opacity=".9"/>
      </motion.g>

      {/* off-hand vine claw */}
      <motion.g animate={attacking ? { x: [0,-3,0], rotate: [0,-14,0] } : { y: [0,-1,0] }} transition={{ duration: attacking ? .3 : 1.5, repeat: Infinity }} style={{ transformOrigin: "22px 42px" }}>
        <path d="M26 40 C20 39 17 43 15 47" fill="none" stroke="url(#vvStem)" strokeWidth="4.5" strokeLinecap="round"/>
        <path d="M15 47 L11 43 M15 47 L10 48 M15 47 L12 52" stroke="#73b85a" strokeWidth="2" strokeLinecap="round"/>
      </motion.g>
    </SpriteFrame>
  );
}`;

  return source.slice(0, start) + sprite + source.slice(end);
};
