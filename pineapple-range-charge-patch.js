window.__patchPvZRoguePineappleRangeCharge = function patchPvZRoguePineappleRangeCharge(source) {
  const start = source.indexOf('      if (stats.kind === "pineapple" && next.cd <= 0) {');
  const end = source.indexOf('\n      if (stats.kind === "chomper" && next.cd <= 0) {', start);
  if (start < 0 || end < 0) throw new Error('Pineapple range-charge patch could not find combat block.');

  const block = `      if (stats.kind === "pineapple") {
        const punchOriginX = next.col * CELL_W + CELL_W / 2;
        const target = zombies
          .filter(z => !z.flying && z.row === next.row && z.x >= punchOriginX - 8 && z.x <= punchOriginX + CELL_W * (stats.radius || 1) + 28)
          .sort((a,b) => a.x - b.x)[0];
        const requiredCharge = (stats.punchCd || 7) * (stats.mods.punchCdMult || 1) * s.cooldownMult;

        if (!target) {
          next.punchCharge = 0;
        } else {
          next.punchCharge = (next.punchCharge || 0) + dt;
          if (next.punchCharge >= requiredCharge) {
            const onePunchTarget = "buckethead";
            const infiniteHit = stats.mods.infiniteCrusher && target.type === onePunchTarget;
            const visco = target.type === "viscoelastic" && !(s.zombieMods.viscoelastic || {}).reflectDisabled;
            const baseDamage = stats.damage;
            if (infiniteHit) {
              target.hp = -1e15;
              if (DEVICE_TIER !== "ultra") floaties.push({ id: makeId("onePunch"), text: "∞ DAMAGE", x: target.x, y: target.row * CELL_H + 4, life: 0.8 });
            } else if (visco) {
              target.hp -= baseDamage * 0.1;
              next.hp -= baseDamage * 0.35;
              if (DEVICE_TIER !== "ultra") floaties.push({ id: makeId("viscoPunch"), text: "BOING ↩", x: target.x, y: target.row * CELL_H + 4, life: 0.75 });
            } else {
              target.hp -= baseDamage;
              const heavy = target.type === "gargantuar" || zombieDefs[target.type]?.heavy;
              const tiles = heavy ? 2 + (target.type === "gargantuar" ? (stats.mods.gargKnockbackFlat || 0) : 0) : 4 + (stats.mods.knockbackFlat || 0);
              target.x += CELL_W * tiles;
            }

            if (stats.mods.faultLine) {
              zombies.forEach(z => {
                if (z.id !== target.id && z.row === target.row && z.x > target.x && z.x < target.x + CELL_W * 1.5) {
                  z.hp -= baseDamage * (z.type === "viscoelastic" ? 0.08 : 0.35);
                }
              });
            }

            if (stats.mods.earthquake) {
              const centerCol = Math.floor(target.x / CELL_W);
              zombies.forEach(z => {
                const zCol = Math.floor(z.x / CELL_W);
                if (Math.abs(z.row - target.row) <= 1 && Math.abs(zCol - centerCol) <= 1 && z.id !== target.id) {
                  z.hp -= baseDamage * (z.type === "viscoelastic" ? 0.1 : 0.55);
                  if (z.type !== "viscoelastic") z.x += CELL_W;
                }
              });
              if (DEVICE_TIER !== "ultra") floaties.push({ id: makeId("quake"), text: "💥 GROUNDBREAKER", x: punchOriginX, y: next.row * CELL_H - 4, life: 0.65 });
            }

            if (stats.mods.aftershockStun) {
              zombies.forEach(z => {
                if (Math.abs(z.row - next.row) <= 1 && Math.abs(z.x - target.x) <= CELL_W * 1.5 && z.type !== "viscoelastic") z.stun = Math.max(z.stun, 0.7);
              });
            }

            next.punchCharge = 0;
            if (DEVICE_TIER !== "ultra") floaties.push({ id: makeId("skullPunch"), text: "💀 SKULL CRUSH", x: target.x, y: target.row * CELL_H + 18, life: 0.55 });
          }
        }
      }`;

  return source.slice(0, start) + block + source.slice(end);
};
