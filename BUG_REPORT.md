# Possible Bugs Found

1. **Sky sun timing ignores slowdown meter threshold overshoot**
   - In `step`, `skySunMeter` is reset to `0` when it crosses the interval instead of subtracting the interval.
   - At low FPS or large `dt`, this can permanently reduce sun spawn rate because overflow time is discarded.

2. **Zombie spawn cadence also drops overflow time**
   - `spawnMeter` is reset to `0` once it reaches `5` seconds.
   - If `dt` is large (tab inactive / frame stutter), spawns are skipped rather than catching up, producing inconsistent difficulty.

3. **Melee targeting for non-choynado Bonk Choy appears to miss adjacent center tile logic**
   - `hitCols` for normal melee is `[col-2, col-1, col+1, col+2]` and excludes the current/front tile.
   - This seems unintuitive for a melee plant and may be an off-by-one targeting bug.

4. **Debuff draft path increments buffCount and buffLog for debuffs**
   - In `chooseBuff`, all choice types increment `buffCount`, including `debuff` picks.
   - This may unintentionally scale zombie strength from selections intended as enemy nerfs.

5. **Rogue-point trigger from collected sun only grants one threshold per click**
   - `collectSun` checks `next.roguePoints >= next.nextBuffAt` once and increments `nextBuffAt` by `10` once.
   - If a player crosses multiple thresholds in one collection chain, only one buff draft is queued.

6. **Local storage save writes with `running:false` and cleared choices every autosave**
   - Autosave deliberately strips `running`, `pausedForBuff`, and `choices`.
   - If a reload occurs mid-draft, the user can lose current draft state and offered options.

7. **Projectiles and collisions are single-hit per tick without sweep**
   - High-speed projectiles (`speed: 260`) use a single position update then proximity check.
   - With larger `dt`, shots may tunnel past thin hit windows and miss targets.
