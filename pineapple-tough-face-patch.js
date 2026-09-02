window.__patchPvZRoguePineappleToughFace = function patchPvZRoguePineappleToughFace(source) {
  const faceFrom = `      <path d="M20 31 Q27 25 33 30" stroke="#553319" strokeWidth="2.7" fill="none" strokeLinecap="round"/><ellipse cx="27" cy="33" rx="2.3" ry="3.4" fill="#25180f"/>
      <path d="M31 47 C36 50 40 49 44 45" stroke="#59351b" strokeWidth="2.4" fill="none" strokeLinecap="round"/>`;
  const faceTo = `      {/* battered boxer face */}
      <path d="M19 29 L31 24" stroke="#553319" strokeWidth="3.1" fill="none" strokeLinecap="round"/>
      <path d="M37 24 L49 29" stroke="#553319" strokeWidth="3.1" fill="none" strokeLinecap="round"/>
      <ellipse cx="28" cy="32" rx="4.8" ry="5.5" fill="#fff3cf" stroke="#8c5a24" strokeWidth="1"/>
      <ellipse cx="28.6" cy="32.5" rx="1.8" ry="2.7" fill="#24160d"/>
      <circle cx="28" cy="31" r="0.7" fill="#fff"/>
      {removeEyepatch ? (
        <g>
          <ellipse cx="41.5" cy="31.5" rx="4.7" ry="5.2" fill="#ead6b8" stroke="#713b2c" strokeWidth="1.2" transform="rotate(7 41.5 31.5)"/>
          <ellipse cx="42" cy="32.6" rx="1.2" ry="2.2" fill="#3a1b18" transform="rotate(12 42 32.6)"/>
          <path d="M36 27 L47 36 M37 35 L47 26 M39 24 L45 39" stroke="#8d2f21" strokeWidth="1.5" strokeLinecap="round" opacity=".95"/>
          <path d="M36 31 C38 29 44 29 47 32" stroke="#5d2620" strokeWidth="1.6" fill="none"/>
          <ellipse cx="42" cy="32" rx="6.8" ry="7.3" fill="none" stroke="#74352d" strokeWidth="1.3" strokeDasharray="2 1.4" opacity=".8"/>
          <path d="M46 36 L51 41 M38 38 L35 43" stroke="#9b382b" strokeWidth="1.6" strokeLinecap="round"/>
        </g>
      ) : (
        <g>
          <path d="M17 23 C26 25 37 27 50 31" stroke="#221814" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          <ellipse cx="41.5" cy="31.5" rx="7.2" ry="7.6" fill="#241915" stroke="#0f0a08" strokeWidth="1.8" transform="rotate(7 41.5 31.5)"/>
          <path d="M42 25 C46 27 48 31 47 35" stroke="#4a3730" strokeWidth="1.2" fill="none" opacity=".8"/>
        </g>
      )}
      <path d="M33 34 C34 37 34 39 32 41" stroke="#8c501f" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      <path d="M24 46 C30 43 39 43 46 46" stroke="#59351b" strokeWidth="2.8" fill="none" strokeLinecap="round"/>
      <path d="M20 39 L24 36 M21 42 L25 39" stroke="#8d2f21" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M48 39 L52 42" stroke="#8d2f21" strokeWidth="1.5" strokeLinecap="round"/>`;
  if (!source.includes(faceFrom)) throw new Error('Pineapple tough-face patch could not find the original face.');
  source = source.replace(faceFrom, faceTo);

  const spriteSig = 'function PineapplePuncherSprite({ action = "idle", small = false }) {';
  if (!source.includes(spriteSig)) throw new Error('Pineapple tough-face patch could not find sprite signature.');
  source = source.replace(spriteSig, 'function PineapplePuncherSprite({ action = "idle", small = false, removeEyepatch = false }) {');

  const plantHook = `function PlantSprite({ type, action = "idle", small = false }) {
  if (type === "pineapplepuncher") return <PineapplePuncherSprite action={action} small={small} />;`;
  if (!source.includes(plantHook)) throw new Error('Pineapple tough-face patch could not find plant sprite hook.');
  source = source.replace(plantHook, `function PlantSprite({ type, action = "idle", small = false, mods = null }) {
  if (type === "pineapplepuncher") return <PineapplePuncherSprite action={action} small={small} removeEyepatch={!!mods?.removeEyepatch} />;`);

  const boardSprite = '<PlantSprite type={p.type} action={plantAction} />';
  if (!source.includes(boardSprite)) throw new Error('Pineapple tough-face patch could not find board plant sprite.');
  source = source.replace(boardSprite, '<PlantSprite type={p.type} action={plantAction} mods={state.plantMods?.[p.type]} />');

  const bogof = '    ["BOGOF", "Every second Pineapple Puncher you place is free", p => ({ ...p, bogof: true })],';
  if (!source.includes(bogof)) throw new Error('Pineapple tough-face patch could not find BOGOF buff anchor.');
  source = source.replace(bogof, bogof + '\n    ["Depth Perception", "Legendary: removes the eyepatch and reveals a horribly scarred second eye. Does literally nothing useful.", p => ({ ...p, removeEyepatch: true })],');

  const rarity = 'item.name === "BOGOF" ? "Legendary" : (item.name === "Groundbreaker" || item.name === "One Punch Fruit") ? "Epic" : rarityForBuff(item.name)';
  if (!source.includes(rarity)) throw new Error('Pineapple tough-face patch could not find Pineapple rarity logic.');
  source = source.replace(rarity, '(item.name === "BOGOF" || item.name === "Depth Perception") ? "Legendary" : (item.name === "Groundbreaker" || item.name === "One Punch Fruit") ? "Epic" : rarityForBuff(item.name)');

  return source;
};