window.__patchPvZRogueViscoHealth = function patchPvZRogueViscoHealth(source) {
  const pattern = /(viscoelastic:\s*\{[^\n]*?hp:\s*)1250(\s*,)/;
  if (!pattern.test(source)) throw new Error('Visco health patch could not find Viscoelastic Zombie HP.');
  return source.replace(pattern, '$1' + 950 + '$2');
};
