# IPTV Doctor

Check, clean, and repair IPTV playlists.

- Detect broken M3U/HLS channels
- Sample HLS media segments, not just manifest URLs
- Generate visual HTML, JSON, and CSV reports
- Clean dead streams into a fresh M3U
- Check and fix XMLTV `tvg-id` mismatches
- Publish Shields-compatible health badge JSON
- Generate legal World Cup 2026 XMLTV, iCalendar, and placeholder M3U metadata
- Start a small MCP server for World Cup metadata tools
- Add CI health checks for playlist repositories

No pirated streams. No paid channel lists. No Xtream credentials. Bring your own legal playlist.

## Report Preview

```txt
IPTV Doctor Report
Health Score: 83%

Channel       Status   Latency   Segments   Code
FOX           OK       430ms     1          OK
FS1           WARN     2800ms    1          WARN_SLOW
Demo Broken   FAIL     120ms                FAIL_HTTP
```

## Quick Start

Use the published CLI when you just want to inspect a playlist:

```bash
npx iptv-doctor check playlist.m3u --report report.html --json report.json --csv report.csv
npx iptv-doctor report report.json --html report.html --csv report.csv --badge badge.json
npx iptv-doctor clean playlist.m3u --out clean.m3u
npx iptv-doctor epg check playlist.m3u guide.xml --json epg.json
npx iptv-doctor epg fix playlist.m3u guide.xml --out fixed.m3u
npx iptv-doctor badge report.json --out badge.json
npx iptv-doctor mcp --list-tools
npx iptv-doctor worldcup --country US --format xmltv --out worldcup.xml
npx iptv-doctor worldcup --country US --format html --out worldcup-guide.html
```

## Capabilities

| Need | Command | Output |
|---|---|---|
| Check playlist | `iptv-doctor check` | HTML/JSON/CSV diagnostics and optional badge JSON |
| Render saved diagnostics | `iptv-doctor report` | HTML/CSV/badge from JSON |
| Remove dead streams | `iptv-doctor clean` | Fresh M3U |
| Fix EPG IDs | `iptv-doctor epg check/fix` | JSON audit or fixed M3U |
| Publish badge | `iptv-doctor badge` | Shields endpoint JSON |
| World Cup metadata | `iptv-doctor worldcup` | XMLTV/iCal/placeholder M3U/HTML guide |
| MCP metadata tools | `iptv-doctor mcp` | stdio MCP server |
| Compliance guard | `pnpm compliance:scan` | CI failure on disallowed content |

## GitHub Action

Use `.github/workflows/iptv-health-example.yml` as a copyable template. The composite action in `action.yml` writes `report.html`, `report.json`, `report.csv`, and `badge.json`.

```yaml
- uses: xyzs996/iptv-doctor@v1
  with:
    playlist: playlist.m3u
    report: report.html
    json: report.json
    csv: report.csv
    badge: badge.json
```

## Release Artifacts

```bash
node --import tsx scripts/generate-release-artifacts.ts dist/release
```

The publish workflow generates World Cup XMLTV/iCal/placeholder M3U/HTML guide artifacts plus sample report and clean playlist files.
It also emits Linux, macOS, and Windows launcher artifacts that call `npx iptv-doctor` for a low-friction release entry point.

## Docker

```bash
docker run --rm -v "$PWD:/work" ghcr.io/xyzs996/iptv-doctor check /work/playlist.m3u --report /work/report.html
```

## Monorepo Layout

- `apps/iptv-doctor`: flagship CLI.
- `packages/iptv-core`: parser, probe engine, diagnostics, clean output, reports, compliance scan.
- `packages/match2epg`: EPG generation engine for `iptv-doctor worldcup`.
- `packages/sports-data`: tournament and legal viewing metadata.
- `apps/worldcup-tv-guide`, `apps/wc26-mcp-tv`, `apps/spoiler-free-iptv`, `apps/public-sports-tv-index`: campaign pages and later-stage examples.

## Documentation

- [Project proposal](docs/project-proposal.md): Chinese review document revised for GitHub star maximization.
- [Acceptance criteria](docs/acceptance-criteria.md): executable release checklist for Phase 1.

## Commands

```bash
pnpm install
pnpm --filter iptv-doctor doctor check playlist.m3u --report report.html --json report.json --csv report.csv
pnpm test
pnpm typecheck
pnpm build
```
