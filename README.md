# Orbit Dash

Play: https://firemaplejumper.github.io/orbit-dash/

A browser wave-survival game with two hundred weapons, tiers I–V, up to six equipped weapons, six ship classes, stackable accessories with tradeoffs, fullscreen play, optional ram-only runs, fuel-powered boost, endless scaling waves, and uncapped ship upgrades.

## Controls

- WASD / arrows / touch drag: fly.
- Tap Space for a short boost; hold for sustained thrust; release to refuel.
- P / Esc: pause solo or local play.
- F / fullscreen button: fullscreen. Hangar: ship, starting accessory, paint and engine trail.
- Controller: left stick, B / RT to boost, A to confirm, Start for the menu.
- Local P2: arrow keys + Right Shift. One controller is assigned to P2.

## Multiplayer

Click Multiplayer for 2–4-player same-device or online play. Co-op shares a map and waves, with separate inventories. VS uses separate maps and live opponent mini-views; farthest wave wins and kills break ties.

GitHub Pages hosts this static client. Online rooms use the existing game server configured in config.js, shared with the original game at https://orbit-dash-arcade-lr7k.fizzyknoll6.chatgpt.site. No server credentials are included in this repository.

## Deploy

GitHub Pages publishes the main branch, repository root. There is no build step. Keep the .nojekyll file and relative asset paths.
